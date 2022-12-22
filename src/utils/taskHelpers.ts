import { sha256, sha224 } from 'js-sha256'
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
import type { Task } from './types'

// Get the hash of a task based on parameters
// let message = format!(
//   "{:?}{:?}{:?}{:?}{:?}{:?}",
//   self.owner_id, self.interval, self.boundary, self.actions, self.queries, self.transforms
// );
export const getTaskHash = (task: Task): string => {
  let str = ''
  // Order matters!
  const keys = ['owner_id', 'interval', 'boundary', 'actions', 'queries', 'transforms']

  keys.forEach((k: string) => {
    str += task && task[k] ? JSON.stringify(task[k]) : ''
  })

  return sha256(str)
}

export const Interval = {
  Once: 0,
  Immediate: 1,
  Block: 2,
  Cron: 3,
}

export const intervalUxOptions = [
  {
    sort: 0,
    Icon: BoltIcon,
    title: 'Once',
    type: 'once',
    data: {
      intervalType: Interval.Once,
      intervalValue: null,
    },
  },
  {
    sort: 1,
    Icon: ClockIcon,
    title: 'Every Day',
    type: 'cron_daily',
    data: {
      intervalType: Interval.Cron,
      intervalValue: '0 0 0 * * *',
    },
  },
  {
    sort: 2,
    Icon: ClockIcon,
    title: 'Every Hour',
    type: 'cron_hourly',
    data: {
      intervalType: Interval.Cron,
      intervalValue: '0 0 * * * *',
    },
  },
  {
    sort: 3,
    Icon: ClockIcon,
    title: 'Every Minute',
    type: 'cron_minutely',
    data: {
      intervalType: Interval.Cron,
      intervalValue: '0 * * * * *',
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
    type: 'has_balance_gte',
    data: {
      intervalType: Interval.Immediate,
      intervalValue: null,
    },
  },
  {
    sort: 6,
    Icon: ArrowTrendingDownIcon,
    title: 'When balance below',
    type: 'has_balance_lte',
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
    Icon: CalendarDaysIcon,
    title: 'Pick a date & time',
    type: 'Time',
  },
  {
    sort: 11,
    Icon: RectangleStackIcon,
    title: 'Pick a block',
    type: 'Height',
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
    default: '0 0 * * * *', // daily
  },
]