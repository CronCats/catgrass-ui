import type { Asset } from '@chain-registry/types'
import { assets, chains } from "chain-registry";

import { chainColors, unsupportedChainNames, deployedContracts } from "./constants";
import ibcAssets from "./ibc_assets.json";
import { Interval } from './taskHelpers';
import type {
  AssetList,
  Boundary,
  Coin,
  ChainMetadata,
  Chain,
  Expiration,
  TaskRequest,
} from "./types";

export const uniq =(a: any[], param: any) => {
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

export const getChainData = (chain: any) => {
  const c = chain && chain.chain ? chain.chain : chain
  const chainName = `${c.chain_name}`.replace('testnet', '')
  
  const assetList = getChainAssetList(c);
  const asset = assetList ? assetList[0] : null;

  return {
    asset,
    chain,
    brandColor: chainColors[chainName],
    supported: !unsupportedChainNames.includes(chainName),
  };
};

export const getDeployedContractsByChain = (chain: any): any | undefined => {
  if (!chain || !chain.chain_name) return
  const chainName = chain.chain_name.replace('testnet', '')
  return deployedContracts[chainName]
};

export const getChainAssetList = (chain: any): Asset[] | undefined => {
  if (!chain || !chain.chain_name) return
  // const chainName = chain.chain_name.replace('testnet', '')
  const chainName = chain.chain_name
  return (assets.find(({ chain_name }: Asset) => chain_name === chainName))?.assets || [];
};

export const getAssetByDenomOnChain = (denom: string, chain: any): Asset | undefined => {
  const assetList = getChainAssetList(chain)
  if (!assetList) return;
  
  return assetList.find((a: Asset) => {
    return a.denom_units.find(d => d.denom === fromMicroDenom(`${denom}`))
  })
}

// Formats junoswap denom/decimals to chain registry formatting in denom_units
export const getDenomUnitsFromPoolAssets = (asset: any): any[] => {
  const units = [
    {
      denom: asset.denom,
      exponent: 0,
    }
  ]

  if (asset.decimals) units.push({
    denom: asset.denom[0] === 'u' ? asset.denom.substring(1, asset.denom.length) : asset.denom,
    exponent: asset.decimals,
  })

  return units
}

export const isNativeAsset = (asset: Asset): boolean => {
  return !Object.keys(asset).includes('address')
}

export const isCw20Asset = (asset: Asset): boolean => {
  return asset.type_asset === 'cw20'
}

export function getBalanceFromAmountAsset(amount: string, asset: Asset): Coin | null {
  const base = asset.base
  const unit = asset.denom_units.find(({denom}) => denom != base)
  const decimals = `${unit?.exponent || 0}`
  const coin: Coin = { amount, denom: unit?.denom || fromMicroDenom(base) }

  // Convert to base micro amt
  return toMicroCoin(coin, decimals)
}

export function fromMicroCoin(coin: Coin, coinDecimals: string) {
  return {
    amount: fromMicroAmount(coin.amount, coinDecimals),
    denom: fromMicroDenom(coin.denom),
  };
}

export function toMicroCoin(coin: Coin, coinDecimals: string) {
  return {
    amount: toMicroAmount(coin.amount, coinDecimals),
    denom: toMicroDenom(coin.denom),
  };
}

export function toMicroAmount(amount: string, coinDecimals: string) {
  return String(
    Number.parseFloat(amount) * Math.pow(10, Number.parseInt(coinDecimals))
  );
}

export function fromMicroAmount(amount: string, coinDecimals: string) {
  return String(
    Number.parseInt(amount) / Math.pow(10, Number.parseInt(coinDecimals))
  );
}

export function fromMicroDenom(udenom: String) {
  return udenom.replace("u", "");
}

export function toMicroDenom(denom: String) {
  return `u${denom}`;
}

export function convertMicroDenomToDenomWithDecimals(
  amount: number | string,
  decimals: number
) {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount / Math.pow(10, decimals);
  return isNaN(amount) ? 0 : amount;
}

export function convertDenomToMicroDenomWithDecimals(
  amount: number | string,
  decimals: number
): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  // Need to round. Example: `8.029409 * Math.pow(10, 6)`.
  amount = Math.round(amount * Math.pow(10, decimals));
  return isNaN(amount) ? "0" : String(amount);
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase();
}

export function convertToFixedDecimals(amount: number | string): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  if (amount > 0.01) {
    return amount.toFixed(2);
  } else return String(amount);
}

export const expirationAtTimeToSecondsFromNow = (exp: Expiration) => {
  if (!("at_time" in exp)) {
    return;
  }

  const end = Number(exp["at_time"]);
  const nowSeconds = new Date().getTime() / 1000;
  const endSeconds = end / 1000000000;

  return endSeconds - nowSeconds;
};

export const zeroPad = (num: number, target: number) => {
  const s = num.toString();
  if (s.length >= target) {
    return s;
  }
  return "0".repeat(target - s.length) + s;
};

export const spacePad = (number: string, target: number) =>
  number.length >= length
    ? number
    : " ".repeat(target - number.length) + number;

export function nativeTokenLabel(denom: string): string {
  // Search IBC asset strings (junoDenom) if denom is in IBC format.
  // Otherwise just check microdenoms.
  const asset = denom.startsWith("ibc")
    ? ibcAssets.tokens.find(({ junoDenom }) => junoDenom === denom)
    : ibcAssets.tokens.find(({ denom: d }) => d === denom);

  return (
    asset?.symbol ||
    (denom.startsWith("u") ? denom.substring(1) : denom).toUpperCase()
  );
}

export function nativeTokenLogoURI(denom: string): string | undefined {
  if (denom === "ujuno" || denom === "ujunox") {
    return "/juno-symbol.png";
  }

  const asset = denom.startsWith("ibc")
    ? ibcAssets.tokens.find(({ junoDenom }) => junoDenom === denom)
    : ibcAssets.tokens.find(({ denom: d }) => d === denom);
  return asset?.logoURI;
}

export function nativeTokenDecimals(denom: string): number | undefined {
  const asset = denom.startsWith("ibc")
    ? ibcAssets.tokens.find(({ junoDenom }) => junoDenom === denom)
    : ibcAssets.tokens.find(({ denom: d }) => d === denom);
  return asset?.decimals;
}

export const addCommas = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const formatInterval = (interval: any) => {
  if (!interval) return ''

  let s = ''
  
  if (interval.Block) s = `Every ${interval.Block} blocks`
  else if (interval.Cron) s = `Cron Spec: "${interval.Cron}"`
  else s = interval

  return s
}

// Types:
// Timestamp: Return Humanized
// Block: Return CSV number
// Examples: 'When funds run out' | 'Tuesday, Oct 14th' | '5,134,948' | 'Immediately'
export const formatBoundary = (boundary: any, type: string) => {
  let s = null

  if (boundary?.Height && boundary?.Height[type]) {
    s = `Block ${addCommas(`${boundary.Height[type]}`)}`
  }

  if (boundary?.Time && boundary?.Time[type]) {
    const t = new Date(parseInt(boundary.Time[type]) / 1000)
    s = t.toLocaleString()
  }

  if (!s) s = type === 'start' ? 'Immediately' : 'When funds run out'

  return s
}

export const ellipseLongString = (str: any, len: number = 8) => {
  return `${str.substring(0, len / 2)}...${str.substring(str.length - (len / 2), str.length)}`
}
