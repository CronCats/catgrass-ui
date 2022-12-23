<template>
  <div class="my-8 mb-16">
    <h3 class="mb-2 text-xl">Sign Transactions</h3>
  
    <!-- <div class="my-6">
      <Label class="mb-2" name="Active Wallet Account" />
      <div v-if="currentAccount" class="bg-white rounded-lg border-2 border-gray-100">
        <Account :account="currentAccount" :hide-balance="true" />
      </div>
      <Subtext className="mb-2 text-gray-400" text="Match this account for each signature below" />
    </div> -->
    <!-- <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" /> -->
    <div class="my-12">
      <div v-for="item in chainItems" :key="item.chain.chain_id">
        <div class="flex justify-between p-2 w-full bg-white rounded-lg border-2 border-gray-100">
          <div class="flex my-auto w-full">
            <div class="flex-col py-2 mr-2" :style="{ minWidth: '40px' }">
              <LogoFromImage class="block mr-4" :rounded="true" size="40" :src="item.asset?.logo_URIs?.png || ''" />
            </div>
            <div class="flex-col py-2 m-auto w-full">
              <h3 class="text-lg font-bold leading-4">{{item.chain?.pretty_name}}</h3>
              <small class="text-xs text-gray-400 lowercase">
                {{item.chain?.chain_id}},
                <Balance :balance="totalCost" :decimals="6" />
              </small>
            </div>
            <div class="flex-col py-2 m-auto w-auto">
              <Button :disabled="item.signing == true" :class="{
                'min-w-[110px] text-white uppercase transition-colors': true,
                'bg-green-600 hover:bg-green-800': !item.signing,
                'bg-gray-800': item.signing,
              }" @click="sign(item)">
                <span v-if="!item.signing">Sign</span>
                <Loader v-if="item.signing" class="w-6 mx-auto" color="white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div v-if="Object.keys(chainItems).length > 1">
      <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
  
      <Label class="mb-2" name="Note" />
      <small class="text-gray-400">You will be signing transactions per-network. Depending on how many actions you have, there will more multiple times required to sign. Failure to sign all items could result in a bad state, please proceed carefully!</small>
    </div>  
  
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { getChainData } from "@/utils/helpers"
import Account from '@/components/core/display/Account.vue'
import Label from '@/components/core/display/Label.vue'
import Subtext from '@/components/core/display/Subtext.vue'
import Loader from "@/components/Loader.vue";
import Balance from '../core/display/Balance.vue'
import Button from "../core/buttons/Button.vue";
import LogoFromImage from '../core/display/LogoFromImage.vue'

export default {
  props: ["onComplete"],

  components: {
    Account,
    Label,
    Subtext,
    Loader,
    Balance,
    Button,
    LogoFromImage,
  },

  data() {
    return {
      chainItems: {},
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts', 'networks', 'currentWallet']),
    ...mapState(useTaskCreator, ['task', 'context']),
    currentAccount() {
      console.log('currentWallet', this.currentWallet);
      if (!this.currentWallet) return
      return {
        title: this.currentAccount?.username || null,
        address: this.currentAccount?.address || null,
        chain: this.currentAccount?.chain,
      }
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
    totalCost() {
      let total_cost: any = {}

      // Sum fees + deposit
      if (this.feesTotal && this.fundsTotal) {
        // TODO: Abstract this
        const feeAmt = this.feesTotal ? parseInt(this.feesTotal.amount) : 0
        const fundAmt = this.fundsTotal ? parseInt(`${this.fundsTotal.amount}`) : 0
        const denom = this.fundsTotal.denom ? this.fundsTotal.denom : ''
        total_cost = { amount: `${feeAmt + fundAmt}`, denom }
      }
      else total_cost = { amount: '0', denom: '' }

      return total_cost
    },
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    ...mapActions(useMultiWallet, ['execContract']),
    loadContext() {
      // TODO: likely need to error handle if no signPayloads available
      if (!this.context?.signPayloads) return;
      console.log('currentWallet', this.currentWallet);
    
      this.context.signPayloads.forEach((payload: any) => {
        const cn = payload.chain.chain_name
        const meta = getChainData(payload.chain)
        const signing = false
        if (this.chainItems[cn]) {
          const msgs = this.chainItems[cn].msgs || []
          this.chainItems[cn] = { ...payload, ...meta, signing, msgs }
        } else this.chainItems[cn] = { ...payload, ...meta, signing, msgs: [payload.msg] }
      })
    },
    async sign(payload) {
      console.log(payload, this.task, this.context)
      const cn = payload.chain.chain_name
      const { contract_addr, msg, funds, chain } = payload
      payload.signing = true

      // update status
      this.chainItems[cn] = payload

      let signer
      // Get current "sender" account's chain name
      if (this.context?.signer_addr) {
        signer = this.accounts.find((a: Account) => a.address === this.context.signer_addr)
      }
      console.log('signer', signer, this.context);

      try {
        const res = await this.execContract(signer, contract_addr, msg, 'auto', null, funds)
        console.log('res', res);
        let task_hash = ''
        res.events.forEach((e: any) => {
          if (e.type === 'wasm') {
            let a: any = {}
            e.attributes.forEach((at: any) => {
              a[at.key] = at.value
            })

            if (a.method === 'create_task' && a.task_hash) task_hash = a.task_hash
          }
        })

        // Assign tx hash & task_hash into the context
        this.updateTaskContext({ transactionHash: res.transactionHash, taskHash: task_hash })
        this.updateTask({ owner_id: signer.address })
        // update signing status
        payload.signing = false
        this.chainItems[cn] = payload

        // Assess if all signs are complete
        this.finalize()
      } catch (e) {
        console.log('sign e', e, payload);
        // update signing status
        payload.signing = false
        this.chainItems[cn] = payload
      }
    },
    finalize() {
      // TODO: Need to check that each network is signed before moving on
      console.log(this.task, this.context)
      if (this.onComplete) this.onComplete()
    },
  },

  mounted() {
  },
};
</script>
