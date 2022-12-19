<template>
  <div class="cursor-pointer">
    <div
      class="relative z-20 p-6 text-white bg-pink-600 rounded-2xl"
      :style="{ backgroundColor: bgColor }"
    >
      <div>
        <h3 class="text-2xl font-bold">{{ title }}</h3>
      </div>
      <div class="my-4">
        <p v-if="!subtitle" class="flex overflow-hidden text-ellipsis">
          by&nbsp;
          <strong class="overflow-hidden text-ellipsis">
            {{ creator }}
          </strong>
        </p>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div class="flex justify-between mt-2">
        <div class="mt-auto">
          <Balance
            v-if="data.totalBalance"
            :amount="data.totalBalance.amount"
            :denom="data.totalBalance.denom"
            :imageUrl="data.totalBalance.imageUrl"
            :decimals="6"
          />
          <p v-if="stats?.copycats">{{ stats?.copycats }}</p>
        </div>
        <div class="flex">
          <div
            v-for="(chain, index) in recipeChains"
            :key="index"
            :class="{ 'ml-[-12px]': index > 0 }"
          >
            <LogoFromImage
              class="block"
              :rounded="true"
              size="32"
              :src="chain?.asset?.logo_URIs?.png || ''"
            />
          </div>
        </div>
      </div>
      <slot name="body"></slot>
    </div>
    <div
      v-if="data.recipeHash"
      class="relative z-10 px-6 pt-5 pb-2 -mt-4 bg-gray-200 rounded-b-2xl"
    >
      <div class="flex justify-between text-xs">
        <small
          class="overflow-hidden pr-8 my-auto w-full text-ellipsis break-normal"
        >
          Hash:&nbsp;
          <span class="overflow-hidden text-ellipsis break-normal">
            {{ data.recipeHash }}
          </span>
        </small>
        <DocumentDuplicateIcon
          class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Action, Addr, ChainMetadata, Coin, Rule, Task } from "@/utils/types";
import { appConfig } from '@/utils/constants'
import { junoswap, junoswapPools } from '@/utils/junoswap'
import { decodedMessage } from "@/utils/mvpData";
import { getChainData } from "@/utils/helpers";
import { getTaskHash } from "@/utils/taskHelpers";
import { getChainForAccount } from "@/stores/multiWallet";
import Balance from "./core/display/Balance.vue";
import LogoFromImage from "./core/display/LogoFromImage.vue";

import { DocumentDuplicateIcon } from "@heroicons/vue/24/outline";

export interface RecipeCardProps {
  title: String;
  subtitle?: string;
  creator?: Addr;
  recipeHash?: string;
  fee?: Coin;
  totalBalance?: Coin;

  task?: Task;
  networks?: ChainMetadata[];

  stats?: {
    copycats?: Number;
    runs?: Number;
  };
}

const computeTitle = (task: Task, occurs: number): string => {
  let title = 'Custom Message, flexible for developer automations'

  // DCA Criteria: actions have swap, interval is GT 1
  task.actions.forEach((a: any) => {
    if ('wasm' in a.msg) {
      const m = a.msg.wasm.execute.msg

      // TODO: Check
      if (occurs > 0 && Object.keys(m).join('').search('swap') > -1) {
        // TODO: Setup way better support for other networks
        const chainName = appConfig.networkType === 'testnet' ? 'junotestnet' : 'juno'
        const pool = junoswap.getPoolByContractAddr(junoswapPools[chainName], a.msg.wasm.execute.contract_addr)
        const assetA = `${pool.pool_assets[0].symbol}`.toUpperCase()
        const assetB = `${pool.pool_assets[1].symbol}`.toUpperCase()

        title = `Dollar Cost Average from $${assetA} to $${assetB}`
      }
    }

    if ('bank' in a.msg) {
      // Payroll Criteria: actions have 1 or more bank send
      title = `Payment Multi-Sender, funds to one or many accounts periodically`
    }
  })

  // Default: Custom Message
  return title
}

const computeBgColor = (task: Task): string => {
  // Color based on task_hash?
  const task_hash = getTaskHash(task)
  if (task_hash) return `#${task_hash.substring(0, 6)}`

  return 'rgb(219 39 119 / var(--tw-bg-opacity))'
}

export default defineComponent({
  props: ['data', 'containerClassName', 'active'],

  components: {
    Balance,
    DocumentDuplicateIcon,
    LogoFromImage,
  },

  data() {
    return {
      task: null as Task | null,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['networks', 'accounts']),
    bgColor() {
      if (this.data.bgColor) return this.data.bgColor
      return computeBgColor(this.task)
    },
    title() {
      if (this.task) {
        const o = this.getTaskOccurrences(this.task)
        return computeTitle(this.task, o)
      }
      return ''
    },
    subtitle() {
      return `by croncat.cosmos`
    },
    creator() {
      return 'TODO: Replace creator' // creator || owner
    },
    stats() {
      let copycats = 0
      // TODO: Change to real stats later, for now just use local knowns
      if (this.task) copycats = (this.task.actions.length || 0) + (this.task?.queries?.length ? this.task.queries.length : 0) + (this.task?.transforms?.length ? this.task.transforms.length : 0)

      return {
        copycats,
      }
    },
    recipeChains() {
      // Loop actions to look for bech32 contracts
      const networks: any = []

      this.task?.actions.forEach((a: Action) => {
        let address = ''
        // TODO: Support other msg types
        if ('wasm' in a.msg) address = a.msg.wasm.execute.contract_addr
        if ('bank' in a.msg) address = a.msg.bank.send.to_address
        if (address) {
          const chain = getChainForAccount({ address }, this.networks)
          networks.push(getChainData(chain))
        }
      })

      return networks
    },
  },

  methods: {
    ...mapActions(useTaskCreator, ['getTaskOccurrences']),
    loadContext() {
      let task = this.data.task
      if (!task) return;
      const actions = task?.actions ? task.actions : []
      const queries = task?.queries ? task.queries : []

      // decode wasm execute msgs
      task.actions = [...actions].map((a, i) => {
        if ('wasm' in a.msg) a.msg.wasm.execute.msg = decodedMessage(a.msg.wasm.execute.msg)
        return a
      })

      // decode wasm query msgs
      task.queries = [...queries].map((q, i) => {
        if ('query' in q) q.query.msg = decodedMessage(q.query.msg)
        if ('generic_query' in q) q.generic_query.msg = decodedMessage(q.generic_query.msg)
        if ('smart_query' in q) q.smart_query.msg = decodedMessage(q.smart_query.msg)
        return q
      })
      console.log('task', task);

      // apply to local copy
      this.task = task
    },
  },

  mounted() {
    this.loadContext()
  },

  watch: {
    data: ['loadContext'],
  },
});
</script>
