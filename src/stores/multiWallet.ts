import { defineStore } from "pinia";
import { fromBech32 } from "@cosmjs/encoding";
import { assets, chains } from "chain-registry";
import type { Chain, AssetList } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice, QueryClient } from "@cosmjs/stargate";
import { CosmWasmClient, setupWasmExtension } from '@cosmjs/cosmwasm-stargate';
import { BlockResponse, HttpBatchClient, Tendermint34Client, TxResponse } from "@cosmjs/tendermint-rpc";
import type { Coin, Account, ChainMetadata } from "@/utils/types";
import { getChainData } from "@/utils/helpers";
import { appConfig, filteredChainNames } from "@/utils/constants";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { wallets as vectiswallets } from "@cosmos-kit/vectis";
// TODO: Soon!
// import { wallets as trustwallets } from "@cosmos-kit/trust";

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

function uniq(a: any[], param: any) {
  return a.filter(function (item, pos, array) {
    return (
      array
        .map(function (mapItem) {
          return mapItem[param];
        })
        .indexOf(item[param]) === pos
    );
  });
}

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
          wallets: [...keplrWallet, ...cosmostationWallets, ...leapwallets, ...vectiswallets],
          signerOptions: {
            // TODO: Define these better!
            signingStargate: (chain: Chain) => {
              switch (chain.chain_name) {
                case "osmosis":
                  return {
                    gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
                  };
                case "juno":
                  return {
                    // gasPrice: new GasPrice("0.025", "ujuno"),
                    gasPrice: GasPrice.fromString("0.025juno"),
                  };
                default:
                  const fee = chain?.fees.fee_tokens[0]
                  return {
                    gasPrice: GasPrice.fromString(`${fee.low_gas_price}${fee.denom}`),
                  };
              }
            },
            // TODO: Define these better!
            signingCosmwasm: (chain: Chain) => {
              switch (chain.chain_name) {
                case "osmosis":
                  return {
                    gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
                  };
                case "juno":
                  return {
                    // gasPrice: new GasPrice("0.025", "ujuno"),
                    gasPrice: GasPrice.fromString("0.025juno"),
                  };
                default:
                  const fee = chain?.fees.fee_tokens[0]
                  return {
                    gasPrice: GasPrice.fromString(`${fee.low_gas_price}${fee.denom}`),
                  };
              }
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
      async querier(chainName: string) {
        if (!chainName) return Promise.reject('Missing required params')
        let querier = tmProviderCache[chainName]
        if (!querier) {
          // Cache this for future use, walletManager does nice fallback logic
          await this.walletManager.setCurrentChain(chainName)
          const rpcEndpoint = await this.walletManager.getRpcEndpoint()
          try {
            const httpBatchClient = new HttpBatchClient(rpcEndpoint, {
              batchSizeLimit: 5,
              dispatchInterval: 1 * 1000
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
      async queryContract(contractAddr: string, queryMsg: any, type?: string) {
        if (!contractAddr || !queryMsg) return Promise.reject('Missing required params')
        // Derive the current chain name from contract bech32
        const { prefix } = fromBech32(contractAddr);
        let querier = queryProviderCache[prefix]
        if (!querier) {
          // Cache this for future use, walletManager does nice fallback logic
          const rpcEndpoint = await this.walletManager.getRpcEndpoint()
          querier = await CosmWasmClient.connect(rpcEndpoint)
        }
        
        if (!querier || !querier.queryContractSmart) return Promise.reject('Requires RPC connection');
        queryProviderCache[prefix] = querier

        try {
          const res = await querier.queryContractSmart(contractAddr, queryMsg)
          return res
        } catch (e) {
          return Promise.reject(e)
        }
      },

      async execContract(account: Account, contractAddr: string, msg: any, fee?: any, memo?: any, funds?: any) {
        if (!account || !contractAddr || !msg) return Promise.reject('Missing required params')

        // Quick check if wallet is ready or needs nudge:
        const { address, username } = this.walletManager;
        if (!address || !username) {
          // Derive the wallet & chain ID from account
          const chain = this.getNetworkForAccount(account)
          const walletName = account.walletName || ''
          await this.connectChainAccount(walletName, chain.chain_id)
        }

        // Now we have the account loaded, get signer
        const signer = await this.walletManager.getSigningCosmWasmClient()

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
