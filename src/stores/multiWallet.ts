import { defineStore } from "pinia";
import { fromBech32 } from "@cosmjs/encoding";
import { assets, chains } from "chain-registry";
import type { Chain, AssetList } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
import type { Coin, Account, ChainMetadata } from "@/utils/types";
import { chainColors, unsupportedChainIds } from "@/utils/constants";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";

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

export const getChainFromChainId = (
  chainId: string | undefined,
  chains: ChainMetadata[]
): ChainMetadata | undefined => {
  if (!chainId) return;
  return chains.filter((c) => chainId == c.chain?.chain_id)[0];
};

export const getFeeDenomFromChain = (
  chain: any
): string => {
  if (!chain) return '';
  return chain.chain?.fees?.fee_tokens[0].denom || chain.assetList.assets[0].base
};

export const getChainData = (chain: any) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  );
  const asset = assetList?.assets[0];

  return {
    asset,
    chain,
    brandColor: chainColors[chain.chain_id],
    supported: !unsupportedChainIds.includes(chain.chain_id),
  };
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
      accounts: (state: any) => state._accounts,
    },
    actions: {
      async init() {
        // RESETS
        this.closeWalletPicker()

        // TODO: Filter chains based on deployed contracts available!
        // TODO: Lock to only testnet OR mainnet
        // Filters to only known colors, because we don't yet support ALL chains out the gate
        // NOTE: In the future, this list will start by the factory registries
        const filteredChains: Chain[] = chains.filter((c) => Object.keys(chainColors).includes(c.chain_id));
        this._networks = filteredChains.map(getChainData);

        const walletManager: any = WalletProvider({
          chains: filteredChains,
          assetLists: assets,
          wallets: [...keplrWallet, ...cosmostationWallets, ...leapwallets],
          signerOptions: {
            signingStargate: (chain: Chain) => {
              switch (chain.chain_name) {
                case "osmosis":
                  return {
                    gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
                  };
                default:
                  return void 0;
              }
            },
            signingCosmwasm: (chain: Chain) => undefined,
          },
          endpointOptions: {
            somechainname: {
              rpc: ["http://test.com"],
            },
          },
        })
        this._walletManager = walletManager;
      },
      async connectChainAccount(walletName: string, chain_id: string | null) {
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
      // TODO:
      // async queryContract() {
      //   if (!this.config || !this.config.contractAddress) return
      //   const msg = msgHandler.getConfig()
      //   try {
      //     res = await this.querier.queryContractSmart(this.config.contractAddress, msg)
      //     if (res) this.update({ key: 'contractConfig', value: res })
      //   } catch (e) {
      //   }
      // },
      // TODO:
      // async execContract() {
      //   await this.signer.execute(
      //     this.account.address,
      //     this.config.contractAddress,
      //     msg,
      //     fee,
      //     memo,
      //     funds,
      //   )
      //   if (!this.config || !this.config.contractAddress) return
      //   const msg = msgHandler.getConfig()
      //   try {
      //     res = await this.querier.queryContractSmart(this.config.contractAddress, msg)
      //     if (res) this.update({ key: 'contractConfig', value: res })
      //   } catch (e) {
      //   }
      // },
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
        const { prefix } = fromBech32(account.address);
        const n = this._networks.filter((n: Chain) => n.chain?.bech32_prefix === prefix);
        return n && n[0] ? n[0].chain : {};
      },

      getChainMetadataForAccount(account: Account) {
        const chain = this.getNetworkForAccount(account)
        const assetList = assets.find(
          ({ chain_name }: any) => chain_name === chain.chain_name
        )
        const asset = assetList?.assets[0]
        return {
          ...chain,
          asset,
          brandColor: chainColors[chain.chain_id],
        }
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
