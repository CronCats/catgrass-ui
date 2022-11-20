import { coin } from "@cosmjs/proto-signing";
import { encodeSecp256k1Pubkey } from "@cosmjs/amino";
import { fromMicroDenom } from "./helpers";

const CosmosCoinType = 118;
let savedKeplr;

export async function getKeplr() {
  let keplr;
  if (savedKeplr) {
    keplr = savedKeplr;
  } else if (window.keplr) {
    keplr = window.keplr;
  } else if (document.readyState === "complete") {
    keplr = window.keplr;
  } else {
    keplr = await new Promise((resolve) => {
      const documentStateChange = (event) => {
        if (event.target && event.target.readyState === "complete") {
          resolve(window.keplr);
          document.removeEventListener("readystatechange", documentStateChange);
        }
      };

      document.addEventListener("readystatechange", documentStateChange);
    });
  }

  if (!keplr) throw new Error("Keplr not found");
  if (!savedKeplr) savedKeplr = keplr;

  return keplr;
}

export function useKeplr(config) {
  try {
    getKeplr();
  } catch (e) {
    console.log(e instanceof Error ? e.message : JSON.stringify(e));
  }

  const getAccount = async () => {
    const keplr = await getKeplr();
    console.log(config);

    const { name: label, bech32Address: address } = await keplr.getKey(
      config["chainId"] || config["chain_id"]
    );

    return {
      label,
      address,
      type: "Keplr",
      balance: coin(0, config["microDenom"]),
    };
  };

  const suggestChain = async () => {
    const keplr = await getKeplr();

    const coinMinimalDenom = config["microDenom"];
    const coinDecimals = Number.parseInt(config["coinDecimals"]);
    const coinGeckoId = config["coinGeckoId"];
    const chainId = config["chainId"];
    const chainName = config["chainName"];
    const rpcEndpoint = config["rpcEndpoint"];
    const restEndpoint = config["restEndpoint"];
    const addrPrefix = config["addressPrefix"];
    const gasPrice = Number.parseFloat(config["gasPrice"]);
    const coin = fromMicroDenom(coinMinimalDenom);
    const coinDenom = coin.toUpperCase();

    await keplr.experimentalSuggestChain({
      chainId,
      chainName,
      rpc: rpcEndpoint,
      rest: restEndpoint,
      bip44: {
        coinType: CosmosCoinType,
      },
      bech32Config: {
        bech32PrefixAccAddr: addrPrefix,
        bech32PrefixAccPub: `${addrPrefix}pub`,
        bech32PrefixValAddr: `${addrPrefix}valoper`,
        bech32PrefixValPub: `${addrPrefix}valoperpub`,
        bech32PrefixConsAddr: `${addrPrefix}valcons`,
        bech32PrefixConsPub: `${addrPrefix}valconspub`,
      },
      currencies: [
        {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
        },
      ],
      feeCurrencies: [
        {
          coinDenom,
          coinMinimalDenom,
          coinDecimals,
          coinGeckoId,
        },
      ],
      stakeCurrency: {
        coinDenom,
        coinMinimalDenom,
        coinDecimals,
        coinGeckoId,
      },
      coinType: CosmosCoinType,
      gasPriceStep: {
        low: gasPrice / 2,
        average: gasPrice,
        high: gasPrice * 2,
      },
    });
  };

  const connect = async () => {
    try {
      await suggestChain();
      await getAccount();
    } catch (e) {
      console.log(e instanceof Error ? e.message : JSON.stringify(e));
    }
  };

  return { connect, suggestChain, getAccount };
}
