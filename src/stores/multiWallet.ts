import { Buffer } from 'buffer';
// import WebSocket from 'ws';
import { ref, computed } from "vue";
import type { Ref } from "vue";
import { defineStore } from "pinia";
import { fromBech32 } from "@cosmjs/encoding";
import { assets, chains } from "chain-registry";
import type { Account, ChainMetadata } from "../utils/types";
import { chainColors, unsupportedChainIds } from "../utils/constants";

// @ts-ignore
window.Buffer = Buffer;
// window.WebSocket = WebSocket;

// --------------------------------
// Wallet provider testing
// --------------------------------
import type { Chain, AssetList } from "@chain-registry/types";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
// NOTE: these break because of ws not being provided from wallet connect properly, need to figure out vite build options
// import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as cosmostationWallets } from "../utils/cosmostation/src";
// import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as keplrWallet } from "../utils/keplr/src";
// const { wallets: keplrWallet } = require("../utils/keplr/src");
// import * as keplr from "@cosmos-kit/keplr";
// import { keplrExtensionInfo, KeplrExtensionWallet } from "@cosmos-kit/keplr";
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

// --------------------------------

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

export const getChainFromChainId = (
  chainId: string | undefined,
  chains: ChainMetadata[]
): ChainMetadata | undefined => {
  if (!chainId) return;
  return chains.filter((c) => chainId == c.chain?.chain_id)[0];
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
  () => {
    // TODO: Filter chains based on deployed contracts available!
    // TODO: Lock to testnet/mainnets
    // Filters to only known colors, because we don't yet support ALL chains out the gate
    // NOTE: In the future, this list will start by the factory registries
    const filteredChains: Chain[] = chains
      .filter((c) => Object.keys(chainColors).includes(c.chain_id));
    const filteredNetworks: ChainMetadata[] = filteredChains.map(getChainData);
    console.log("filteredNetworks", filteredNetworks);

    const walletManager: any = ref(WalletProvider({
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
    }))
    console.log('walletManager', walletManager.value);

    const networks: Ref<ChainMetadata[]> = ref(filteredNetworks || []);
    let accounts: Ref<Account[]> = ref([]);

    function addAccount(account: Account) {
      if (!account || !account.address.length) return;
      let as: Account[] = accounts.value;
      if (!as || typeof as === "number") return;
      as = uniq([account].concat(as), "address");
      accounts = ref(as);
    }

    function removeAccount(address: string) {
      accounts = ref(accounts.value.filter((a) => a.address == address));
    }

    function getNetworkForAccount(account: Account) {
      const { prefix } = fromBech32(account.address);
      const prefixes = networks.value.map((n) => n.chain?.bech32_prefix);
      const n = chains.filter((c) => prefixes.includes(prefix));
      return n && n[0] ? n[0] : {};
    }

    return {
      walletManager,
      networks,
      accounts,
      addAccount,
      removeAccount,
      getNetworkForAccount,
    };
  }
  // {
  //   state: () => ({
  //     walletManager: null as any,
  //     networks: [] as ChainMetadata[],
  //     accounts: [] as Account[],
  //   }),
  //   getters: {
  //     walletManager: (state) => state.walletManager,
  //     networks: (state) => state.networks,
  //     accounts: (state) => state.accounts,
  //   },
  //   actions: {
  //     async init() {
  //       // TODO: Filter chains based on deployed contracts available!
  //       // TODO: Lock to testnet/mainnets
  //       // Filters to only known colors, because we don't yet support ALL chains out the gate
  //       // NOTE: In the future, this list will start by the factory registries
  //       const filteredChains: Chain[] = chains.filter((c) => Object.keys(chainColors).includes(c.chain_id));
  //       this.networks = filteredChains.map(getChainData);
  //       console.log("filteredNetworks", this.networks);

  //       const walletManager: any = WalletProvider({
  //         chains: filteredChains,
  //         assetLists: assets,
  //         wallets: [...keplrWallet, ...cosmostationWallets, ...leapwallets],
  //         signerOptions: {
  //           signingStargate: (chain: Chain) => {
  //             switch (chain.chain_name) {
  //               case "osmosis":
  //                 return {
  //                   gasPrice: new GasPrice(Decimal.zero(1), "uosmo"),
  //                 };
  //               default:
  //                 return void 0;
  //             }
  //           },
  //           signingCosmwasm: (chain: Chain) => undefined,
  //         },
  //         endpointOptions: {
  //           somechainname: {
  //             rpc: ["http://test.com"],
  //           },
  //         },
  //       })
  //       console.log('walletManager', walletManager);
  //       this.walletManager = walletManager;
  //     },
  //     addAccount(account: Account) {
  //       if(!account || !account.address.length) return;
  //       let as: Account[] = this.accounts;
  //       if (!as || typeof as === "number") return;
  //       as = uniq([account].concat(as), "address");
  //       this.accounts = as;
  //     },

  //     removeAccount(address: string) {
  //       if (!this.accounts || this.accounts.length === 0) return
  //       this.accounts = this.accounts.filter((a) => a.address == address);
  //     },

  //     getNetworkForAccount(account: Account) {
  //       const { prefix } = fromBech32(account.address);
  //       const prefixes = this.networks.map((n) => n.chain?.bech32_prefix);
  //       const n = chains.filter((c) => prefixes.includes(prefix));
  //       return n && n[0] ? n[0] : {};
  //     },
  //   },
  // }
);
