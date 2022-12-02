import {
  AdjustmentsVerticalIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowUturnDownIcon,
  BoltIcon,
  CalendarDaysIcon,
  ClockIcon,
  RectangleStackIcon,
} from '@heroicons/vue/24/outline'

export const Interval = {
  Once: 0,
  Immediate: 1,
  Block: 2,
  Cron: 3,
}

export const intervalUxOptions = [
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
export const boundaryOptions: any = [
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
export const boundaryStartOptions = [
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
export const boundaryEndOptions = [
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
export const customUxOptions = [
  // {
  //   type: Interval.Once,
  //   title: 'One Time',
  // },
  // {
  //   type: Interval.Immediate,
  //   title: 'Immediately',
  // },
  {
    key: 'Block Interval',
    value: Interval.Block,
    default: '100',
  },
  {
    key: 'CronTab Spec',
    value: Interval.Cron,
    default: '0 0 * * *', // daily
  },
]