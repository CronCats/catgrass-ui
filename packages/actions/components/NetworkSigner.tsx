import { Asset, Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, InputLabel, LogoFromImage } from '@croncat-ui/ui'
import { NATIVE_DECIMALS, chainColors } from '@croncat-ui/utils'

import { ChainMetadata } from '..'

// TODO: fake data, remove once wallet finished
const getChainData = (chain: Chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    chain,
    asset,
    brandColor: chainColors[chain.chain_id],
  }
}

export const NetworkSignerComponent = () => {
  const { register, watch, setValue } = useFormContext()
  const { t } = useTranslation()

  const unsupportedChainIds = ['cosmoshub-4']
  const supportedChainIds = Object.keys(chainColors).filter(
    (id) => !unsupportedChainIds.includes(id)
  )
  const supportedChains = chains
    .filter((c) => supportedChainIds.includes(c.chain_id))
    .map(getChainData)

  const chainItems = [supportedChains[0]]

  const stakeActions: { type: string; name: string }[] = [
    {
      type: 'StakeType.Delegate',
      name: 'Delegate',
    },
    {
      type: 'StakeType.Undelegate',
      name: 'Undelegate',
    },
    {
      type: 'StakeType.Redelegate',
      name: 'Redelegate',
    },
    {
      type: 'StakeType.WithdrawDelegatorReward',
      name: 'Claim Rewards',
    },
  ]

  const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
  const tokens = assetList?.assets || []

  const fieldNamePrefix = 'form.'
  const spendTotalAmount = watch(fieldNamePrefix + 'amount_total')
  const spendTotalDenom = watch(fieldNamePrefix + 'amount_total_denom')
  const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
  const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const tokenCallback = (token: Asset) => {
    console.log('tokenCallback', token)
    setSelectedToken(token)
  }

  const amountDecimals = useMemo(
    () => NATIVE_DECIMALS,
    [spendTotalDenom, selectedToken]
  )

  return (
    <div aria-details="dca fields" className="my-8">
      <h3 className="mb-2 text-xl">{t('form.signer_sign_txns')}</h3>

      <div className="my-12">
        {chainItems.map((item) => (
          <div key={item.chain.chain_id}>
            <ChainItem {...item} />
          </div>
        ))}
      </div>

      <hr className="my-8 mx-auto w-1/2 border-2 border-gray-100" />

      <InputLabel className="mb-2" name={t('form.note')} />
      <small className="text-gray-400">{t('form.signer_note_full')}</small>

      <br />
    </div>
  )
}

const ChainItem = ({ asset, brandColor, chain }: ChainMetadata) => (
  <div className="flex justify-between p-2 w-full cursor-pointer">
    <div className="flex my-auto w-full">
      <div className="flex-col py-2 mr-2" style={{ minWidth: '40px' }}>
        <LogoFromImage
          className="block mr-4"
          rounded={true}
          size="40"
          src={asset?.logo_URIs?.png || ''}
        />
      </div>
      <div className="flex-col py-2 m-auto w-full">
        <h3 className="text-lg font-bold leading-4">{chain?.pretty_name}</h3>
        <small className="text-xs text-gray-400 lowercase">
          {chain?.chain_id}
        </small>
      </div>
      <div className="flex-col py-2 m-auto w-auto">
        <Button className="min-w-[110px] bg-green-600 hover:bg-green-800">
          <span>Sign</span>
        </Button>
      </div>
    </div>
  </div>
)
