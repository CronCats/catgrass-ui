import {
  convertMicroDenomToDenomWithDecimals,
  nativeTokenLabel,
  nativeTokenLogoURI,
} from '@croncat-ui/utils'

export interface BalanceProps {
  denom: string
  amount: string
  decimals: number
  imageUrl?: string
  usdcValue?: number
}

export interface BalanceIconProps {
  iconURI?: string
}

export const BalanceIcon = ({ iconURI }: BalanceIconProps) => {
  return (
    <div
      className="w-4 h-4 bg-brand bg-center bg-cover rounded-full"
      style={{
        backgroundImage: iconURI ? `url(${iconURI})` : '',
      }}
    ></div>
  )
}

export const UnknownAssetBalanceIcon = () => (
  <div className="inline-flex justify-center items-center w-4 h-4 text-black bg-disabled rounded-full">
    ?
  </div>
)

export const Balance = ({
  denom,
  amount,
  decimals,
  imageUrl,
}: BalanceProps) => {
  console.log('denom, amount, decimals', denom, amount, decimals)

  const symbol = nativeTokenLabel(denom)
  const icon = nativeTokenLogoURI(denom)
  const iconUrl = icon || imageUrl
  const formattedAmt = convertMicroDenomToDenomWithDecimals(
    amount,
    decimals
  ).toLocaleString(undefined, {
    maximumFractionDigits: decimals,
  })

  return (
    <span>
      {imageUrl ? (
        <BalanceIcon iconURI={iconUrl} />
      ) : (
        // <UnknownAssetBalanceIcon />
        ''
      )}
      {formattedAmt} {symbol}
    </span>
  )
}
