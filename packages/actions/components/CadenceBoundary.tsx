import { useState, useMemo } from 'react'
import clsx from 'clsx'
import {
  useFormContext,
} from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { assets, chains } from 'chain-registry'
import { Chain, Asset } from '@chain-registry/types'
import {
  AdjustmentsVerticalIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowUturnDownIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  CalendarDaysIcon,
  ClockIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline'
import {
  SelectList,
  SelectListItem,
} from '@croncat-ui/ui'
import {
  NATIVE_DECIMALS,
  chainColors,
  validateAddress,
  validatePositive,
  validateRequired,
} from '@croncat-ui/utils'
import {
  Interval,
  BoundaryType,
} from '@croncat-ui/actions'
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

  const assetList = assets.find(({chain_name})=>chain_name==='juno')
  const tokens = assetList?.assets || []

  const fieldNamePrefix = 'form.'
  const spendTotalAmount = watch(fieldNamePrefix + 'amount_total')
  const spendTotalDenom = watch(fieldNamePrefix + 'amount_total_denom')
  const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
  const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
  const [selectedToken, setSelectedToken] = useState(tokens[0])

  const intervalUxCallback = (item: SelectListItem) => {
    console.log('intervalUxCallback', item)
    // setSelectedToken(item)
  }

  const boundaryStartCallback = (start: SelectListItem) => {
    console.log('boundaryStartCallback', start)
    // setSelectedToken(item)
  }

  const boundaryEndCallback = (end: SelectListItem) => {
    console.log('boundaryStartCallback', end)
    // setSelectedToken(item)
  }

  const intervalUxOptions = [
    {
      sort: 10,
      Icon: CalendarDaysIcon,
      title: 'Every Day',
      type: 'cron_daily',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '',
      }
    },
    {
      sort: 10,
      Icon: ClockIcon,
      title: 'Every Hour',
      type: 'cron_hourly',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '',
      }
    },
    {
      sort: 10,
      Icon: ClockIcon,
      title: 'Every Minute',
      type: 'cron_minutely',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '',
      }
    },
    {
      sort: 10,
      Icon: RectangleStackIcon,
      title: 'Every 1000 Blocks',
      type: 'blocks_1000',
      data: {
        intervalType: Interval.Block,
        intervalValue: 1000,
      }
    },
    {
      sort: 10,
      Icon: ArrowTrendingUpIcon,
      title: 'When balance above',
      type: 'balance_gt',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: null,
      }
    },
    {
      sort: 10,
      Icon: ArrowTrendingDownIcon,
      title: 'When balance below',
      type: 'balance_lt',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: null,
      }
    },
    {
      sort: 10,
      Icon: AdjustmentsVerticalIcon,
      title: 'Custom',
      type: 'custom',
      data: {
        intervalType: null,
        intervalValue: null,
      }
    },
  ]

  // immediately, pick a time, pick a block, Funds run out
  const boundaryOptions = [
    {
      sort: 10,
      Icon: ClockIcon,
      title: 'Pick a time',
      type: 'cron_custom',
      data: {
        intervalType: Interval.Cron,
        intervalValue: '',
      }
    },
    {
      sort: 10,
      Icon: RectangleStackIcon,
      title: 'Pick a block',
      type: 'blocks_custom',
      data: {
        intervalType: Interval.Block,
        intervalValue: 0, // TODO: Get current block + 1000
      }
    },
  ]
  const boundaryStartOptions = [
    {
      sort: 10,
      Icon: BoltIcon,
      title: 'Immediately',
      type: 'immediate',
      data: {
        intervalType: Interval.Immediate,
        intervalValue: '',
      }
    },
  ].concat(boundaryOptions)
  const boundaryEndOptions = [
    {
      sort: 10,
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
  // const intervalOptions = [
  //   {
  //     sort: 10,
  //     type: Interval.Once,
  //     title: 'One Time',
  //   },
  //   {
  //     sort: 10,
  //     type: Interval.Immediate,
  //     title: 'Immediately',
  //   },
  //   {
  //     sort: 10,
  //     type: Interval.Block,
  //     title: 'Block Height',
  //   },
  //   {
  //     sort: 10,
  //     type: Interval.Cron,
  //     title: 'CronTab Spec',
  //   },
  // ]

  const [selected, setSelected] = useState(intervalUxOptions[0])

  return (
    <div aria-details='dca fields' className="my-8 mb-24">
      <h3 className="text-xl mb-2">{t('form.cadence_how_often')}</h3>
      <SelectList items={intervalUxOptions} onSelectedItem={intervalUxCallback} />

      <br />
      <br />
      
      <h3 className="text-xl mb-2">{t('form.cadence_when_start')}</h3>
      <SelectList items={boundaryStartOptions} onSelectedItem={boundaryStartCallback} />

      <br />
      <br />
      
      <h3 className="text-xl mb-2">{t('form.cadence_when_end')}</h3>
      <SelectList items={boundaryEndOptions} onSelectedItem={boundaryEndCallback} />
    </div>
  )
}