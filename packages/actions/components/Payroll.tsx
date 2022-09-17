import { Asset, Chain } from '@chain-registry/types'
import { PlusIcon } from '@heroicons/react/24/outline'
import { assets, chains } from 'chain-registry'
import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import {
  AccountSelector,
  AddressInput,
  Balance,
  Button,
  InputLabel,
  NumberInput,
  TokenSelector,
} from '@croncat-ui/ui'
import {
  NATIVE_DECIMALS,
  chainColors,
  validateAddress,
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

export const PayrollComponent = () => {
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

  const recipients = [
    {
      address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '13370000', denom: 'ujuno' },
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

  return (
    <div aria-details="dca fields" className="my-8">
      <InputLabel className="mb-2" name={t('form.from_account')} />
      <AccountSelector
        accounts={accounts}
        onSelectedAccount={accountCallback}
      />

      <br />

      <InputLabel className="mb-2" name={t('form.token')} />
      <TokenSelector onSelectedToken={tokenCallback} tokens={tokens} />

      <br />

      <InputLabel className="mb-2" name={t('form.amount_total')} />
      <NumberInput
        // disabled={!isCreating}
        // error={errors?.amount}
        defaultValue={10}
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
        validation={[validateRequired, validatePositive]}
      />

      <hr className="my-8 mx-auto w-1/2 border-2 border-gray-100" />

      <h3 className="mb-2 text-xl">Recipients</h3>

      <div className="p-2 pb-0 -mx-2 mt-4 bg-gray-50 rounded-lg md:p-4 md:pb-0 md:-mx-4">
        <InputLabel className="mb-2" name={t('form.recipientAddress')} />
        <AddressInput
          containerClassName="grow bg-white"
          disabled={false}
          // error={errors?.to}
          fieldName={fieldNamePrefix + 'to'}
          register={register}
          validation={[validateRequired, validateAddress]}
        />

        <br />

        <InputLabel className="mb-2" name={t('form.amount_to_receive_each')} />
        <NumberInput
          // disabled={!isCreating}
          // error={errors?.amount}
          containerClassName="bg-white"
          defaultValue={1}
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
          validation={[validateRequired, validatePositive]}
        />

        <Button className="mt-6 btn-success" variant="primary">
          <PlusIcon className="w-4" />
          <span>Add Recipient</span>
        </Button>

        <div className="p-2 -mx-2 mt-8 bg-gray-100 rounded-lg md:p-4 md:-mx-4">
          <div className="overflow-x-auto">
            <table className="table w-full table-compact">
              <thead>
                <tr>
                  <th></th>
                  <th>Address</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {recipients.map((r, index) => (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{r.address}</td>
                    <td>
                      <Balance {...r.balance} decimals={6} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
