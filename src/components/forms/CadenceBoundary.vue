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

    <div v-if="intervalOption.type === 'has_balance_gte' || intervalOption.type === 'has_balance_lte'" class="mt-4">
      <Label class="mb-2" :name="`${'Balance ' + (intervalOption.type == 'has_balance_gte' ? 'Greater Than' : 'Less Than')}`" />
      <TokenInputSelector :onChange="setIntervalBalanceAsset" :options="availableTokens" />
      <Subtext v-if="errors.rule_balance" :error="true" :text="error.rule_balance" />
    
      <Label class="mt-4 mb-2" name="Wallet Address to Watch" />
      <AddressInput :default="watchAddress" containerclass="grow" :onChange="setIntervalBalanceAddress" :disabled="false" :error="errors.rule_balance_address" />
      <Subtext v-if="errors.rule_balance_address" :error="true" :text="error.rule_balance_address" />
    </div>

    <br />
    <br />

    <h3 class="mb-2 text-xl">When should this start?</h3>
    <SelectList :onChange="setBoundaryStart" :options="boundaryStartOptions" />

    <div v-if="selectedStart.type === 'Time' || selectedStart.type === 'Height'" class="mt-4">
      <Label v-if="selectedStart.type === 'Height'" class="mb-2" name="Block Height" />
      <!-- <Label v-if="selectedStart.type === 'Time'" class="mb-2" name="Timestamp" /> -->
      <template v-if="selectedStart.type === 'Time'">
        <DatePicker v-model="timestampStart" mode="dateTime" circle is24hr is-expanded>
          <template v-slot="{ inputValue, togglePopover }">
            <div @click="togglePopover()" class="flex gap-1 items-center py-[17px] px-3 font-mono text-sm bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-offset-0 transition border-default">
              <CalendarDaysIcon class="mr-2 w-6 h-6" color="currentColor" />
              <input :value="inputValue" placeholder="Choose Start" class="w-full bg-transparent border-none outline-none ring-none body-text" readonly />
            </div>
          </template>
        </DatePicker>
      </template>
      <template v-if="selectedStart.type === 'Height'">
        <NumberInput :onChange="setBoundaryStartValue" :error="errors.cadence_start_number" sizing="full" />
      </template>

      <Subtext v-if="selectedStart.type === 'Height'" :text="recentBlockHeight" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.type === 'Height'" :error="true" :text="error.cadence_start_number_block" />
      <Subtext v-if="errors.cadence_start_number && selectedStart.type === 'Time'" :error="true" :text="error.cadence_start_number_ts" />
    </div>

    <br />
    <br />

    <div v-if="intervalOption.type != 'once'">
      <h3 class="mb-2 text-xl">When should this end?</h3>
      <SelectList :onChange="setBoundaryEnd" :options="boundaryEndOptions" />

      <div v-if="selectedEnd.type === 'Time' || selectedEnd.type === 'Height'" class="mt-4">
        <Label v-if="selectedEnd.type === 'Height'" class="mb-2" name="Block Height" />
        <!-- <Label v-if="selectedEnd.type === 'Time'" class="mb-2" name="Timestamp" /> -->
        <template v-if="selectedEnd.type === 'Time'">
          <DatePicker v-model="timestampEnd" mode="dateTime" circle is24hr>
            <template v-slot="{ inputValue, togglePopover }">
              <div @click="togglePopover()"
                class="flex gap-1 items-center py-[17px] px-3 font-mono text-sm bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-offset-0 transition border-default">
                <CalendarDaysIcon class="mr-2 w-6 h-6" color="currentColor" />
                <input :value="inputValue" placeholder="Choose End" class="w-full bg-transparent border-none outline-none ring-none body-text"
                  readonly />
              </div>
            </template>
          </DatePicker>
        </template>
        <template v-if="selectedEnd.type === 'Height'">
          <NumberInput :onChange="setBoundaryEndValue" :error="errors.cadence_end_number" sizing="full" />
        </template>

        <Subtext v-if="selectedEnd.type === 'Height'" :text="recentBlockHeight" />
        <Subtext v-if="errors.cadence_end_number && selectedStart.type === 'Height'" :error="true" :text="error.cadence_end_number_block" />
        <Subtext v-if="errors.cadence_end_number && selectedStart.type === 'Time'" :error="true" :text="error.cadence_end_number_ts" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import {
  addCommas,
  getChainAssetList,
  getAssetByDenomOnChain,
  getDeployedContractsByChain,
  isCw20Asset,
  isNativeAsset,
} from '@/utils/helpers'
import type { Addr, Account, Asset, Boundary, GenericBalance } from "@/utils/types"
import { queriesCatalog } from "@/utils/mvpData"
import Label from '@/components/core/display/Label.vue'
import Subtext from '@/components/core/display/Subtext.vue'
import AddressInput from '@/components/core/inputs/AddressInput.vue'
import NumberInput from '@/components/core/inputs/NumberInput.vue'
import SelectList from '@/components/core/inputs/SelectList.vue'
import SelectComboInput from "../core/inputs/SelectComboInput.vue";
import TokenInputSelector from "../core/inputs/TokenInputSelector.vue";
import 'v-calendar/dist/style.css';
// https://github.com/nathanreyes/v-calendar
import { DatePicker } from 'v-calendar';
import {
  Interval,
  intervalUxOptions,
  boundaryOptions,
  boundaryStartOptions,
  boundaryEndOptions,
  customUxOptions,
} from "@/utils/taskHelpers"
import {
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'

export default {
  components: {
    AddressInput,
    CalendarDaysIcon,
    SelectComboInput,
    Label,
    Subtext,
    NumberInput,
    SelectList,
    TokenInputSelector,
    DatePicker,
  },

  data() {
    return {
      Interval,
      errors: {},
      blockHeight: 0,
      boundary: null as any | null,
      timestampStart: null,
      timestampEnd: null,
      signer: undefined as Account | undefined,
      availableTokens: [] as Asset[],
      watchToken: undefined as Asset | undefined,
      watchAddress: undefined as Addr | undefined,
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

  // TODO: Validations!
  methods: {
    ...mapActions(useMultiWallet, ['querier', 'getNetworkForAccount']),
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
        case Interval.Immediate:
          i = "Immediate"
          break;
        case Interval.Block:
        case null:
          i = { "Block": interval.data.intervalValue || 100 }
          break;
        case Interval.Cron:
          i = { "Cron": interval.data.intervalValue }
          break;
        default:
          break;
      }

      if (i === 'Immediate' && (interval.type === 'has_balance_gte' || interval.type === 'has_balance_lte')) {
        // Set the watch address straight away with my signer as default:
        if (this.context?.signer_addr) this.setIntervalBalanceAddress(this.context.signer_addr)
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
      this.watchToken = asset
      this.setQuery_HasBalance()
    },
    setIntervalBalanceAddress(address: Addr) {
      this.watchAddress = address
      this.setQuery_HasBalance()
    },
    setQuery_HasBalance() {
      if (!this.watchAddress || !this.watchToken) return;
      const type = this.intervalOption.type
      const rawAsset = this.watchToken
      const chain = this.getNetworkForAccount({ address: this.watchAddress })
      const asset = getAssetByDenomOnChain(rawAsset.denom, chain)
      if (!asset) return;

      // balance logic if native/cw20 token
      // NOTE: How to check IBC balance?
      let required_balance = {}
      if (isNativeAsset(asset)) {
        required_balance = {
          native: [this.watchToken]
        }
      }
      if (isCw20Asset(asset)) {
        required_balance = {
          cw20: {
            address: asset.address || '',
            amount: this.watchToken.amount,
          }
        }
      }

      // Get the deployed rules contract for balances
      const deployed = getDeployedContractsByChain(chain)
      const contract_addr = deployed?.rules
      if (!contract_addr) return;

      const queryMsg = queriesCatalog.hasBalanceLogicType({
        contract_addr,
        address: this.watchAddress,
        required_balance: required_balance as GenericBalance,
        type,
      })

      // update the task with this query rule
      this.updateTask({ queries: [queryMsg] })
    },
    setBoundaryStart(value: any) {
      this.selectedStart = value

      // Reset any set fields if immediate
      if (value.type === 'immediate') {
        if (this.boundary.Height?.start) delete this.boundary.Height.start
        if (this.boundary.Time?.start) delete this.boundary.Time.start
      }

      // clean up if missing state
      if (this.boundary?.Height) {
        if (Object.keys(this.boundary.Height).length == 0) this.boundary = null
      }
      if (this.boundary?.Time) {
        if (Object.keys(this.boundary.Time).length == 0) this.boundary = null
      }

      if (this.boundary) this.updateTask({ boundary: { ...this.boundary } })
      else this.updateTask({ boundary: null })
    },
    setBoundaryEnd(value: any) {
      this.selectedEnd = value

      // Reset any set fields if immediate
      if (value.type === 'event_funds_lt') {
        if (this.boundary.Height?.end) delete this.boundary.Height.end
        if (this.boundary.Time?.end) delete this.boundary.Time.end
      }

      // clean up if missing state
      if (this.boundary?.Height) {
        if (Object.keys(this.boundary.Height).length == 0) this.boundary = null
      }
      if (this.boundary?.Time) {
        if (Object.keys(this.boundary.Time).length == 0) this.boundary = null
      }
      
      if (this.boundary) this.updateTask({ boundary: { ...this.boundary } })
      else this.updateTask({ boundary: null })
    },
    setBoundaryStartValue(v: any) {
      const value = v || this.timestampStart
      
      if (this.selectedStart.type === 'Height') {
        if (!this.boundary) this.boundary = {}
        if (this.boundary?.Time) delete this.boundary.Time
        this.boundary.Height = this.boundary.Height || {}
        this.boundary.Height.start = `${value}`
      }
      if (this.selectedStart.type === 'Time') {
        if (!this.boundary) this.boundary = {}
        if (this.boundary?.Height) delete this.boundary.Height
        this.boundary.Time = this.boundary.Time || {}
        this.boundary.Time.start = `${new Date(value).getTime() * 1000}`
      }

      this.updateTask({ boundary: { ...this.boundary } })
    },
    setBoundaryEndValue(v: any) {
      const value = v || this.timestampEnd

      if (this.selectedEnd.type === 'Height') {
        if (!this.boundary) this.boundary = {}
        if (this.boundary?.Time) delete this.boundary.Time
        this.boundary.Height = this.boundary.Height || {}
        this.boundary.Height.end = `${value}`
      }
      if (this.selectedEnd.type === 'Time') {
        if (!this.boundary) this.boundary = {}
        if (this.boundary?.Height) delete this.boundary.Height
        this.boundary.Time = this.boundary.Time || {}
        this.boundary.Time.end = `${new Date(value).getTime() * 1000}`
      }

      this.updateTask({ boundary: { ...this.boundary } })
    },
    async getCurrentBlockHeight() {
      const q = await this.querier(this.signer.chain.chain_name)
      const r = await q.status()
      if (r?.syncInfo?.latestBlockHeight) this.blockHeight = r.syncInfo.latestBlockHeight
      this.updateTaskContext({ blockHeight: this.blockHeight })
    },
  },

  mounted() {
    this.signer = this.accounts[0]
    // Get current "sender" account's chain name
    if (this.context?.signer_addr) {
      const signer = this.accounts.find((a: Account) => a.address === this.context.signer_addr)
      if (signer) this.signer = signer
    }
    if (!this.signer) return;

    // init defaults
    this.getCurrentBlockHeight()
    this.availableTokens = getChainAssetList(this.signer.chain)
    this.watchAddress = this.signer.address
    if (this.availableTokens) this.watchToken = this.availableTokens[0]
  },

  watch: {
    'timestampStart': ['setBoundaryStartValue'],
    'timestampEnd': ['setBoundaryEndValue'],
  },
};
</script>
