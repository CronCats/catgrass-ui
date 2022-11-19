// import type { Asset } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'

import { chainColors } from './constants'
import ibcAssets from './ibc_assets.json'
import type { AssetList, Coin, ChainMetadata, Chain, Expiration } from './types'

export const getChainMetaData = (chain: ChainMetadata) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain?.chain?.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    ...chain,
    asset,
    brandColor: chainColors[chain?.chain?.chain_id],
  }
}

export const unsupportedChainIds = ['cosmoshub-4']

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
  return udenom.replace('u', '');
}

export function toMicroDenom(denom: String) {
  return `u${denom}`;
}


export function convertMicroDenomToDenomWithDecimals(
  amount: number | string,
  decimals: number
) {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  amount = amount / Math.pow(10, decimals)
  return isNaN(amount) ? 0 : amount
}

export function convertDenomToMicroDenomWithDecimals(
  amount: number | string,
  decimals: number
): string {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  // Need to round. Example: `8.029409 * Math.pow(10, 6)`.
  amount = Math.round(amount * Math.pow(10, decimals))
  return isNaN(amount) ? '0' : String(amount)
}

export function convertFromMicroDenom(denom: string) {
  return denom?.substring(1).toUpperCase()
}

export function convertToFixedDecimals(amount: number | string): string {
  if (typeof amount === 'string') {
    amount = Number(amount)
  }
  if (amount > 0.01) {
    return amount.toFixed(2)
  } else return String(amount)
}

export const expirationAtTimeToSecondsFromNow = (exp: Expiration) => {
  if (!('at_time' in exp)) {
    return
  }

  const end = Number(exp['at_time'])
  const nowSeconds = new Date().getTime() / 1000
  const endSeconds = end / 1000000000

  return endSeconds - nowSeconds
}

export const zeroPad = (num: number, target: number) => {
  const s = num.toString()
  if (s.length >= target) {
    return s
  }
  return '0'.repeat(target - s.length) + s
}

export const spacePad = (number: string, target: number) =>
  number.length >= length ? number : ' '.repeat(target - number.length) + number


export function nativeTokenLabel(denom: string): string {
  // Search IBC asset strings (junoDenom) if denom is in IBC format.
  // Otherwise just check microdenoms.
  const asset = denom.startsWith('ibc')
    ? ibcAssets.tokens.find(({ junoDenom }) => junoDenom === denom)
    : ibcAssets.tokens.find(({ denom: d }) => d === denom)

  return (
    asset?.symbol ||
    (denom.startsWith('u') ? denom.substring(1) : denom).toUpperCase()
  )
}

export function nativeTokenLogoURI(denom: string): string | undefined {
  if (denom === 'ujuno' || denom === 'ujunox') {
    return '/juno-symbol.png'
  }

  const asset = denom.startsWith('ibc')
    ? ibcAssets.tokens.find(({ junoDenom }) => junoDenom === denom)
    : ibcAssets.tokens.find(({ denom: d }) => d === denom)
  return asset?.logoURI
}

export function nativeTokenDecimals(denom: string): number | undefined {
  const asset = denom.startsWith('ibc')
    ? ibcAssets.tokens.find(({ junoDenom }) => junoDenom === denom)
    : ibcAssets.tokens.find(({ denom: d }) => d === denom)
  return asset?.decimals
}
