import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { fromBech32 } from "@cosmjs/encoding";
import { assets, chains } from "chain-registry";
import type { Ref } from "vue";
import type { Account, ChainMetadata } from "../utils/types";
import { chainColors, unsupportedChainIds } from "../utils/constants";
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

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
    // Filters to only known colors, because we don't yet support ALL chains out the gate
    // NOTE: In the future, this list will start by the factory registries
    const filteredNetworks: ChainMetadata[] = chains
      .filter((c) => Object.keys(chainColors).includes(c.chain_id))
      .map(getChainData);
    console.log("filteredNetworks", filteredNetworks);

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
      networks,
      accounts,
      addAccount,
      removeAccount,
      getNetworkForAccount,
    };
  }
);
