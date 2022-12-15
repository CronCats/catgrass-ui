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
        <Balance v-if="summary[k].denom" :amount="summary[k].amount" :denom="summary[k].denom" />
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
import {
  ArrowPathRoundedSquareIcon,
} from '@heroicons/vue/24/outline'
import Label from '@/components/core/display/Label.vue'
import Loader from '@/components/Loader.vue'
import Balance from "@/components/core/display/Balance.vue";
import RecipeCard from '../RecipeCard.vue'
import { TaskRequest } from '../../utils/types';

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
      if (!this.context?.totalTaskTxFees) return { amount: '0', denom: '' }
      return this.context.totalTaskTxFees
    },
    fundsTotal() {
      if (!this.context?.attachedFunds) return { amount: '0', denom: '' }
      const occur = this.context?.occurances || 0
      const totalAmount = parseInt(this.context?.attachedFunds.amount) * occur
      return { amount: totalAmount, denom: this.context?.attachedFunds.denom }
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
    async computeEstimates() {
      this.simulating = true
      let signer
      // Get current "sender" account's chain name
      if (this.context?.signer_addr) {
        signer = this.accounts.find((a: Account) => a.address === this.context.signer_addr)
      }
      console.log('signer', signer, this.context);
      const config = await this.getManagerConfig(signer.chain)
      const contracts = this.getContractAddressesByChain(signer.chain)
      console.log('contracts manager', contracts.manager);

      // TODO: Change to use App level config!
      const gasLimitMultiplier = 1.1

      // get base croncat operation gas, from on-chain config
      const gasBaseFee = parseInt(`${config.gas_base_fee}`) || 30000;
      const actionFee = parseInt(`${config.gas_action_fee}`) || 20000;
      const agentFee = parseInt(`${config.agent_fee}`) || 5; // percent
      const ownerFee = parseInt(`${config.owner_fee}`) || 5; // percent
      const queryGas = 3_000 // based on initial testing, eacy external query adds this much gas (~2798)

      if (!signer) return;
      const p = []
      const actions = this.task.actions
      
      // setup promises for each action simulation
      actions.forEach(a => p.push(this.simulateExec(signer, [a])))

      const gasAmounts = await Promise.all(p)

      // Assign each found gas to each action, including app multiplier
      const tmpActions = actions.map((a, i) => {
        const ga = gasAmounts[i] ? gasAmounts[i] : actionFee;
        a.gas_limit = `${Math.ceil(ga * gasLimitMultiplier)}`
        return a
      })
      const encodedActions = [...actions].map((a, i) => {
        // TODO: Make less brittle
        // only encode wasm execute msgs
        if ('wasm' in a.msg) a.msg.wasm.execute.msg = encodeMessage(a.msg.wasm.execute.msg)
        return a
      })
      this.updateTask({ actions: tmpActions })

      // TODO: compute: occurances (try using raf's PR!!)
      const occurances = 3

      // Simulate the task creation gas, then add to the summary/attached fees
      const createTaskMsg: { create_task: { task: TaskRequest } } = { create_task: { task: { ...this.task, actions: encodedActions } } }
      const wasmMsg = getWasmExecMsg({
        contract_addr: contracts.manager,
        msg: createTaskMsg,
        funds: this.context.attachedFunds || [], // NOTE: This doesn't have to be accurate here yet?
      })
      console.log('wasmMsg', wasmMsg);
      // TODO: Figure out error here!
      // const createTaskGas = await this.simulateExec(signer, [wasmMsg])
      const createTaskGas = 123810
      // for directly paying the task creation
      const attachedFee = this.calcFee(createTaskGas, signer.chain)
      const attachedFeeValue = parseInt(attachedFee.amount[0].amount || '0')
      console.log('createTaskGas', createTaskGas, attachedFee);

      // compute & store total fees
      const gasActionTotal = gasAmounts.length > 0 ? gasAmounts.reduce((p, a) => p + a, 0) : 0
      const gasQueriesTotal = this.task?.queries?.length > 0 ? this.task.queries.length * queryGas : 0
      const gasTotal = gasBaseFee + gasActionTotal + gasQueriesTotal

      // Computing a single task txn cost, then multiplying by occurances
      const actionFees = this.calcFee(gasTotal, signer.chain)
      const actionFeeValue = parseInt(actionFees.amount[0].amount || '0')
      // add agent+owner fees into the mix as well!
      const singleTaskTxFees = Math.ceil(actionFeeValue + (actionFeeValue * ((agentFee + ownerFee) / 100)))
      // fee needs to include the occurance multiplier
      const totalTaskTxFeesAmount = (singleTaskTxFees * occurances) + attachedFeeValue
      const totalTaskTxFees = { amount: totalTaskTxFeesAmount, denom: attachedFee.amount[0].denom || signer.chain.base }

      this.updateTaskContext({ attachedFee, singleTaskTxFees, totalTaskTxFees, occurances })

      this.simulating = false
    },
  },
};
</script>
