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
  // WalletManager,
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
      _walletManager: null as any,
      _networks: [] as ChainMetadata[],
      _accounts: [] as Account[],
    }),
    getters: {
      walletManager: (state) => state._walletManager,
      networks: (state) => state._networks,
      accounts: (state) => state._accounts,
    },
    actions: {
      async init() {
        // TODO: Filter chains based on deployed contracts available!
        // TODO: Lock to testnet/mainnets
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
      async connectChainAccount(chainId: string) {
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
        setCurrentWallet(this.walletManager.walletNames[0])
        setCurrentChain(connectChain.name)
        await enable(chainId)
        if (isWalletDisconnected) await connect()

        const { address, username, } = this.walletManager;
        if (address && username) this.addAccount({ address, title: username, balance: getDefaultBalance() })
        const microDenom = getFeeDenomFromChain(connectChain);
        const balance = await this.checkNativeBalance(address, microDenom)
        if (balance) this.addAccount({ address, title: username, balance })
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
        const prefixes = this._networks.map((n) => n.chain?.bech32_prefix);
        const n = chains.filter((c) => prefixes.includes(prefix));
        return n && n[0] ? n[0] : {};
      },
    },
  }
);
