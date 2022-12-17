<template>
  <div class="my-8">
    <h3 class="mb-2 text-xl">Sign Transactions</h3>
  
    <div class="my-12">
      <div v-for="item in chainItems" :key="item.chain.chain_id">
        <div class="flex justify-between p-2 w-full cursor-pointer">
          <div class="flex my-auto w-full">
            <div class="flex-col py-2 mr-2" :style="{ minWidth: '40px' }">
              <LogoFromImage class="block mr-4" :rounded="true" size="40" :src="item.chain?.asset?.logo_URIs?.png || ''" />
            </div>
            <div class="flex-col py-2 m-auto w-full">
              <h3 class="text-lg font-bold leading-4">{{item.chain?.pretty_name}}</h3>
              <small class="text-xs text-gray-400 lowercase">
                {{item.chain?.chain_id}}
                1 task, 3 JUNOX Funds, 0.071283 JUNOX Fee
              </small>
            </div>
            <div class="flex-col py-2 m-auto w-auto">
              <Button class="min-w-[110px] bg-green-600 hover:bg-green-800" @click="sign(item)">
                <span>Sign</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
  
    <InputLabel class="mb-2" name="Note" />
    <small class="text-gray-400">You will be signing transactions per-network. Depending on how many actions you have, there will more multiple times required to sign. Failure to sign all items could result in a bad state, please proceed carefully!</small>
  
    <br />
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import Label from '../core/display/Label.vue'
import Balance from '../core/display/Balance.vue'
import Button from "../core/buttons/Button.vue";
import LogoFromImage from '../core/display/LogoFromImage.vue'

export default {
  props: ["onComplete"],

  components: {
    Label,
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
    ...mapState(useMultiWallet, ['accounts', 'networks']),
    ...mapState(useTaskCreator, ['task', 'context']),
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    ...mapActions(useMultiWallet, ['execContract']),
    loadContext() {
      // TODO: likely need to error handle if no signPayloads available
      if (!this.context?.signPayloads) return;
    
      this.context.signPayloads.forEach((payload: any) => {
        const cn = payload.chain.chain_name
        if (this.chainItems[cn]) {
          const msgs = this.chainItems[cn].msgs || []
          this.chainItems[cn] = { ...payload, msgs }
        } else this.chainItems[cn] = { ...payload, msgs: [payload.msg] }
      })
    },
    async sign(payload) {
      console.log(payload, this.task, this.context)
      const { contract_addr, msg, funds, chain } = payload
      this.signing = true
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
        this.updateTaskContext({ transactionHash: res.transactionHash, task_hash })
        // TODO: update signing status

        // Assess if all signs are complete
        this.finalize()
      } catch (e) {
        console.log('sign e', e, payload);
        // TODO: update signing status
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
