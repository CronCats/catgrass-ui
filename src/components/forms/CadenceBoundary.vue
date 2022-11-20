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
import { assets } from 'chain-registry'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Interval } from '@croncat-ui/actions'
import {
  AddressInput,
  ComboInputSelect,
  InputLabel,
  InputSubtext,
  NumberInput,
  SelectList,
} from '@croncat-ui/ui'
import {
  validateAddress,
  validatePositive,
  validateRequired,
} from '@croncat-ui/utils'

export const CadenceBoundaryComponent = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext()
  const { t } = useTranslation()
  const fieldNamePrefix = ''

  const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
  const tokens = assetList?.assets || []

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
  const boundaryOptions: any = [
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
      key: tokens[0].symbol,
      value: tokens[0].name,
      default: '1',
    },
    {
      key: tokens[1].symbol,
      value: tokens[1].name,
      default: '1',
    },
  ]

  const [intervalOption, setIntervalOption] = useState(intervalUxOptions[0])
  const [intervalCustom, setIntervalCustom] = useState({
    input: customUxOptions[0].default,
    select: customUxOptions[0].value,
  })
  const [selectedStart, setSelectedStart] = useState(boundaryStartOptions[0])
  const [selectedEnd, setSelectedEnd] = useState(boundaryEndOptions[0])

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'interval' && type === 'change')
        setIntervalOption(value[name])
      if (name === 'interval_custom' && type === 'change')
        setIntervalCustom(value[name])
      if (name === 'boundary_start' && type === 'change')
        setSelectedStart(value[name])
      if (name === 'boundary_end' && type === 'change')
        setSelectedEnd(value[name])
    })
    return () => subscription.unsubscribe()
  }, [watch])

  // TODO:
  // - Get current block height for selected networks

  return (
    <div aria-details="dca fields" className="my-8 mb-24">
      <h3 className="mb-2 text-xl">{t('form.cadence_how_often')}</h3>
      <Controller
        control={control}
        defaultValue={intervalUxOptions[0]}
        name="interval"
        render={({ field: { onChange } }) => {
          return (
            <SelectList
              name="interval"
              onChange={onChange}
              options={intervalUxOptions}
              // error={errors?.interval}
              // validation={[validateRequired, validatePositive]}
            />
          )
        }}
        rules={{ required: true }}
      />

      {intervalOption.key === 'custom' ? (
        <div className="mt-4">
          {intervalCustom.select === Interval.Block ? (
            <InputLabel className="mb-2" name={t('form.block_interval')} />
          ) : (
            ''
          )}
          {intervalCustom.select === Interval.Cron ? (
            <InputLabel className="mb-2" name={t('form.cron_spec')} />
          ) : (
            ''
          )}
          <Controller
            control={control}
            name="interval_custom"
            render={({ field: { onChange } }) => {
              return (
                <ComboInputSelect
                  error={errors?.interval_custom}
                  onChange={onChange}
                  options={customUxOptions}
                  validation={[validateRequired, validatePositive]}
                />
              )
            }}
            rules={{ required: true }}
          />

          {intervalCustom.select === Interval.Block ? (
            <InputSubtext
              text={
                t('form.every') +
                ' ' +
                intervalCustom.input +
                ' ' +
                t('form.blocks')
              }
            />
          ) : (
            ''
          )}
          {intervalCustom.select === Interval.Cron ? (
            <small>
              {t('info.crontab_validator')}{' '}
              <a
                className="text-blue-600 underline"
                href="https://crontab.guru/"
                rel="noreferrer"
                target="_blank"
              >
                {t('info.crontab_guru')}
              </a>
            </small>
          ) : (
            ''
          )}
          {errors.interval_custom ? (
            <InputSubtext error={true} text={t('error.interval_custom')} />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      {intervalOption.value.type === 'balance_gt' ||
      intervalOption.value.type === 'balance_lt' ? (
        <div className="mt-4">
          <InputLabel
            className="mb-2"
            name={
              t('form.balance') +
              ' ' +
              (intervalOption.value.type === 'balance_gt'
                ? t('form.gt')
                : t('form.lt'))
            }
          />
          <Controller
            control={control}
            name="rule_balance"
            render={({ field: { onChange } }) => {
              return (
                <ComboInputSelect
                  error={errors?.rule_balance}
                  onChange={onChange}
                  options={balanceLogicOptions}
                  validation={[validateRequired, validatePositive]}
                />
              )
            }}
            rules={{ required: true }}
          />

          {errors.rule_balance ? (
            <InputSubtext error={true} text={t('error.rule_balance')} />
          ) : (
            ''
          )}

          <InputLabel
            className="mt-4 mb-2"
            name={t('form.wallet_address_watch')}
          />
          <AddressInput
            containerClassName="grow"
            disabled={false}
            error={errors?.rule_balance_address}
            fieldName={fieldNamePrefix + 'rule_balance_address'}
            register={register}
            validation={[validateRequired, validateAddress]}
          />

          {errors.rule_balance_address ? (
            <InputSubtext error={true} text={t('error.rule_balance_address')} />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      <br />
      <br />

      <h3 className="mb-2 text-xl">{t('form.cadence_when_start')}</h3>
      <Controller
        control={control}
        defaultValue={boundaryStartOptions[0]}
        name="boundary_start"
        render={({ field: { onChange } }) => {
          return (
            <SelectList
              onChange={onChange}
              options={boundaryStartOptions}
              // error={errors?.boundary_start}
              // validation={[validateRequired, validatePositive]}
            />
          )
        }}
        rules={{ required: true }}
      />

      {selectedStart.key === 'cron_custom' ||
      selectedStart.key === 'blocks_custom' ? (
        <div className="mt-4">
          {selectedStart.key === 'blocks_custom' ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : (
            ''
          )}
          {selectedStart.key === 'cron_custom' ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : (
            ''
          )}
          <NumberInput
            // TODO:
            // defaultValue={+new Date()}
            error={errors?.cadence_start_number}
            fieldName={'cadence_start_number'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />

          {selectedStart.key === 'blocks_custom' ? (
            // TODO:
            <InputSubtext
              text={
                t('form.current') + ' ' + t('form.block_height') + ' 5,132,868'
              }
            />
          ) : (
            ''
          )}

          {errors.cadence_start_number &&
          selectedStart.key === 'blocks_custom' ? (
            <InputSubtext
              error={true}
              text={t('error.cadence_start_number_block')}
            />
          ) : (
            ''
          )}
          {errors.cadence_start_number &&
          selectedStart.key === 'cron_custom' ? (
            <InputSubtext
              error={true}
              text={t('error.cadence_start_number_ts')}
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}

      <br />
      <br />

      <h3 className="mb-2 text-xl">{t('form.cadence_when_end')}</h3>
      <Controller
        control={control}
        defaultValue={boundaryEndOptions[0]}
        name="boundary_end"
        render={({ field: { onChange } }) => {
          return (
            <SelectList
              onChange={onChange}
              options={boundaryEndOptions}
              // error={errors?.boundary_end}
              // validation={[validateRequired, validatePositive]}
            />
          )
        }}
        rules={{ required: true }}
      />

      {selectedEnd.key === 'cron_custom' ||
      selectedEnd.key === 'blocks_custom' ? (
        <div className="mt-4">
          {selectedEnd.key === 'blocks_custom' ? (
            <InputLabel className="mb-2" name={t('form.block_height')} />
          ) : (
            ''
          )}
          {selectedEnd.key === 'cron_custom' ? (
            <InputLabel className="mb-2" name={t('form.timestamp')} />
          ) : (
            ''
          )}
          <NumberInput
            // TODO:
            // defaultValue={}
            error={errors?.cadence_end_number}
            fieldName={fieldNamePrefix + 'cadence_end_number'}
            register={register}
            sizing="full"
            validation={[validateRequired, validatePositive]}
          />

          {selectedEnd.key === 'blocks_custom' ? (
            // TODO:
            <InputSubtext
              text={
                t('form.current') + ' ' + t('form.block_height') + ' 5,132,868'
              }
            />
          ) : (
            ''
          )}

          {errors.cadence_end_number &&
          selectedStart.key === 'blocks_custom' ? (
            <InputSubtext
              error={true}
              text={t('error.cadence_end_number_block')}
            />
          ) : (
            ''
          )}
          {errors.cadence_end_number && selectedStart.key === 'cron_custom' ? (
            <InputSubtext
              error={true}
              text={t('error.cadence_end_number_ts')}
            />
          ) : (
            ''
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
