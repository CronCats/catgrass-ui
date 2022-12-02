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

    <div v-if="selectedStart.type === 'cron_custom' || selectedStart.type === 'blocks_custom'" class="mt-4">
      <Label v-if="selectedStart.type === 'blocks_custom'" class="mb-2" name="Block Height" />
      <Label v-if="selectedStart.type === 'cron_custom'" class="mb-2" name="Timestamp" />
      <NumberInput :onChange="setBoundaryStartValue" :error="errors.cadence_start_number" sizing="full" />

      <!-- // TODO: -->
      <Subtext v-if="selectedStart.type === 'blocks_custom'" :text="`${'Current Block Height 5,132,868'}`" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.type === 'blocks_custom'" :error="true" :text="error.cadence_start_number_block" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.type === 'cron_custom'" :error="true" :text="error.cadence_start_number_ts" />
    </div>

    <br />
    <br />

    <h3 class="mb-2 text-xl">When should this end?</h3>
    <SelectList :onChange="setBoundaryEnd" :options="boundaryEndOptions" />

    <div v-if="selectedEnd.type === 'cron_custom' || selectedEnd.type === 'blocks_custom'" class="mt-4">
      <Label v-if="selectedEnd.type === 'blocks_custom'" class="mb-2" name="Block Height" />
      <Label v-if="selectedEnd.type === 'cron_custom'" class="mb-2" name="Timestamp" />
      <NumberInput :onChange="setBoundaryEndValue" :error="errors.cadence_end_number" sizing="full" />
    
      <!-- // TODO: -->
      <Subtext v-if="selectedEnd.type === 'blocks_custom'" :text="`${'Current Block Height 5,132,868'}`" />
      <Subtext v-if="errors.cadence_end_number && selectedStart.type === 'blocks_custom'" :error="true" :text="error.cadence_end_number_block" />
      <Subtext v-if="errors.cadence_end_number && selectedStart.type === 'cron_custom'" :error="true" :text="error.cadence_end_number_ts" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { getChainAssetList } from '@/utils/helpers'
import type { Addr } from "@/utils/types"
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
  },

  methods: {
    setIntervalOption(interval: any) {
      this.intervalOption = interval
    },
    setIntervalCustom(custom: any) {
      console.log('intervalCustom', custom);
      this.intervalCustom = custom
    },
    setIntervalBalanceAsset(asset: any) {
      console.log('setIntervalBalanceAsset', asset);
    },
    setIntervalBalanceAddress(address: Addr) {
      console.log('setIntervalBalanceAddress', address);
    },
    setBoundaryStart(value: any) {
      console.log('setBoundaryStart', value);
      this.selectedStart = value
    },
    setBoundaryStartValue(value: any) {
      console.log('setBoundaryStartValue', value);
    },
    setBoundaryEnd(value: any) {
      console.log('setBoundaryEnd', value);
      this.selectedEnd = value
    },
    setBoundaryEndValue(value: any) {
      console.log('setBoundaryEndValue', value);
    },
  },

  mounted() {
    // init defaults
    this.fromAccount = this.accounts[0]
    this.toAccount = this.accounts[0]
    if (!this.fromAccount || this.accounts.length <= 0) return []
    let acc = this.fromAccount || this.accounts[0]
    if (!acc) return
    this.availableTokens = getChainAssetList(acc.chain)
    if (this.availableTokens) this.fromToken = this.availableTokens[0]
  },
};
</script>
