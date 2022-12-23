import { defineStore } from "pinia";
import { fromBech32 } from "@cosmjs/encoding";
import { assets, chains } from "chain-registry";
import type { Chain, AssetList } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import type { StdFee } from "@cosmjs/stargate";
import { GasPrice, calculateFee, QueryClient, SigningStargateClient } from "@cosmjs/stargate";
import { encodeAsAny } from "@cosmjs/proto-signing";
import { CosmWasmClient, setupWasmExtension } from '@cosmjs/cosmwasm-stargate';
import { BlockResponse, HttpBatchClient, Tendermint34Client, TxResponse } from "@cosmjs/tendermint-rpc";
import { cwMsgToEncodeObject } from "@/utils/cwMsgToEncodeObject"
import { CwCroncatCoreQueryClient } from "@/utils/contracts/cw-croncat-core/CwCroncatCore.client"
import type { Addr, Coin, Account, ChainMetadata } from "@/utils/types";
import { getChainData, uniq } from "@/utils/helpers";
import { appConfig, filteredChainNames, deployedContracts } from "@/utils/constants";
// import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
// import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { wallets as vectiswallets } from "@cosmos-kit/vectis";
// import { wallets as trustwallets } from "@cosmos-kit/trust";
// TODO: Soon!
// import { wallets as omniwallets } from "@cosmos-kit/omni";

// cache'd queriers, intentionally blank
const tmProviderCache: any = {}
const queryProviderCache: any = {
  // Example:
  // juno: QueryClient
}

import type {
  EndpointOptions,
  MainWalletBase,
  SessionOptions,
  SignerOptions,
  StorageOptions,
  ViewOptions,
} from '@cosmos-kit/core';
import { WalletManager } from '@cosmos-kit/core';

export const WalletProvider = ({
  chains,
  assetLists,
  wallets,
  signerOptions,
  viewOptions,
  endpointOptions,
  storageOptions,
}: {
  chains: Chain[];
  assetLists: AssetList[];
  wallets: MainWalletBase[];
  signerOptions?: SignerOptions;
  viewOptions?: ViewOptions;
  endpointOptions?: EndpointOptions;
  storageOptions?: StorageOptions;
  sessionOptions?: SessionOptions;
}) => {
  return new WalletManager(
    chains,
    assetLists,
    wallets,
    signerOptions,
    viewOptions,
    endpointOptions,
    storageOptions
  )
};

export const getDefaultBalance = (microDenom = 'ujuno') => ({ amount: '0', denom: microDenom })

const hasChainName = (c: Chain, network_type: string): boolean => {
  const chainNameWithSuffix = (c: Chain) => `${c.chain_name}`.replace(network_type, '')
  return (filteredChainNames.includes(chainNameWithSuffix(c)) && c.network_type === network_type)
}

export const getChainFromChainId = (
  chainId: string | undefined,
  chains: ChainMetadata[]
): ChainMetadata | undefined => {
  if (!chainId) return;
  return chains.filter((c) => chainId == c.chain?.chain_id)[0];
};

export const getChainForAccount = (account: Account, networks: ChainMetadata[]) => {
  const { prefix } = fromBech32(account.address);
  const n = networks.filter((n: Chain) => n.chain?.bech32_prefix === prefix);
  return n && n[0] ? n[0].chain : {};
}

export const getFeeDenomFromChain = (
  chain: any
): string => {
  if (!chain) return '';
  return chain.chain?.fees?.fee_tokens[0].denom || chain.assetList.assets[0].base
};

export const getAccountsForNetwork = (
  network: ChainMetadata,
  accounts: Account[]
) => {
  return accounts.filter((a) => {
    const { prefix } = fromBech32(a.address);
    return prefix == network.chain?.bech32_prefix;
  });
};

export const appendAccountsToNetworks = (
  networks: ChainMetadata[],
  accounts: Account[]
) =>
  networks.map((n) => {
    return { ...n, accounts: getAccountsForNetwork(n, accounts) };
  });

export const useMultiWallet = defineStore(
  "litterbox", // so you're too disgusted to inspect it
  {
    state: () => ({
      _walletPickerOpen: false as boolean,
      _walletPickerState: 0 as number,
      _walletPickerStatus: 'Empty' as string,
      _walletPickerChainId: 'Empty' as string,
      _walletManager: null as any,
      _networks: [] as ChainMetadata[],
      _accounts: [] as Account[],
    }),
    getters: {
      walletPickerOpen: (state: any) => state._walletPickerOpen,
      walletPickerState: (state: any) => state._walletPickerState,
      walletPickerStatus: (state: any) => state._walletPickerStatus,
      walletPickerChainId: (state: any) => state._walletPickerChainId,
      walletManager: (state: any) => state._walletManager,
      currentWallet: (state: any) => state._walletManager.currentWallet,
      networks: (state: any) => state._networks,
      accounts: (state: any) => {
        return state._accounts.map((account: Account) => {
          const chain = getChainForAccount(account, state._networks)
          return { ...account, ...getChainData(chain) }
        })
      },
    },
    actions: {
      async init() {
        // RESETS
        this.closeWalletPicker()

        // Filters to only deployed contract networks, because we don't yet support ALL chains out the gate
        // NOTE: In the future, this list will start by the factory registries
        const networkType = appConfig.networkType;
        const filteredChains: Chain[] = chains.filter((c: Chain) => hasChainName(c, networkType));        
        this._networks = filteredChains.map(getChainData);

        const walletManager: any = WalletProvider({
          chains: filteredChains,
          assetLists: assets,
          wallets: [
            // ...keplrWallet,
            // ...cosmostationWallets,
            ...leapwallets,
            ...vectiswallets,
            // ...trustwallets,
            // ...omniwallets,
          ],
          signerOptions: {
            signingStargate: (chain: Chain) => {
              let gasPrice: any = `0.04${chain.bech32_prefix}`
              if (chain?.fees && chain?.fees.fee_tokens) {
                const fee = chain?.fees.fee_tokens[0]
                const feeUnit = `${fee.low_gas_price || fee.fixed_min_gas_price}${fee.denom.replace('u', '')}`
                gasPrice = GasPrice.fromString(feeUnit)
              }
              return { gasPrice };
            },
            signingCosmwasm: (chain: Chain) => {
              let gasPrice: any = `0.04${chain.bech32_prefix}`
              if (chain?.fees && chain?.fees.fee_tokens) {
                const fee = chain?.fees.fee_tokens[0]
                const feeUnit = `${fee.low_gas_price || fee.fixed_min_gas_price}${fee.denom.replace('u', '')}`
                gasPrice = GasPrice.fromString(feeUnit)
              }
              return { gasPrice };
            },
          },
          endpointOptions: {
            somechainname: {
              rpc: ["http://test.com"],
            },
          },
        })

        // Init Defaults
        walletManager.setCurrentWallet(walletManager.wallets[0].walletName)
        walletManager.setCurrentChain(filteredChains[1].chain_name)
        
        this._walletManager = walletManager;
      },
      async connectChainAccount(walletName: string, chain_id?: string) {
        const chainId = chain_id || this.walletPickerChainId
        const {
          onMounted,
          setCurrentWallet,
          setCurrentChain,
          enable,
          connect,
          isWalletDisconnected,
        } = this.walletManager;
        const connectChains = this.walletManager.chainRecords.filter((cc: any) => cc.chain.chain_id === chainId)
        const connectChain = connectChains[0]

        await onMounted()
        setCurrentWallet(walletName)
        setCurrentChain(connectChain.name)
        await enable(chainId)
        if (isWalletDisconnected) await connect()

        const { address, username, } = this.walletManager;
        const microDenom = getFeeDenomFromChain(connectChain);
        if (address && username) this.addAccount({ address, title: username, balance: getDefaultBalance(microDenom) })
        else return;

        // separate call to lazy load the balance
        const balance = await this.checkNativeBalance(address, microDenom)
        const connectedAccount = { address, title: username, balance, walletName }
        if (balance) this.addAccount(connectedAccount)
        return connectedAccount
      },
      async checkNativeBalance(address: string, microDenom: string): Promise<Coin> {
        const addr = address
        if (!addr) return { amount: '0', denom: microDenom };
        const { getSigningCosmWasmClient } = this.walletManager;
        const client = await getSigningCosmWasmClient()
        try {
          const balance = await client.getBalance(addr, microDenom)
          return balance
        } catch (e) {
          return { amount: '0', denom: microDenom }
        }
      },
      // NON-Signer, Cached querier -- needs to be decoupled from a signed in wallet for all kinds of non-wallet info scenarios
      async querier(chainName: string, batchSizeLimit?: number, dispatchInterval?: number) {
        if (!chainName) return Promise.reject('Missing required params')
        let querier = tmProviderCache[chainName]
        if (!querier) {
          // Cache this for future use, walletManager does nice fallback logic
          await this.walletManager.setCurrentChain(chainName)
          const rpcEndpoint = await this.walletManager.getRpcEndpoint()
          try {
            const httpBatchClient = new HttpBatchClient(rpcEndpoint, {
              batchSizeLimit: batchSizeLimit || 5,
              dispatchInterval: dispatchInterval || 1 * 1000
            })
            querier = await Tendermint34Client.create(httpBatchClient)
          } catch (e) {
            return Promise.reject(e)
          }
        }

        if (!querier || !querier.status) return Promise.reject('Requires RPC connection');
        tmProviderCache[chainName] = querier
        return querier
      },

      // NON-Signer, Cached querier -- needs to be decoupled from a signed in wallet for all kinds of non-wallet info scenarios
      async getQuerier(prefix: string) {
        if (!prefix) return Promise.reject('Missing required params')
        let querier = queryProviderCache[prefix]
        if (!querier) {
          // Cache this for future use, walletManager does nice fallback logic
          const rpcEndpoint = await this.walletManager.getRpcEndpoint()
          querier = await CosmWasmClient.connect(rpcEndpoint)
        }
        
        if (!querier || !querier.queryContractSmart) return Promise.reject('Requires RPC connection');
        queryProviderCache[prefix] = querier

        return querier
      },

      // NON-Signer, Cached querier -- needs to be decoupled from a signed in wallet for all kinds of non-wallet info scenarios
      async queryContract(contractAddr: string, queryMsg: any, type?: string) {
        if (!contractAddr || !queryMsg) return Promise.reject('Missing required params')
        // Derive the current chain name from contract bech32
        const { prefix } = fromBech32(contractAddr);
        let querier = this.getQuerier(prefix)

        try {
          const res = await querier.queryContractSmart(contractAddr, queryMsg)
          return res
        } catch (e) {
          return Promise.reject(e)
        }
      },

      async getSignerClient(account: Account) {
        // Quick check if wallet is ready or needs nudge:
        const { address, username } = this.walletManager;
        if (!address || !username || account.address !== address) {
          // Derive the wallet & chain ID from account
          const chain = this.getNetworkForAccount(account)
          const walletName = account.walletName || ''
          await this.connectChainAccount(walletName, chain.chain_id)
        }

        // Now we have the account loaded, get signer
        return this.walletManager.getSigningCosmWasmClient()
        // return this.walletManager.getSigningStargateClient()
      },

      async execContract(account: Account, contractAddr: string, msg: any, fee?: any, memo?: any, funds?: any) {
        if (!account || !contractAddr || !msg) return Promise.reject('Missing required params')
        const signer = await this.getSignerClient(account)

        try {
          // NOTE: uses 'executeMultiple' under the hood
          const res = await signer.execute(
            account.address,
            contractAddr,
            msg,
            fee,
            memo = "",
            funds,
          )
          return res
        } catch (e) {
          return Promise.reject(e)
        }
      },

      async simulateExec(account: Account, msgs: any[], memo?: string) {
        if (!account) return Promise.reject('Missing required params')
        const signer = await this.getSignerClient(account)

        try {
          const encodedMsgs = msgs.map((msg) => cwMsgToEncodeObject(msg.msg, account.address))
          const res = await signer.simulate(
            account.address,
            encodedMsgs,
            'auto',
          );
          
          // gasEstimated
          return res
        } catch (e) {
          // Handle errors! Mostlikely the signer doesn't match the active in keplr/wallet. Tell user to check that.
          return Promise.reject(e)
        }
      },

      calcFee(gasLimit: number, chain: Chain): StdFee | undefined {
        const feeToken = chain.fees?.fee_tokens[0]
        if (!feeToken || !feeToken.denom) return;
        console.log('feeToken', feeToken);
        
        const gasPrice = GasPrice.fromString(`${feeToken?.average_gas_price}${feeToken?.denom}`)
        console.log('gasPrice', gasPrice);
        if (!gasPrice) return;
        console.log('fake fee', feeToken.average_gas_price * gasLimit);

        // Fee: (gas / exponent * price) example: 635024/1000000*0.04 = 0.025401 units
        return calculateFee(gasLimit, gasPrice)
      },

      // bootstrapped contract methods
      async getManagerQueryInstance(chain: Chain | ChainMetadata) {
        const c = chain && chain.chain ? chain.chain : chain
        const chainName = `${c.chain_name}`.replace('testnet', '')
        let querier = await this.getQuerier(chainName)

        // manager addr based on network
        const contractAddr: string = deployedContracts[chainName].manager
        
        if (!contractAddr) return;

        return new CwCroncatCoreQueryClient(querier, contractAddr)
      },

      // contract address hleper
      getContractAddressesByChain(chain: Chain | ChainMetadata) {
        const c = chain && chain.chain ? chain.chain : chain
        const chainName = `${c.chain_name}`.replace('testnet', '')

        // available addrs based on network
        return deployedContracts[chainName]
      },

      addAccount(account: Account) {
        if(!account || !account.address.length) return;
        let as: Account[] = this.accounts;
        if (!as || typeof as === "number") return;
        as = uniq([account].concat(as), "address");
        this._accounts = as;
      },

      removeAccount(address: string) {
        if (!this.accounts || this.accounts.length === 0) return
        this._accounts = this.accounts.filter((a) => a.address != address);
      },

      getNetworkForAccount(account: Account) {
        return getChainForAccount(account, this._networks)
      },

      getChainMetadataForAccount(account: Account) {
        return getChainData(getChainForAccount(account, this._networks))
      },

      // Wallet picker thangs
      openWalletPicker(chainId: string) {
        this._walletPickerChainId = chainId
        this._walletPickerOpen = true
      },
      closeWalletPicker() {
        this._walletPickerOpen = false
      },
    },
  }
);
