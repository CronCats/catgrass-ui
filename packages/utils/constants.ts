export const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV

export const SITE_URL =
  // On local dev or production vercel, use manually set domain.
  !VERCEL_ENV || VERCEL_ENV === 'production'
    ? (process.env.NEXT_PUBLIC_SITE_URL as string)
    : // Use vercel deployment URL if on preview or development vercel build.
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

export const SITE_IMAGE = process.env.NEXT_PUBLIC_SITE_IMAGE as string
export const WC_ICON_PATH = process.env.NEXT_PUBLIC_WC_ICON_PATH as string
export const LEGACY_URL_PREFIX = process.env
  .NEXT_PUBLIC_LEGACY_URL_PREFIX as string

export const NATIVE_DECIMALS = 6
export const NATIVE_DENOM = process.env.NEXT_PUBLIC_FEE_DENOM as string

export const STATUS_COLORS: { [key: string]: string } = {
  open: '#00BAFF',
  draft: '#00F',
  executed: '#53D0C9',
  passed: '#6A78FF',
  rejected: '#ED5276',
}

export const CHAIN_ID = (process.env.NEXT_PUBLIC_CHAIN_ID as string) || 'juno-1'
export const CHAIN_NAME = process.env.NEXT_PUBLIC_CHAIN_NAME as string
export const CHAIN_TXN_URL_PREFIX = process.env
  .NEXT_PUBLIC_CHAIN_TXN_URL_PREFIX as string
export const CHAIN_RPC_ENDPOINT = process.env
  .NEXT_PUBLIC_CHAIN_RPC_ENDPOINT as string
export const CHAIN_REST_ENDPOINT = process.env
  .NEXT_PUBLIC_CHAIN_REST_ENDPOINT as string
export const CHAIN_BECH32_PREFIX = process.env
  .NEXT_PUBLIC_CHAIN_BECH32_PREFIX as string

export const CI = process.env.CI === 'true'

export const JUNO_BLOCKS_PER_YEAR = 5086451

// DAO Name min/max defined in cw-core.
export const MIN_DAO_NAME_LENGTH = parseInt(
  process.env.NEXT_PUBLIC_MIN_DAO_NAME_LENGTH || '3',
  10
)
export const MAX_DAO_NAME_LENGTH = parseInt(
  process.env.NEXT_PUBLIC_MAX_DAO_NAME_LENGTH || '50',
  10
)

export const MAX_META_CHARS_PROPOSAL_DESCRIPTION = parseInt(
  process.env.NEXT_PUBLIC_MAX_META_CHARS_PROPOSAL_DESCRIPTION || '200',
  10
)

export const DAO_STATIC_PROPS_CACHE_SECONDS = parseInt(
  process.env.NEXT_PUBLIC_DAO_STATIC_PROPS_CACHE_SECONDS ||
    // 5 minutes
    (60 * 5).toString(),
  10
)

// Lame hardcoding i know... in future, process image and find main theme
export const chainColors: Record<string, any> = {
  'juno-1': '#F0827D',
  'osmosis-1': '#4F01A8',
  'stargaze-1': '#80D5C0',
  'cosmoshub-4': '#2E3148',
}
