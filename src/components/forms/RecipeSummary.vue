<template>
  <div  class="my-8">
    <h3 class="mb-8 text-xl">Confirm Details</h3>

    <RecipeCard bgColor="#F9226C" :data="recipeData" />

    <br />
    <br />

    <!-- <Label class="mb-2" name={t('form.actions')} />

    {actions.map((action: Action, id) => (
      <div key={id} class="p-2 text-gray-100 bg-gray-800 rounded-lg shadow-lg">
        <ActionItem action={action} />
      </div>
    ))}

    <br /> -->

    <div v-if="rules.length > 0">
      <Label class="mb-2" name="Rules" />

      <br />
    </div>

    <InputLabel class="mb-2" name="Schedule" />

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
        <span>{{k}}</span>
        <span>{{summary[k]}}</span>
      </div>
    </div>

    <br />
  </div>
</template>

<script lang="ts">
import { ArrowPathRoundedSquareIcon } from '@heroicons/vue/24/outline'
import Label from '../core/display/Label.vue'
import RecipeCard from '../RecipeCard.vue'

const formatInterval = (interval: any, custom: any, rule: any) => {
  if (!interval || !interval.key) return ''

  let s = ''

  switch (interval.key) {
    case 'cron_daily':
    case 'cron_hourly':
    case 'cron_minutely':
    case 'blocks_1000':
      s = interval.value.title
      break
    case 'balance_gt':
    case 'balance_lt':
      s = `${interval.value.title} ${rule.input} ${rule.select.toUpperCase()}`
      break
    case 'custom':
      if (custom && custom.select) {
        if (custom.select === 'block') s = `Every ${custom.input} blocks`
        if (custom.select === 'cron') s = `Cron Spec: "${custom.input}"`
      }
      break
    default:
      s = 'N/A'
  }

  return s
}

// Types:
// Timestamp: Return Humanized
// Block: Return CSV number
// Examples: 'When funds run out' | 'Tuesday, Oct 14th' | '5,134,948' | 'Immediately'
const formatBoundary = (boundary: any, custom?: any) => {
  if (!boundary || !boundary.key) return ''

  let s = ''

  switch (boundary.key) {
    case 'immediate':
    case 'event_funds_lt':
      s = boundary.value.title
      break
    case 'cron_custom':
      const t = new Date(parseInt(custom))
      s = t.toLocaleString()
      break
    case 'blocks_custom':
      // TODO: support other locales
      s = `Block ${parseFloat(`${custom}`).toLocaleString('en-US')}`
      break
    default:
      s = 'N/A'
  }

  return s
}

// // TODO: Read from store
// const [
//   fromAccount,
//   toAccount,
//   fromToken,
//   toToken,
//   amountToSwap,
//   interval,
//   intervalCustom,
//   ruleBalance,
//   ruleBalanceAddress,
//   boundaryStart,
//   boundaryStartNumber,
//   boundaryEnd,
//   boundaryEndNumber,
// ] = getValues([
//   'from_account',
//   'to_account',
//   'from_token',
//   'to_token',
//   'amount_to_swap_each',
//   'interval',
//   'interval_custom',
//   'rule_balance',
//   'rule_balance_address',
//   'boundary_start',
//   'cadence_start_number',
//   'boundary_end',
//   'cadence_end_number',
// ])

// DEMO DATA
const actions = [
  {
    Icon: ArrowPathRoundedSquareIcon,
    title: 'form.action_dca_title',
    subtitle: 'form.action_dca_subtitle',
  },
]

const rules = []

const schedule = {
  interval: 'formatInterval(interval, intervalCustom, ruleBalance)',
  start: 'formatBoundary(boundaryStart, boundaryStartNumber)',
  end: 'formatBoundary(boundaryEnd, boundaryEndNumber)',
}

// TODO:
const summary = {
  fees: '0.234913 JUNO', // gasWanted 380622, gasUsed 389326
  funds: '10 JUNO',
  // duration: '',
  occurances: '~10',
  // signatures: '',
}

let networks: Chain[] = []

// if (fromAccount?.value?.chain) networks.push(fromAccount.value.chain)
// // TODO: Filter dups?
// if (toAccount?.value?.chain) networks.push(toAccount.value.chain)

const recipeData = {
  title: 'Dollar Cost Average from $JUNO to $NETA',
  // subtitle: '',
  owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  // recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
  totalBalance: { amount: '10000000', denom: 'ujuno' },
  actions: [],
  rules: [],
  networks,
}

export default {
  // props: [""],

  components: {
    ArrowPathRoundedSquareIcon,
    Label,
    RecipeCard,
  },

  data() {
    return {
      actions,
      rules,
      schedule,
      summary,
      recipeData,
    }
  },

  computed: {
    fn() {
      // 
    },
  },

  methods: {
    fn() {
      // 
    },
  },
};
</script>
