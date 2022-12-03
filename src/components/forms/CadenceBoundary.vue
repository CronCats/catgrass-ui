<template>
  <div aria-details="dca fields" class="my-8 mb-24">
    <h3 class="mb-2 text-xl">How often should this occur?</h3>
    <SelectList name="interval" :onChange="setIntervalOption" :options="intervalUxOptions" />

    <div v-if="intervalOption.type === 'custom'">
      <div class="mt-4">
        <SelectComboInput :onChange="setIntervalCustom" :options="customUxOptions" />

        <Subtext v-if="intervalCustom.select == Interval.Block" :text="`${'Every ' + intervalCustom.input + ' blocks'}`" />
        <small v-if="intervalCustom.select == Interval.Cron">
          Check and validate your string at
          <a
            class="text-blue-600 underline"
            href="https://crontab.guru/"
            rel="noreferrer"
            target="_blank"
          >
            CronTab Guru
          </a>
        </small>
        <Subtext v-if="errors.interval_custom" :error="true" :text="error.interval_custom" />
      </div>
    </div>

    <div v-if="intervalOption.type === 'balance_gt' || intervalOption.type === 'balance_lt'" class="mt-4">
      <Label class="mb-2" :name="`${'Balance ' + (intervalOption.type == 'balance_gt' ? 'Greater Than' : 'Less Than')}`" />
      <TokenInputSelector :onChange="setIntervalBalanceAsset" :options="availableTokens" />
      <Subtext v-if="errors.rule_balance" :error="true" :text="error.rule_balance" />
    
      <Label class="mt-4 mb-2" name="Wallet Address to Watch" />
      <AddressInput containerclass="grow" :onChange="setIntervalBalanceAddress" :disabled="false" :error="errors.rule_balance_address" />
      <Subtext v-if="errors.rule_balance_address" :error="true" :text="error.rule_balance_address" />
    </div>

    <br />
    <br />

    <h3 class="mb-2 text-xl">When should this start?</h3>
    <SelectList :onChange="setBoundaryStart" :options="boundaryStartOptions" />

    <div v-if="selectedStart.type === 'Time' || selectedStart.type === 'Height'" class="mt-4">
      <Label v-if="selectedStart.type === 'Height'" class="mb-2" name="Block Height" />
      <Label v-if="selectedStart.type === 'Time'" class="mb-2" name="Timestamp" />
      <NumberInput :onChange="setBoundaryStartValue" :error="errors.cadence_start_number" sizing="full" />

      <Subtext v-if="selectedStart.type === 'Height'" :text="recentBlockHeight" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.type === 'Height'" :error="true" :text="error.cadence_start_number_block" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.type === 'Time'" :error="true" :text="error.cadence_start_number_ts" />
    </div>

    <br />
    <br />

    <h3 class="mb-2 text-xl">When should this end?</h3>
    <SelectList :onChange="setBoundaryEnd" :options="boundaryEndOptions" />

    <div v-if="selectedEnd.type === 'Time' || selectedEnd.type === 'Height'" class="mt-4">
      <Label v-if="selectedEnd.type === 'Height'" class="mb-2" name="Block Height" />
      <Label v-if="selectedEnd.type === 'Time'" class="mb-2" name="Timestamp" />
      <NumberInput :onChange="setBoundaryEndValue" :error="errors.cadence_end_number" sizing="full" />

      <Subtext v-if="selectedEnd.type === 'Height'" :text="recentBlockHeight" />
      <Subtext v-if="errors.cadence_end_number && selectedStart.type === 'Height'" :error="true" :text="error.cadence_end_number_block" />
      <Subtext v-if="errors.cadence_end_number && selectedStart.type === 'Time'" :error="true" :text="error.cadence_end_number_ts" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { addCommas } from '@/utils/helpers'
import type { Addr, Boundary } from "@/utils/types"
import Label from '@/components/core/display/Label.vue'
import Subtext from '@/components/core/display/Subtext.vue'
import AddressInput from '@/components/core/inputs/AddressInput.vue'
import NumberInput from '@/components/core/inputs/NumberInput.vue'
import SelectList from '@/components/core/inputs/SelectList.vue'
import SelectComboInput from "../core/inputs/SelectComboInput.vue";
import TokenInputSelector from "../core/inputs/TokenInputSelector.vue";
import {
  Interval,
  intervalUxOptions,
  boundaryOptions,
  boundaryStartOptions,
  boundaryEndOptions,
  customUxOptions,
} from "@/utils/taskHelpers"

export default {
  components: {
    AddressInput,
    SelectComboInput,
    Label,
    Subtext,
    NumberInput,
    SelectList,
    TokenInputSelector,
  },

  data() {
    return {
      Interval,
      errors: {},
      blockHeight: 0,
      boundary: {} as any,
      availableTokens: [] as Asset[],
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
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['networks', 'accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
    recentBlockHeight() {
      return `Recent Block Height ${addCommas(`${this.blockHeight}`)}`
    },
  },

  methods: {
    ...mapActions(useMultiWallet, ['querier']),
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    setIntervalOption(interval: any) {
      let i: any = "Immediate"
      // "interval": "Once",
      // "interval": "Immediate",
      // "interval": { "Block": 123 },
      // "interval": { "Cron": "0 0 * * *" },
      switch (interval.data.intervalType) {
        case Interval.Once:
          i = "Once"
          break;
        case Interval.Block:
          i = { "Block": interval.data.intervalValue }
          break;
        case Interval.Cron:
          i = { "Cron": interval.data.intervalValue }
          break;
        default:
          break;
      }

      this.updateTask({ interval: i })
      this.intervalOption = interval
    },
    setIntervalCustom(custom: any) {
      let i: any = "Immediate"
      // "interval": { "Block": 123 },
      // "interval": { "Cron": "0 0 * * *" },
      switch (custom.select) {
        case Interval.Block:
          i = { "Block": parseInt(custom.input) }
          break;
        case Interval.Cron:
          i = { "Cron": custom.input }
          break;
        default:
          break;
      }

      this.updateTask({ interval: i })
      this.intervalCustom = custom
    },
    setIntervalBalanceAsset(asset: any) {
      console.log('TODO: setIntervalBalanceAsset', asset);
    },
    setIntervalBalanceAddress(address: Addr) {
      console.log('TODO: setIntervalBalanceAddress', address);
    },
    setBoundaryStart(value: any) {
      this.selectedStart = value
    },
    setBoundaryStartValue(value: any) {
      if (this.selectedStart.type === 'Height') {
        delete this.boundary.Time
        this.boundary.Height = this.boundary.Height || {}
        this.boundary.Height.start = parseInt(value)
      }
      if (this.selectedStart.type === 'Time') {
        delete this.boundary.Height
        this.boundary.Time = this.boundary.Time || {}
        this.boundary.Time.start = parseInt(value)
      }

      this.updateTask({ boundary: { ...this.boundary } })
    },
    setBoundaryEnd(value: any) {
      this.selectedEnd = value
    },
    setBoundaryEndValue(value: any) {
      if (this.selectedStart.type === 'Height') {
        delete this.boundary.Time
        this.boundary.Height = this.boundary.Height || {}
        this.boundary.Height.end = parseInt(value)
      }
      if (this.selectedStart.type === 'Time') {
        delete this.boundary.Height
        this.boundary.Time = this.boundary.Time || {}
        this.boundary.Time.end = parseInt(value)
      }

      this.updateTask({ boundary: { ...this.boundary } })
    },
    async getCurrentBlockHeight() {
      // TODO: Get current "sender" account's chain name
      const q = await this.querier(this.accounts[0].chain.chain_name)
      const r = await q.status()
      if (r?.syncInfo?.latestBlockHeight) this.blockHeight = r.syncInfo.latestBlockHeight
    },
  },

  mounted() {
    // TODO: Add back!
    // this.getCurrentBlockHeight()
    // // init defaults
    // this.fromAccount = this.accounts[0]
    // this.toAccount = this.accounts[0]
    // if (!this.fromAccount || this.accounts.length <= 0) return []
    // let acc = this.fromAccount || this.accounts[0]
    // if (!acc) return
    // this.availableTokens = getChainAssetList(acc.chain)
    // if (this.availableTokens) this.fromToken = this.availableTokens[0]
  },
};
</script>
