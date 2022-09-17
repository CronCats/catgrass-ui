import { Asset, Chain } from '@chain-registry/types'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { assets, chains } from 'chain-registry'
import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { InputLabel } from '@croncat-ui/ui'
import { NATIVE_DECIMALS, chainColors } from '@croncat-ui/utils'

import { Account } from '..'

// TODO: fake data, remove once wallet finished
const getChainData = (chain: Chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    ...chain,
    asset,
    brandColor: chainColors[chain.chain_id],
  }
}

export const RecipeSummaryComponent = () => {
  const { register, watch, setValue } = useFormContext()
  const { t } = useTranslation()

  const unsupportedChainIds = ['cosmoshub-4']
  const supportedChainIds = Object.keys(chainColors).filter(
    (id) => !unsupportedChainIds.includes(id)
  )
  const supportedChains = chains
    .filter((c) => supportedChainIds.includes(c.chain_id))
    .map(getChainData)

  const accounts: Account[] = [
    {
      title: 'Dev Main Account',
      address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '13370000', denom: 'ujuno' },
      chain: supportedChains.find(({ chain_name }) => chain_name === 'juno'),
    },
    {
      title: 'Main Account 1',
      address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '420690000', denom: 'uosmo' },
      chain: supportedChains.find(({ chain_name }) => chain_name === 'osmosis'),
    },
  ]

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

  const accountCallback = (account: Account) => {
    console.log('accountCallback', account)
  }

  const tokenCallback = (token: Asset) => {
    console.log('tokenCallback', token)
    setSelectedToken(token)
  }

  const amountDecimals = useMemo(
    () => NATIVE_DECIMALS,
    [spendTotalDenom, selectedToken]
  )

  // DEMO DATA
  const actions = [
    {
      Icon: ArrowPathRoundedSquareIcon,
      title: t('form.action_dca_title'),
      subtitle: t('form.action_dca_subtitle'),
    },
  ]

  const rules = []

  const schedule = {
    interval: 'Every Day',
    start: 'Tuesday, Oct 14th',
    end: 'When funds run out',
  }

  const summary = {
    fees: '',
    funds: '',
    duration: '',
    occurances: '',
    signatures: '',
  }

  return (
    <div aria-details="dca fields" className="my-8">
      <h3 className="mb-2 text-xl">Confirm Details</h3>

      <InputLabel className="mb-2" name={t('form.actions')} />

      <br />

      {rules.length > 0 ? (
        <div>
          <InputLabel className="mb-2" name={t('form.rules')} />

          <br />
        </div>
      ) : (
        ''
      )}

      <InputLabel className="mb-2" name={t('form.schedule')} />

      <div className="py-2 px-4 bg-white rounded-lg">
        {Object.keys(schedule).map((k: string, i) => {
          return (
            <div key={i} className="flex justify-between my-1 uppercase">
              <span>{k}</span>
              <span>{schedule[k as keyof typeof schedule]}</span>
            </div>
          )
        })}
      </div>

      <br />

      <InputLabel className="mb-2" name={t('form.summary')} />

      <div className="py-2 px-4 bg-white rounded-lg">
        {Object.keys(summary).map((k: string, i) => {
          return (
            <div key={i} className="flex justify-between my-1 uppercase">
              <span>{k}</span>
              <span>{summary[k as keyof typeof summary]}</span>
            </div>
          )
        })}
      </div>

      <br />
    </div>
  )
}