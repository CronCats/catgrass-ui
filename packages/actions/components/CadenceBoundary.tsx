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
import { useEffect, useState } from 'react'
import { useFormContext, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Interval } from '@croncat-ui/actions'
import {
  AddressInput,
  InputLabel,
  NumberInput,
  SelectList,
  SelectListOption,
  ComboInputSelect,
  ComboInputSelectValue,
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
  const { register, watch, control, formState } = useFormContext()
  // const { control } = useForm<FormState>()
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

  const fieldNamePrefix = ''
  // const combo = watch(fieldNamePrefix + 'combo')
  const spendTotalAmount = watch(fieldNamePrefix + 'amount_total')
  const spendTotalDenom = watch(fieldNamePrefix + 'amount_total_denom')
  const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
  const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const intervalUxOptions = [
    {
      key: 'cron_daily',
      value: {
        sort: 1,
        Icon: CalendarDaysIcon,
        title: 'Every Day',
        type: 'cron_daily',
        data: {
          intervalType: Interval.Cron,
          intervalValue: '0 0 * * *',
        },
      },
    },
    {
      key: 'cron_hourly',
      value: {
        sort: 2,
        Icon: ClockIcon,
        title: 'Every Hour',
        type: 'cron_hourly',
        data: {
          intervalType: Interval.Cron,
          intervalValue: '0 * * * *',
        },
      },
    },
    {
      key: 'cron_minutely',
      value: {
        sort: 3,
        Icon: ClockIcon,
        title: 'Every Minute',
        type: 'cron_minutely',
        data: {
          intervalType: Interval.Cron,
          intervalValue: '* * * * *',
        },
      },
    },
    {
      key: 'blocks_1000',
      value: {
        sort: 4,
        Icon: RectangleStackIcon,
        title: 'Every 1000 Blocks',
        type: 'blocks_1000',
        data: {
          intervalType: Interval.Block,
          intervalValue: 1000,
        },
      },
    },
    {
      key: 'balance_gt',
      value: {
        sort: 5,
        Icon: ArrowTrendingUpIcon,
        title: 'When balance above',
        type: 'balance_gt',
        data: {
          intervalType: Interval.Immediate,
          intervalValue: null,
        },
      },
    },
    {
      key: 'balance_lt',
      value: {
        sort: 6,
        Icon: ArrowTrendingDownIcon,
        title: 'When balance below',
        type: 'balance_lt',
        data: {
          intervalType: Interval.Immediate,
          intervalValue: null,
        },
      },
    },
    {
      key: 'custom',
      value: {
        sort: 10,
        Icon: AdjustmentsVerticalIcon,
        title: 'Custom',
        type: 'custom',
        data: {
          intervalType: null,
          intervalValue: null,
        },
      },
    },
  ]

  // immediately, pick a time, pick a block, Funds run out
  const boundaryOptions = [
    {
      key: 'cron_custom',
      value: {
        sort: 9,
        Icon: ClockIcon,
        title: 'Pick a time',
        type: 'cron_custom',
        data: {
          intervalType: Interval.Cron,
          intervalValue: '',
        },
      },
    },
    {
      key: 'blocks_custom',
      value: {
        sort: 11,
        Icon: RectangleStackIcon,
        title: 'Pick a block',
        type: 'blocks_custom',
        data: {
          intervalType: Interval.Block,
          intervalValue: 0, // TODO: Get current block + 1000
        },
      },
    },
  ]
  const boundaryStartOptions = [
    {
      key: 'immediate',
      value: {
        sort: 1,
        Icon: BoltIcon,
        title: 'Immediately',
        type: 'immediate',
        data: {
          intervalType: Interval.Immediate,
          intervalValue: '',
        },
      },
    },
  ].concat(boundaryOptions)
  const boundaryEndOptions = [
    {
      key: 'event_funds_lt',
      value: {
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
      key: t('form.block_interval'),
      value: Interval.Block,
      default: '100',
    },
    {
      key: t('form.cron_spec'),
      value: Interval.Cron,
      default: '0 0 * * *', // daily
    },
  ]

  // TODO: Add for custom
  const balanceLogicOptions = [
    {
      key: selectedToken.symbol,
      value: selectedToken.name,
      default: '1',
    },
    {
      key: tokens[1].symbol,
      value: tokens[1].name,
      default: '1',
    },
  ]

  const [intervalOption, setIntervalOption] = useState(intervalUxOptions[0])
  const [intervalCustom, setIntervalCustom] = useState(customUxOptions[0])
  const [intervalCustomValue, setintervalCustomValue] = useState(customUxOptions[0].default)
  const [selectedStart, setSelectedStart] = useState(boundaryStartOptions[0])
  const [selectedEnd, setSelectedEnd] = useState(boundaryEndOptions[0])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('watcher:', name, type, name ? value[name] : null)
      if (name === 'interval' && type === 'change') setIntervalOption(value[name])
      if (name === 'interval_custom' && type === 'change') {
        setIntervalCustom(value[name])
        setintervalCustomValue(value[name].value)
      }
      if (name === 'boundary_start' && type === 'change') setSelectedStart(value[name])
      if (name === 'boundary_end' && type === 'change') setSelectedEnd(value[name])
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // const validate = validation?.reduce(
  //   (a, v) => ({ ...a, [v.toString()]: v }),
  //   {}
  // )

  // TODO:
  // - Get current block height for selected networks
  // - set block/timestamp as defaults for start/end inputs
  // - Balance Gt/Lt input, address

  return (
    <div aria-details="dca fields" className="my-8 mb-24">
      <h3 className="mb-2 text-xl">{t('form.cadence_how_often')}</h3>
      <Controller
        name="interval"
        control={control}
        defaultValue={intervalUxOptions[0]}
        rules={{ required: true }}
        render={({ field: { onChange } }) => {
          return (
            <SelectList
              onChange={onChange}
              options={intervalUxOptions}
            // disabled={!isCreating}
            // error={errors?.amount}
            // validation={[validateRequired, validatePositive]}
            />
          );
        }}
      />

      {intervalOption.value?.type === 'custom' ? (
        <div className="mt-4">
          {intervalCustom.key === Interval.Block ? (
            <InputLabel className="mb-2" name={t('form.block_interval')} />
          ) : ''}
          {intervalCustom.key === Interval.Cron ? (
            <InputLabel className="mb-2" name={t('form.cron_spec')} />
          ) : ''}
          <Controller
            name="interval_custom"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => {
              return (
                <ComboInputSelect
                  onChange={onChange}
                  options={customUxOptions}
                // disabled={!isCreating}
                // error={errors?.amount}
                // validation={[validateRequired, validatePositive]}
                />
              );
            }}
          />

          {intervalCustom.key === Interval.Block ? (
            <small>{t('form.every') + ' ' + intervalCustomValue + ' ' + t('form.blocks')} </small>
          ) : ''}
          {intervalCustom.key === Interval.Cron ? (
            <small>{t('info.crontab_validator')} <a className="underline text-blue-600" target="_blank" href="https://crontab.guru/">{t('info.crontab_guru')}</a></small>
          ) : ''}
        </div>
      ) : ''}

      {intervalOption.value.type === 'balance_gt' || intervalOption.value.type === 'balance_lt' ? (
        <div className="mt-4">
          <InputLabel className="mb-2" name={
            t('form.balance') + ' ' + (intervalOption.value.type === 'balance_gt' ? t('form.gt') : t('form.lt'))
          } />
          <Controller
            name="rule_balance"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => {
              return (
                <ComboInputSelect
                  onChange={onChange}
                  options={balanceLogicOptions}
                />
              );
            }}
          />

          <InputLabel className="mb-2 mt-4" name={t('form.wallet_address_watch')} />
          <AddressInput
            containerClassName="grow"
            disabled={false}
            // error={errors?.to}
            fieldName={fieldNamePrefix + 'rule_balance_address'}
            register={register}
            // validation={[validateRequired, validateAddress]}
          />
        </div>
      ) : ''}

      <br />
      <br />

      <h3 className="mb-2 text-xl">{t('form.cadence_when_start')}</h3>
      <Controller
        name="boundary_start"
        control={control}
        defaultValue={boundaryStartOptions[0]}
        rules={{ required: true }}
        render={({ field: { onChange } }) => {
          return (
            <SelectList
              onChange={onChange}
              options={boundaryStartOptions}
            // disabled={!isCreating}
            // error={errors?.amount}
            // validation={[validateRequired, validatePositive]}
            />
          );
        }}
      />

      {selectedStart.value.type === 'cron_custom' || selectedStart.value.type === 'blocks_custom' ? (
        <div className="mt-4">
          {selectedStart.value.type === 'blocks_custom' ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : ''}
          {selectedStart.value.type === 'cron_custom' ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : ''}
          <NumberInput
            // disabled={!isCreating}
            // error={errors?.amount}
            // defaultValue={+new Date()}
            fieldName={fieldNamePrefix + 'cadence_start_number'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />

          {selectedStart.value.type === 'blocks_custom' ? (
            <small>{t('form.current')} {t('form.block_height')} 5,132,868</small>
          ) : ''}
        </div>
      ) : ''}

      <br />
      <br />

      <h3 className="mb-2 text-xl">{t('form.cadence_when_end')}</h3>
      <Controller
        name="boundary_start"
        control={control}
        defaultValue={boundaryEndOptions[0]}
        rules={{ required: true }}
        render={({ field: { onChange } }) => {
          return (
            <SelectList
              onChange={onChange}
              options={boundaryEndOptions}
            // disabled={!isCreating}
            // error={errors?.amount}
            // validation={[validateRequired, validatePositive]}
            />
          );
        }}
      />

      {selectedEnd.value.type === 'cron_custom' || selectedEnd.value.type === 'blocks_custom' ? (
        <div className="mt-4">
          {selectedEnd.value.type === 'blocks_custom' ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : ''}
          {selectedEnd.value.type === 'cron_custom' ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : ''}
          <NumberInput
            // disabled={!isCreating}
            // error={errors?.amount}
            // defaultValue={}
            fieldName={fieldNamePrefix + 'cadence_end_number'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />

          {selectedEnd.value.type === 'blocks_custom' ? (
            <small>{t('form.current')} {t('form.block_height')} 5,132,868</small>
          ) : ''}
        </div>
      ) : ''}
    </div>
  )
}
