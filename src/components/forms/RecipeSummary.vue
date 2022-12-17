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
      <div v-if="!simulating" v-for="(k, i) in Object.keys(summary)" :key="i" class="flex justify-between my-1 uppercase">
        <span>{{ formatTitle(k) }}</span>
        <Balance v-if="summary[k] && summary[k].denom" :balance="summary[k]" :decimals="6" />
        <span v-else>{{summary[k]}}</span>
      </div>
      <div v-else>
        <Loader class="w-24 mx-auto" />
      </div>
    </div>

    <br />
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import {
  formatInterval,
  formatBoundary,
  getOccurancesTotal,
  getFeeEstimateTotal,
} from "@/utils/helpers"
import { getWasmExecMsg, encodeMessage } from "@/utils/mvpData"
import { appConfig } from "@/utils/constants"
import {
  ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/outline'
import Label from '@/components/core/display/Label.vue'
import Loader from '@/components/Loader.vue'
import Balance from "@/components/core/display/Balance.vue";
import RecipeCard from '../RecipeCard.vue'
import { TaskRequest } from '../../utils/types';
import { TreeBuffer } from "@lezer/common";

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

// TODO: Setup a way to change occurances via UI!
export default {
  components: {
    ArrowPathRoundedSquareIcon,
    Balance,
    Label,
    Loader,
    RecipeCard,
  },

  data() {
    return {
      simulating: true,
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
      console.log('summary', summary);

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
      if (!this.context?.totalAttachedFees) return { amount: '0', denom: '' }
      return this.context.totalAttachedFees
    },
    fundsTotal() {
      if (!this.context?.totalAttachedFunds) return { amount: '0', denom: '' }
      const attachedFunds = this.context?.totalAttachedFunds ? this.context?.totalAttachedFunds : null
      const amount = attachedFunds ? parseInt(attachedFunds.amount) : 0
      const denom = attachedFunds && attachedFunds.denom ? attachedFunds.denom : ''
      return { amount, denom }
    },
    occurances() {
      if (!this.context?.occurances) return '0'
      // return `~${getOccurancesTotal(this.task) }`
      return `~${this.context?.occurances}`
    },
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    ...mapActions(useMultiWallet, [
      'simulateExec',
      'execContract',
      'calcFee',
      'getManagerQueryInstance',
      'getContractAddressesByChain',
    ]),
    formatTitle(str: string) {
      return str.replace(/_/g, ' ')
    },
    async getManagerConfig(chain: Chain) {
      // Get manager instance by chain
      const manager = await this.getManagerQueryInstance(chain)

      try {
        const res = await manager.getConfig()
        return res
      } catch (e) {
        return {}
      }
    },
    // TODO: Cover try/catch + errors
    // TODO: Cover with toast/alerts
    // TODO: Refactor
    async computeEstimates() {
      this.simulating = true
      let signer
      // Get current "sender" account's chain name
      if (this.context?.signer_addr) {
        signer = this.accounts.find((a: Account) => a.address === this.context.signer_addr)
      }
      console.log('signer', signer, this.context);
      // App level config!
      const gasLimitMultiplier = appConfig.gasLimitMultiplier

      // Network level config!
      // NOTE: Needs to be grabbed for each network involved, when available
      const config = await this.getManagerConfig(signer.chain)
      const contracts = this.getContractAddressesByChain(signer.chain)

      // get base croncat operation gas, from on-chain config
      // NOTE: Likely config.gas_price will be available, but will utilize chain registry avg
      const gasBaseFee = parseInt(`${config.gas_base_fee}`) || 30000;
      const actionFee = parseInt(`${config.gas_action_fee}`) || 20000;
      const agentFee = parseInt(`${config.agent_fee}`) || 5; // percent
      const ownerFee = parseInt(`${config.owner_fee}`) || 5; // percent
      // based on initial testing, easy external query adds this much gas (~57980)
      const queryGas = 60000

      if (!signer) return;
      const p = []
      const actions = this.task.actions
      const queries = this.task.queries
      
      // setup promises for each action simulation
      actions.forEach(a => p.push(this.simulateExec(signer, [a])))

      const gasAmounts = await Promise.all(p)

      // Assign each found gas to each action, including app multiplier
      const tmpActions = actions.map((a, i) => {
        const ga = gasAmounts[i] ? gasAmounts[i] : actionFee;
        a.gas_limit = Math.ceil(ga * gasLimitMultiplier)
        return a
      })
      const encodedActions = [...actions].map((a, i) => {
        // TODO: Check if needed
        // only encode wasm execute msgs
        // if ('wasm' in a.msg) a.msg.wasm.execute.msg = encodeMessage(a.msg.wasm.execute.msg)
        return a
      })
      const encodedQueries = [...queries].map((q, i) => {
        // only encode wasm query msgs
        if ('query' in q) q.query.msg = encodeMessage(q.query.msg)
        if ('generic_query' in q) q.generic_query.msg = encodeMessage(q.generic_query.msg)
        if ('smart_query' in q) q.smart_query.msg = encodeMessage(q.smart_query.msg)
        return q
      })
      this.updateTask({ actions: tmpActions })
      console.log('encodedActions', tmpActions, encodedActions);

      // TODO: compute: occurances (try using raf's PR!!)
      const occurances = 3

      // Compute correct funds to attach, including enough for future fees, any per-action funds
      const totalQueriesGas = encodedQueries.length * queryGas
      const totalActionsGas = gasAmounts.length > 0 ? gasAmounts.reduce((p, a) => p + a, 0) : 0
      const gasTotal = gasBaseFee + totalActionsGas + totalQueriesGas

      // Computing a single task txn cost, then multiplying by occurances
      const actionFees = this.calcFee(gasTotal, signer.chain)
      const actionFeeValue = parseInt(actionFees.amount[0].amount || '0')
      // add agent+owner fees into the mix as well!
      const singleTaskTxFees = Math.ceil(actionFeeValue + (actionFeeValue * ((agentFee + ownerFee) / 100)))
      // TODO: setup better funds handler for unique denom coins maths
      const attachedFunds = this.context?.attachedFunds && this.context?.attachedFunds.length > 0 ? this.context?.attachedFunds[0] : null
      const attachedAmount = attachedFunds ? parseInt(attachedFunds.amount) : 0

      // fee needs to include the occurance multiplier
      const totalTaskTxFeesAmount = singleTaskTxFees * occurances
      const totalTaskTxAttachedAmount = attachedAmount * occurances
      const totalAttachedFunds = { amount: `${totalTaskTxAttachedAmount}`, denom: attachedFunds.denom || signer.chain.base }
      const totalAttachedFees = { amount: `${totalTaskTxFeesAmount}`, denom: actionFees.amount[0].denom || signer.chain.base }
      const totalTaskCost = Math.ceil(totalTaskTxFeesAmount + totalTaskTxAttachedAmount)
      const totalTaskTxFees = { amount: `${totalTaskCost}`, denom: actionFees.amount[0].denom || signer.chain.base }

      // Simulate the task creation gas, then add to the summary/attached fees
      const createTaskMsg: { create_task: { task: TaskRequest } } = { create_task: { task: {
        ...this.task,
        actions: encodedActions,
        queries: encodedQueries,
      } } }
      const signPayload = {
        contract_addr: contracts.manager,
        msg: createTaskMsg,
        // NOTE: This has to be accurate here!!!!
        funds: [totalTaskTxFees],
      }
      const wasmMsg = getWasmExecMsg(signPayload)
      console.log('wasmMsg', wasmMsg);
      // for directly paying the task creation
      const createTaskGas = await this.simulateExec(signer, [wasmMsg])
      const attachedFee = this.calcFee(createTaskGas, signer.chain)
      const attachedFeeValue = parseInt(attachedFee.amount[0].amount || '0')

      // Add attachedFee to totalTaskTxFees for UI accuracy
      if (attachedFeeValue) {
        totalAttachedFees.amount = `${parseInt(totalAttachedFees.amount) + attachedFeeValue}`
        totalTaskTxFees.amount = `${totalTaskCost + attachedFeeValue}`
      }

      signPayload.chain = signer.chain
      this.updateTaskContext({ signPayloads: [signPayload], totalAttachedFunds, totalAttachedFees, occurances })

      this.simulating = false
    },
  },
};
</script>
