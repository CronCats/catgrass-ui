import { Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { SuspenseLoader } from '@croncat-ui/common'
import { AccountSelector, InputLabel, Loader } from '@croncat-ui/ui'
import { chainColors } from '@croncat-ui/utils'

import { Account, CustomComponent } from '..'

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

export const CustomMessageComponent = () => {
  const { t } = useTranslation()
  const { register, control, watch, setValue } = useFormContext()
  const fieldNamePrefix = ''

  const unsupportedChainIds = ['cosmoshub-4']
  const supportedChainIds = Object.keys(chainColors).filter(
    (id) => !unsupportedChainIds.includes(id)
  )
  const supportedChains = chains
    .filter((c) => supportedChainIds.includes(c.chain_id))
    .map(getChainData)

  const accounts = [
    {
      key: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      value: {
        title: 'Dev Main Account',
        address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
        balance: { amount: '13370000', denom: 'ujuno' },
        chain: supportedChains.find(({ chain_name }) => chain_name === 'juno'),
      },
    },
    {
      key: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      value: {
        title: 'Main Account 1',
        address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
        balance: { amount: '420690000', denom: 'uosmo' },
        chain: supportedChains.find(
          ({ chain_name }) => chain_name === 'osmosis'
        ),
      },
    },
  ]

  const accountCallback = (account: Account) => {
    console.log('accountCallback', account)
  }

  return (
    <div aria-details="custom message fields" className="my-8 w-full min-h-24">
      <InputLabel className="mb-2" name={t('form.from_account')} />
      <Controller
        control={control}
        defaultValue={accounts[0]}
        name="from_account"
        render={({ field: { onChange } }) => {
          return (
            <AccountSelector
              onChange={onChange}
              options={accounts}
              // error={errors?.amount}
              // validation={[validateRequired, validatePositive]}
            />
          )
        }}
        rules={{ required: true }}
      />

      <br />
      <InputLabel className="mb-2" name={t('form.custom_message')} />
      <SuspenseLoader>
        <CustomComponent
          Loader={Loader}
          Logo={Loader}
          allActionsWithData={[]}
          coreAddress={''}
          data={[]}
          errors={[]}
          fieldNamePrefix={fieldNamePrefix + 'custom_message_json'}
          index={0}
          isCreating={true}
          onRemove={() => {}}
        />
      </SuspenseLoader>
    </div>
  )
}
