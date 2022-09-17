import { useState, useMemo } from 'react'
import {
  useFormContext,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { assets, chains } from 'chain-registry'
import { Chain, Asset } from '@chain-registry/types'
import {
  AccountSelector,
  InputLabel,
  NumberInput,
  TokenSelector,
} from '@croncat-ui/ui'
import {
  NATIVE_DECIMALS,
  chainColors,
  validatePositive,
  validateRequired,
} from '@croncat-ui/utils'
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

export const DCAComponent = () => {
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
      chain: supportedChains.find(({chain_name})=>chain_name==='juno')
    },
    {
      title: 'Main Account 1',
      address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '420690000', denom: 'uosmo' },
      chain: supportedChains.find(({chain_name})=>chain_name==='osmosis')
    },
  ]

  const assetList = assets.find(({chain_name})=>chain_name==='juno')
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

  return (
    <div aria-details='dca fields' className="my-8">
      <InputLabel name={t('form.from_account')} className="mb-2" />
      <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

      <br />

      <InputLabel name={t('form.from_token')} className="mb-2" />
      <TokenSelector tokens={tokens} onSelectedToken={tokenCallback} />

      <br />

      <InputLabel name={t('form.amount_total')} className="mb-2" />
      <NumberInput
        // disabled={!isCreating}
        // error={errors?.amount}
        fieldName={fieldNamePrefix + 'amount_total'}
        onMinus={() =>
          setValue(
            fieldNamePrefix + 'amount_total',
            Math.max(
              Number(spendTotalAmount) - 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        onPlus={() =>
          setValue(
            fieldNamePrefix + 'amount_total',
            Math.max(
              Number(spendTotalAmount) + 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        register={register}
        sizing="full"
        step={1 / 10 ** amountDecimals}
        defaultValue={10}
        validation={[validateRequired, validatePositive]}
      />

      <br />

      <InputLabel name={t('form.amount_to_swap_each')} className="mb-2" />
      <NumberInput
        // disabled={!isCreating}
        // error={errors?.amount}
        fieldName={fieldNamePrefix + 'amount_to_swap_each'}
        onMinus={() =>
          setValue(
            fieldNamePrefix + 'amount_to_swap_each',
            Math.max(
              Number(spendEachAmount) - 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        onPlus={() =>
          setValue(
            fieldNamePrefix + 'amount_to_swap_each',
            Math.max(
              Number(spendEachAmount) + 1,
              1 / 10 ** amountDecimals
            ).toString()
          )
        }
        register={register}
        sizing="full"
        step={1 / 10 ** amountDecimals}
        defaultValue={1}
        validation={[validateRequired, validatePositive]}
      />

      <hr className="my-8 w-1/2 mx-auto border-2 border-gray-50" />

      <InputLabel name={t('form.to_account')} className="mb-2" />
      <AccountSelector accounts={accounts} onSelectedAccount={accountCallback} />

      <br />

      <InputLabel name={t('form.to_token')} className="mb-2" />
      <TokenSelector tokens={tokens} onSelectedToken={tokenCallback} />
    </div>
  )
}