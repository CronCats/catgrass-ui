<template>
  <div  class="my-8">
    <h3 class="mb-8 text-xl">Confirm Details</h3>

    <RecipeCard bgColor="#F9226C" :data="recipeData" />

    <br />
    <br />

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

    <div class="relative p-3 mt-2 mb-2 w-full text-left bg-white rounded-md cursor-default sm:text-sm">
      <div class="flex justify-between" @click="toggleAdvanced">
        <Label name="Advanced" />
        <ChevronUpIcon :class="showAdvanced != true ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-500" />
      </div>
      <div v-if="showAdvanced == true" class="pt-4">
        <div v-if="task.queries && task.queries.length > 0" class="mb-4">
          <Label class="mb-2" name="Queries" />
          <CustomMsgCollapseItem v-for="(item, idx) in task.queries" :key="idx" :item="item" :active="activeItem == item"
            :toggleCallback="toggleItem(item)" />
        </div>
        
        <div v-if="task.transforms && task.transforms.length > 0" class="mb-4">
          <Label class="mb-2" name="Transforms" />
          <CustomMsgCollapseItem v-for="(item, idx) in task.transforms" :key="idx" :item="item" :active="activeItem == item"
            :toggleCallback="toggleItem(item)" />
        </div>
        
        <div v-if="task.actions && task.actions.length > 0">
          <Label class="mb-2" name="Actions" />
          <CustomMsgCollapseItem v-for="(item, idx) in task.actions" :key="idx" :item="item" :active="activeItem == item"
            :toggleCallback="() => toggleItem(item)" />
        </div>
      </div>
    </div>
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
  ChevronUpIcon,
} from '@heroicons/vue/24/outline'
import CustomMsgCollapseItem from "../core/display/CustomMsgCollapseItem.vue";
import Label from '@/components/core/display/Label.vue'
import Loader from '@/components/Loader.vue'
import Balance from "@/components/core/display/Balance.vue";
import RecipeCard from '../RecipeCard.vue'
import { TaskRequest } from '../../utils/types';

// TODO: Setup a way to change occurrences via UI!
export default {
  components: {
    ArrowPathRoundedSquareIcon,
    ChevronUpIcon,
    CustomMsgCollapseItem,
    Balance,
    Label,
    Loader,
    RecipeCard,
  },

  data() {
    return {
      simulating: true,
      showAdvanced: false,
      activeItem: null,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['networks', 'accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
    recipeData() {
      return {
        task: this.task
      }
    },
    schedule() {
      const schedule: any = {}

      if (this.interval) schedule.interval = this.interval
      if (this.start) schedule.start = this.start
      if (this.end) schedule.end = this.end

      return schedule
    },
    summary() {
      const summary: any = {}

      // Sum fees + deposit
      if (this.feesTotal && this.fundsTotal) {
        // TODO: Abstract this
        const feeAmt = this.feesTotal ? parseInt(this.feesTotal.amount) : 0
        const fundAmt = this.fundsTotal ? parseInt(this.fundsTotal.amount) : 0
        const denom = this.fundsTotal.denom ? this.fundsTotal.denom : ''
        summary.total_cost = { amount: `${feeAmt + fundAmt}`, denom }
      }
      else summary.total_cost = { amount: '0', denom: '' }
      
      if (this.feesTotal) summary.total_fees = this.feesTotal
      if (this.fundsTotal) summary.total_deposit = this.fundsTotal
      if (this.occurrences) summary.total_occurrences = this.occurrences
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
    occurrences() {
      if (!this.context?.occurrences) return '0'
      // return `~${getOccurancesTotal(this.task) }`
      return `${this.context?.occurrences}`
    },
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext', 'getTaskOccurrences']),
    ...mapActions(useMultiWallet, [
      'simulateExec',
      'execContract',
      'calcFee',
      'getManagerQueryInstance',
      'getContractAddressesByChain',
    ]),
    toggleAdvanced() {
      this.showAdvanced = !this.showAdvanced
    },
    toggleItem(item: any) {
      if (this.activeItem === item) this.activeItem = null
      else this.activeItem = item
    },
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
      if (this.context.signer_addr) {
        signer = this.accounts.find((a: Account) => a.address === this.context.signer_addr)
      }
      console.log('signer', signer, this.context.signer_addr);
      // App level config!
      const gasLimitMultiplier = appConfig.gasLimitMultiplier

      // Network level config!
      // NOTE: Needs to be grabbed for each network involved, when available
      const config = await this.getManagerConfig(signer.chain)
      const contracts = this.getContractAddressesByChain(signer.chain)

      // get base croncat operation gas, from on-chain config
      // NOTE: Likely config.gas_price will be available, but will utilize chain registry avg
      // REF: https://github.com/CronCats/cw-croncat/blob/main/contracts/cw-croncat/src/contract.rs#L19
      const gasBaseFee = parseInt(`${config.gas_base_fee}`) || 300000;
      const actionFee = parseInt(`${config.gas_action_fee}`) || 130000;
      const agentFee = parseInt(`${config.agent_fee}`) || 5; // percent
      const ownerFee = parseInt(`${config.owner_fee}`) || 5; // percent
      const baseExitFee = 60000; // TODO: Was getting weird simulate issues, and needed this number to get passed "not enough funds attached" warning.
      console.log(gasBaseFee, actionFee, agentFee, ownerFee);
      
      // based on initial testing, easy external query adds this much gas (~57980)
      const queryGas = 60000

      if (!signer) return;
      const p = []
      const actions = this.task.actions || []
      const queries = this.task.queries || []
      console.log('actions', actions);
      console.log('queries', queries);
      console.log('HERE:', encodeMessage({tick:{}}));
      
      // setup promises for each action simulation
      actions.forEach(a => p.push(this.simulateExec(signer, [a])))

      const gasAmounts = await Promise.all(p)
      console.log('gasAmounts', gasAmounts);

      // Assign each found gas to each action, including app multiplier
      const tmpActions = actions.map((a, i) => {
        const ga = gasAmounts[i] ? gasAmounts[i] : actionFee;
        a.gas_limit = Math.ceil(ga * gasLimitMultiplier)
        return a
      })
      const encodedActions = [...actions].map((a, i) => {
        // only encode wasm execute msgs
        if ('wasm' in a.msg && typeof a.msg.wasm.execute.msg === 'string') a.msg.wasm.execute.msg = encodeMessage(a.msg.wasm.execute.msg)
        return a
      })
      const encodedQueries = [...queries].map((q, i) => {
        // only encode wasm query msgs
        if ('query' in q) q.query.msg = encodeMessage(q.query.msg)
        if ('generic_query' in q) q.generic_query.msg = encodeMessage(q.generic_query.msg)
        if ('smart_query' in q) q.smart_query.msg = encodeMessage(q.smart_query.msg)
        return q
      })
      this.updateTask({ actions: encodedActions })
      console.log('encodedActions', tmpActions, encodedActions);

      // Compute correct funds to attach, including enough for future fees, any per-action funds
      const totalQueriesGas = encodedQueries.length * queryGas
      const totalActionsGas = gasAmounts.length > 0 ? gasAmounts.reduce((p, a) => p + a, 0) : 0
      const gasTotal = gasBaseFee + totalActionsGas + totalQueriesGas

      // Computing a single task txn cost
      const actionFees = this.calcFee(gasTotal, signer.chain)
      console.log('actionFees', actionFees);
      
      const actionFeeValue = parseInt(actionFees.amount[0].amount || '0')
      // add agent+owner fees into the mix as well!
      const singleTaskTxFees = Math.ceil(actionFeeValue + (actionFeeValue * ((agentFee + ownerFee) / 100)))
      // TODO: setup better funds handler for unique denom coins maths
      const attachedFunds = this.context?.attachedFunds && this.context?.attachedFunds.length > 0 ? this.context?.attachedFunds[0] : null
      const attachedAmount = attachedFunds ? parseInt(attachedFunds.amount) : 0

      // compute: occurrences, cap at the max of worst case attached funds/fees maths
      // TODO: Allow override via input as necessary
      let occurrences = this.getTaskOccurrences(this.task, this.context.blockHeight || 0)

      // fee needs to include the occurance multiplier
      const totalTaskTxFeesAmount = singleTaskTxFees * occurrences
      const totalTaskTxAttachedAmount = attachedAmount * occurrences
      const totalAttachedFunds = { amount: `${totalTaskTxAttachedAmount}`, denom: attachedFunds.denom || signer.chain.base }
      const totalAttachedFees = { amount: `${totalTaskTxFeesAmount}`, denom: actionFees.amount[0].denom || signer.chain.base }
      const totalTaskCost = Math.ceil(totalTaskTxFeesAmount + totalTaskTxAttachedAmount + baseExitFee)
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
      this.updateTaskContext({ signPayloads: [signPayload], totalAttachedFunds, totalAttachedFees, occurrences })

      this.simulating = false
    },
  },
};
</script>
