import axios from "axios";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { toBech32, fromBech32 } from "@cosmjs/encoding";
import config from "./config";

export const BASE_STARGAZE_CDN = "https://ipfs.stargaze.zone";
export const getIpfsCdnUrl = (cid, base = BASE_STARGAZE_CDN) => {
  const cdn = `${cid}`.replace("://", "/");
  return `${base}/${cdn}`;
};

let queryClient;
let collections;
let accountNfts = {};

export const toStars = (addr) => {
  try {
    const { prefix, data } = fromBech32(addr);
    // limit to prefixes coin type 118, known to work with keplr
    // https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e
    const compatiblePrefixes = ["osmo", "cosmos", "stars", "regen", "juno"];
    if (!compatiblePrefixes.includes(prefix)) {
      throw new Error("Address not compatible with Keplr: " + addr);
    }
    const starsAddr = toBech32("stars", data);
    // wallet address length 20, contract address length 32
    if (![20, 32].includes(data.length)) {
      throw new Error("Invalid address: " + addr + " " + starsAddr);
    }
    addr = starsAddr;
    return addr;
  } catch (e) {
    throw new Error("Invalid address: " + addr + "," + e);
  }
};

class StargazeProvider {
  getQueryClient = async (configName = "stargaze_testnet") => {
    if (queryClient) return queryClient;
    const starsConfig = config.getConfig(configName);
    queryClient = await CosmWasmClient.connect(starsConfig.rpcEndpoint);
    // console.log('LOADED:', configName)
    return queryClient;
  };

  // Format returned:
  // [
  //   {
  //     contractAddress: '',
  //     name: '',
  //     symbol: '',
  //     ...
  //   },
  // ]
  getCollections = async (
    minterCodeId = 2,
    collectionName = "stargaze_testnet_collections"
  ) => {
    if (collections) return collections;
    const starsCollection = config.getConfig(collectionName);
    if (!collections && starsCollection) {
      collections = starsCollection;
      return collections;
    }
    if (!queryClient) return [];
    const contracts = await queryClient.getContracts(minterCodeId);
    collections = [];

    for await (const contract of contracts) {
      const configResponse = await queryClient.queryContractSmart(contract, {
        config: {},
      });
      const contractAddress = configResponse.sg721_address;
      const collectionInfo = await queryClient.queryContractSmart(
        contractAddress,
        {
          // collection_info: {}, // has deeper collection metadata like description and thumb
          contract_info: {}, // name/symbol
        }
      );
      collections.push({
        contractAddress,
        ...collectionInfo,
      });
    }

    return collections;
  };

  // Format returned:
  // [
  //   {
  //     contractAddress: '',
  //     name: '',
  //     symbol: '',
  //     nfts: [
  //       {
  //         contract_addr: '',
  //         id: '',
  //         image_uri: '',
  //       }
  //     ]
  //   }
  // ]
  getAllNftsForAccount = async (owner, cacheBust = false) => {
    if (accountNfts && accountNfts[owner]) return accountNfts[owner];
    if (!owner || !queryClient || !collections) return [];
    const cacheKey = `nfts-${owner}`;

    // Double check localstorage
    if (!cacheBust) {
      try {
        const d = await localStorage.getItem(cacheKey);
        if (d) {
          const found = JSON.parse(d);
          if (found && found.length > 0) return found;
        }
      } catch (e) {
        // nuthin continue
      }
    }

    let nftData = [];

    // .slice(0, 3)
    for await (const coll of collections) {
      let nfts = [];
      const nft_tokens = await queryClient.queryContractSmart(
        coll.contractAddress,
        {
          tokens: { owner, limit: 30 },
        }
      );

      for await (let id of nft_tokens.tokens) {
        const tokenInfo = await queryClient.queryContractSmart(
          coll.contractAddress,
          {
            all_nft_info: { token_id: id },
          }
        );
        const tokenUri = tokenInfo.info.token_uri;
        try {
          const { data } = await axios.get(getIpfsCdnUrl(tokenUri));
          if (data) {
            // TODO: Filter out non-images
            nfts.push({
              contract_addr: `${coll.contractAddress}`,
              id: `${id}`,
              // image_uri: getIpfsCdnUrl(data.image) || '',
              image_uri: data.image || "",
            });
          }
        } catch (e) {
          // no complaining
        }
      }

      if (nfts.length > 0)
        nftData.push({
          ...coll,
          nfts,
        });
    }

    accountNfts[owner] = nftData;
    await localStorage.setItem(cacheKey, JSON.stringify(nftData));
    return nftData;
  };
}

export default new StargazeProvider();
