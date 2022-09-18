import { Chain } from '@chain-registry/types'
import {
  AdjustmentsVerticalIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUturnDownIcon,
  BoltIcon,
  CalendarDaysIcon,
  ClockIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline'
import { assets, chains } from 'chain-registry'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Interval } from '@croncat-ui/actions'
import {
  AddressInput,
  InputLabel,
  NumberInput,
  SelectList,
  SelectListItem,
  SelectComboInput,
  SelectComboItem,
} from '@croncat-ui/ui'
import {
  NATIVE_DECIMALS,
  chainColors,
  validateAddress,
  validateRequired,
  validatePositive,
} from '@croncat-ui/utils'

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

export const CadenceBoundaryComponent = () => {
  const { register, watch, setValue } = useFormContext()
  const { t } = useTranslation()

  const unsupportedChainIds = ['cosmoshub-4']
  const supportedChainIds = Object.keys(chainColors).filter(
    (id) => !unsupportedChainIds.includes(id)
  )
  const supportedChains = chains
    .filter((c) => supportedChainIds.includes(c.chain_id))
    .map(getChainData)

  const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
  const tokens = assetList?.assets || []

  const fieldNamePrefix = 'form.'
  const spendTotalAmount = watch(fieldNamePrefix + 'amount_total')
  const spendTotalDenom = watch(fieldNamePrefix + 'amount_total_denom')
  const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
  const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const intervalUxOptions = [
    {
      sort: 1,
      Icon: CalendarDaysIcon,
      title: 'Every Day',
      type: 'cron_daily',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '0 0 * * *',
      },
    },
    {
      sort: 2,
      Icon: ClockIcon,
      title: 'Every Hour',
      type: 'cron_hourly',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '0 * * * *',
      },
    },
    {
      sort: 3,
      Icon: ClockIcon,
      title: 'Every Minute',
      type: 'cron_minutely',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '* * * * *',
      },
    },
    {
      sort: 4,
      Icon: RectangleStackIcon,
      title: 'Every 1000 Blocks',
      type: 'blocks_1000',
      data: {
        intervalType: Interval.Block,
        intervalValue: 1000,
      },
    },
    {
      sort: 5,
      Icon: ArrowTrendingUpIcon,
      title: 'When balance above',
      type: 'balance_gt',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: null,
      },
    },
    {
      sort: 6,
      Icon: ArrowTrendingDownIcon,
      title: 'When balance below',
      type: 'balance_lt',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: null,
      },
    },
    {
      sort: 10,
      Icon: AdjustmentsVerticalIcon,
      title: 'Custom',
      type: 'custom',
      data: {
        intervalType: null,
        intervalValue: null,
      },
    },
  ]

  // immediately, pick a time, pick a block, Funds run out
  const boundaryOptions = [
    {
      sort: 9,
      Icon: ClockIcon,
      title: 'Pick a time',
      type: 'cron_custom',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '',
      },
    },
    {
      sort: 11,
      Icon: RectangleStackIcon,
      title: 'Pick a block',
      type: 'blocks_custom',
      data: {
        intervalType: Interval.Block,
        intervalValue: 0, // TODO: Get current block + 1000
      },
    },
  ]
  const boundaryStartOptions = [
    {
      sort: 1,
      Icon: BoltIcon,
      title: 'Immediately',
      type: 'immediate',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: '',
      },
    },
  ].concat(boundaryOptions)
  const boundaryEndOptions = [
    {
      sort: 1,
      Icon: ArrowUturnDownIcon,
      title: 'When funds run out',
      type: 'event_funds_lt',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: '',
      },
      // rules: [] // TODO:
    },
  ].concat(boundaryOptions)

  // TODO: Add for custom
  const customUxOptions = [
    // {
    //   type: Interval.Once,
    //   title: 'One Time',
    // },
    // {
    //   type: Interval.Immediate,
    //   title: 'Immediately',
    // },
    {
      type: Interval.Block,
      title: 'Block Height',
    },
    {
      type: Interval.Cron,
      title: 'CronTab Spec',
    },
  ]

  const [selected, setSelected] = useState(intervalUxOptions[0])
  const [custom, setCustom] = useState(customUxOptions[0])
  const [customValue, setCustomValue] = useState(customUxOptions[0])
  const [selectedStart, setSelectedStart] = useState(boundaryStartOptions[0])
  const [selectedEnd, setSelectedEnd] = useState(boundaryEndOptions[0])

  const intervalUxCallback = (item: SelectListItem) => {
    console.log('intervalUxCallback', item)
    setSelected(item as any)
  }

  const customUxCallback = (option: SelectComboItem, value: number | string) => {
    console.log('customUxCallback', option, value)
    setCustom(option as any)
    setCustomValue(value as any)
  }

  const boundaryStartCallback = (start: SelectListItem) => {
    console.log('boundaryStartCallback', start)
    setSelectedStart(start as any)
  }

  const boundaryEndCallback = (end: SelectListItem) => {
    console.log('boundaryEndCallback', end)
    setSelectedEnd(end as any)
  }

  // TODO:
  // - Get current block height for selected networks
  // - set block/timestamp as defaults for start/end inputs
  // - Balance Gt/Lt input, address
  // - Custom input (choose cron, block interval)

  return (
    <div aria-details="dca fields" className="my-8 mb-24">
      <h3 className="mb-2 text-xl">{t('form.cadence_how_often')}</h3>
      <SelectList
        items={intervalUxOptions}
        onSelectedItem={intervalUxCallback}
      />

      {selected.type === 'custom' ? (
        <div className="mt-4">
          {custom.type === Interval.Block ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : ''}
          {custom.type === Interval.Cron ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : ''}
          <SelectComboInput
            // disabled={!isCreating}
            // error={errors?.amount}
            options={customUxOptions}
            onChange={customUxCallback}
            defaultValue={+new Date()}
            fieldNameInput={fieldNamePrefix + 'cadence_interval_input'}
            fieldNameSelect={fieldNamePrefix + 'cadence_interval_select'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />
        </div>
      ) : ''}

      {selected.type === 'balance_gt' || selected.type === 'balance_lt' ? (
        <div className="mt-4">
          <InputLabel className="mb-2" name={
            t('form.balance') + ' ' + (selected.type === 'balance_gt' ? t('form.gt') : t('form.lt'))
          } />
          <NumberInput
            // disabled={!isCreating}
            // error={errors?.amount}
            defaultValue={+new Date()}
            fieldName={fieldNamePrefix + 'cadence_interval'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />

          <InputLabel className="mb-2 mt-4" name={t('form.wallet_address')} />
          <AddressInput
            containerClassName="grow"
            disabled={false}
            // error={errors?.to}
            fieldName={fieldNamePrefix + 'to'}
            register={register}
            validation={[validateRequired, validateAddress]}
          />
        </div>
      ) : ''}

      <br />
      <br />

      <h3 className="mb-2 text-xl">{t('form.cadence_when_start')}</h3>
      <SelectList
        items={boundaryStartOptions}
        onSelectedItem={boundaryStartCallback}
      />

      {selectedStart.type === 'cron_custom' || selectedStart.type === 'blocks_custom' ? (
        <div className="mt-4">
          {selectedStart.type === 'blocks_custom' ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : ''}
          {selectedStart.type === 'cron_custom' ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : ''}
          <NumberInput
            // disabled={!isCreating}
            // error={errors?.amount}
            defaultValue={+new Date()}
            fieldName={fieldNamePrefix + 'cadence_start_number'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />
        </div>
      ) : ''}

      <br />
      <br />

      <h3 className="mb-2 text-xl">{t('form.cadence_when_end')}</h3>
      <SelectList
        items={boundaryEndOptions}
        onSelectedItem={boundaryEndCallback}
      />

      {selectedEnd.type === 'cron_custom' || selectedEnd.type === 'blocks_custom' ? (
        <div className="mt-4">
          {selectedEnd.type === 'blocks_custom' ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : ''}
          {selectedEnd.type === 'cron_custom' ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : ''}
          <NumberInput
            // disabled={!isCreating}
            // error={errors?.amount}
            defaultValue={+new Date()}
            fieldName={fieldNamePrefix + 'cadence_end_number'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />
        </div>
      ) : ''}
    </div>
  )
}
