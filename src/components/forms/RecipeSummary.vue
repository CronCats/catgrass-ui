<template>
  <div  class="my-8">
    <h3 class="mb-8 text-xl">Confirm Details</h3>

    <RecipeCard bgColor="#F9226C" :data="recipeData" />

    <br />
    <br />

    <!-- TODO: Queries -->
    <!-- TODO: Transforms -->
    <!-- TODO: Actions -->

    <!-- <Label class="mb-2" name={t('form.actions')} />

    {actions.map((action: Action, id) => (
      <div key={id} class="p-2 text-gray-100 bg-gray-800 rounded-lg shadow-lg">
        <ActionItem action={action} />
      </div>
    ))}

    <br /> -->

    <Label class="mb-2" name="Schedule" />

    <div class="py-2 px-4 bg-white rounded-lg">
      <div v-for="(k, i) in Object.keys(schedule)" :key="i" class="flex justify-between my-1 uppercase">
        <span>{{k}}</span>
        <span>{{schedule[k]}}</span>
      </div>
    </div>

    <br />

    <Label class="mb-2" name="Summary" />

    <div class="py-2 px-4 bg-white rounded-lg">
      <div v-for="(k, i) in Object.keys(summary)" :key="i" class="flex justify-between my-1 uppercase">
        <span>{{ formatTitle(k) }}</span>
        <span>{{summary[k]}}</span>
      </div>
    </div>

    <br />
  </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import {
  formatInterval,
  formatBoundary,
  getOccurancesTotal,
  getFeeEstimateTotal,
} from "@/utils/helpers"
import {
  ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/outline'
import Label from '../core/display/Label.vue'
import RecipeCard from '../RecipeCard.vue'

// TODO: Change this!
const recipeData = {
  title: 'Dollar Cost Average from $JUNO to $NETA',
  // subtitle: '',
  owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
  totalBalance: { amount: '10000000', denom: 'ujuno' },
  actions: [],
  rules: [],
  networks: [],
}

export default {
  components: {
    ArrowPathRoundedSquareIcon,
    Label,
    RecipeCard,
  },

  data() {
    return {
      recipeData,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['networks', 'accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
    schedule() {
      const schedule: any = {}

      if (this.interval) schedule.interval = this.interval
      if (this.start) schedule.start = this.start
      if (this.end) schedule.end = this.end

      return schedule
    },
    summary() {
      const summary: any = {}

      if (this.fundsTotal) summary.funds_total = this.fundsTotal
      if (this.feesTotal) summary.fees_total = this.feesTotal
      if (this.occurances) summary.occurances = this.occurances

      return summary
    },
    interval() {
      if (!this.task?.interval) return;
      return formatInterval(this.task.interval)
    },
    start() {
      return formatBoundary(this.task.boundary, 'start')
    },
    end() {
      return formatBoundary(this.task.boundary, 'end')
    },
    feesTotal() {
      // TODO: get from simulate estimate
      // getFeeEstimateTotal()
      return '0.123456 JUNO' // gasWanted 380622, gasUsed 389326
    },
    fundsTotal() {
      // TODO:
      return '1.234 JUNO'
    },
    occurances() {
      if (!this.task || !this.task.interval) return '0'
      return `~${getOccurancesTotal(this.task) }`
    },
  },

  methods: {
    formatTitle(str: string) {
      return str.replace(/_/g, ' ')
    },
  },
};
</script>
