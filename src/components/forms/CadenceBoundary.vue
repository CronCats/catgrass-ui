<template>
  <div aria-details="dca fields" class="my-8 mb-24">
    <h3 class="mb-2 text-xl">form.cadence_how_often</h3>
    <SelectList name="interval" :onChange="onChange" :options="intervalUxOptions" />

    <div v-if="intervalOption.key === 'custom'">
      <div class="mt-4">
        <Label v-if="intervalCustom.select == Interval.Block" class="mb-2" name="form.block_interval" />
        <Label v-if="intervalCustom.select == Interval.Cron" class="mb-2" name="form.cron_spec" />
        <ComboInputSelect :onChange="onChange" :options="customUxOptions" />

        <Subtext v-if="intervalCustom.select == Interval.Block" :text="`${'form.every' + ' ' + intervalCustom.input + ' ' + 'form.blocks'}`" />
        <small v-if="intervalCustom.select == Interval.Cron">
          'info.crontab_validator'
          <a
            class="text-blue-600 underline"
            href="https://crontab.guru/"
            rel="noreferrer"
            target="_blank"
          >
            info.crontab_guru
          </a>
        </small>
        <Subtext v-if="errors.interval_custom" :error="true" :text="error.interval_custom" />
      </div>
    </div>

    <div v-if="intervalOption.value.type === 'balance_gt' || intervalOption.value.type === 'balance_lt'" class="mt-4">
      <Label class="mb-2" :name="`${'form.balance' + ' ' + intervalOption.value.type == 'balance_gt' ? 'form.gt' : 'form.lt'}`" />
      <ComboInputSelect :error="errors.rule_balance" :onChange="onChange" :options="balanceLogicOptions" />
      <Subtext v-if="errors.rule_balance" :error="true" :text="error.rule_balance" />
    
      <Label class="mt-4 mb-2" name="form.wallet_address_watch" />
      <AddressInput containerclass="grow" :disabled="false" :error="errors.rule_balance_address" />
      <Subtext v-if="errors.rule_balance_address" :error="true" :text="error.rule_balance_address" />
    </div>

    <br />
    <br />

    <h3 class="mb-2 text-xl">form.cadence_when_start</h3>
    <SelectList :onChange="onChange" :options="boundaryStartOptions" />

    <div v-if="selectedStart.key === 'cron_custom' || selectedStart.key === 'blocks_custom'" class="mt-4">
      <Label v-if="selectedStart.key === 'blocks_custom'" class="mb-2" name="form.block_height" />
      <Label v-if="selectedStart.key === 'cron_custom'" class="mb-2" name="form.timestamp" />
      <NumberInput :error="errors.cadence_start_number" sizing="full" />

      <!-- // TODO: -->
      <Subtext v-if="selectedStart.key === 'blocks_custom'" :text="`${'form.current' + ' ' + 'form.block_height' + ' 5,132,868'}`" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.key === 'blocks_custom'" :error="true" :text="error.cadence_start_number_block" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.key === 'cron_custom'" :error="true" :text="error.cadence_start_number_ts" />
    </div>

    <br />
    <br />

    <h3 class="mb-2 text-xl">form.cadence_when_end</h3>
    <SelectList :onChange="onChange" :options="boundaryEndOptions" />

    <div v-if="selectedEnd.key === 'cron_custom' || selectedEnd.key === 'blocks_custom'" class="mt-4">
      <Label v-if="selectedEnd.key === 'blocks_custom'" class="mb-2" name="form.block_height" />
      <Label v-if="selectedEnd.key === 'cron_custom'" class="mb-2" name="form.timestamp" />
      <NumberInput :error="errors.cadence_end_number" sizing="full" />
    
      <!-- // TODO: -->
      <Subtext v-if="selectedEnd.key === 'blocks_custom'" :text="`${'form.current' + ' ' + 'form.block_height' + ' 5,132,868'}`" />
      <Subtext v-if="errors.cadence_end_number && selectedStart.key === 'blocks_custom'" :error="true" :text="error.cadence_end_number_block" />
      <Subtext v-if="errors.cadence_end_number && selectedStart.key === 'cron_custom'" :error="true" :text="error.cadence_end_number_ts" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import Label from '@/components/core/display/Label.vue'
import Subtext from '@/components/core/display/Subtext.vue'
import AddressInput from '@/components/core/inputs/AddressInput.vue'
import NumberInput from '@/components/core/inputs/NumberInput.vue'
import SelectList from '@/components/core/inputs/SelectList.vue'
// import ComboInputSelect from '@/components/core/inputs/ComboInputSelect.vue'
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

// TODO: MOVE!!!!!!!!!!!!!
const Interval = {
  Once: 0,
  Immediate: 1,
  Block: 1,
  Cron: 1,
}

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
    key: 'form.block_interval',
    value: Interval.Block,
    default: '100',
  },
  {
    key: 'form.cron_spec',
    value: Interval.Cron,
    default: '0 0 * * *', // daily
  },
]

// TODO: Add for custom
const balanceLogicOptions = [
  // {
  //   key: tokens[0].symbol,
  //   value: tokens[0].name,
  //   default: '1',
  // },
  // {
  //   key: tokens[1].symbol,
  //   value: tokens[1].name,
  //   default: '1',
  // },
]

export default {
  components: {
    AddressInput,
    // ComboInputSelect,
    Label,
    Subtext,
    NumberInput,
    SelectList,
  },

  data() {
    return {
      Interval,
      errors: {},
      selectedStart: boundaryStartOptions[0],
      selectedEnd: boundaryEndOptions[0],
      intervalOption: intervalUxOptions[0],
      intervalCustom: {
        input: customUxOptions[0].default,
        select: customUxOptions[0].value,
      },
      intervalUxOptions,
      boundaryOptions,
      boundaryStartOptions,
      boundaryEndOptions,
      customUxOptions,
      balanceLogicOptions,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['networks']),
  },

  methods: {
    onChange(v) {
      console.log('onChange', v);
    },
    setIntervalOption() {
      // 
    },
    // TODO: setIntervalCustom, setSelectedStart, setSelectedEnd
  },
};
</script>
