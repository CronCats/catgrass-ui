<template>
  <div class="flex flex-col cursor-pointer">
    <div
      class="flex flex-col h-full relative z-20 p-6 text-white bg-pink-600 rounded-2xl"
      :style="{ backgroundColor: bgColor, transition: 'background-color 220ms ease-in-out' }"
    >
      <div class="flex-col">
        <h3 class="text-2xl font-bold">{{ title }}</h3>
      </div>
      <div class="py-4 mt-2">
        <p v-if="!subtitle" class="flex overflow-hidden text-ellipsis">
          by&nbsp;
          <strong class="overflow-hidden text-ellipsis">
            {{ creator }}
          </strong>
        </p>
        <p v-html="subtitle"></p>
      </div>
      <slot name="body"></slot>
      <div class="flex justify-between pt-2 mt-auto">
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
    </div>
    <div
      v-if="data.taskHash"
      class="relative z-10 px-6 pt-5 pb-2 -mt-4 bg-gray-200 rounded-b-2xl"
    >
      <div class="flex justify-between text-xs">
        <small
          class="overflow-hidden pr-8 my-auto w-full text-ellipsis break-normal"
        >
          ID: <span class="overflow-hidden text-ellipsis break-normal">
            {{ ellipseLongString(data.taskHash, 32) }}
          </span>
        </small>
        <!-- <DocumentDuplicateIcon
          class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { fromBech32 } from "@cosmjs/encoding";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Action, Addr, ChainMetadata, Coin, Rule, Task } from "@/utils/types";
import { appConfig } from '@/utils/constants'
import { junoswap, junoswapPools } from '@/utils/junoswap'
import { decodedMessage } from "@/utils/mvpData";
import { getChainData, fromMicroDenom, ellipseLongString } from "@/utils/helpers";
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
  let title = ''
  let coreType = 'custom'
  let context: any = { paymentAssets: []}

  // NOTE: This only works for the last action, needs to consider all and use "THEN" statements for context changes
  task.actions.forEach((a: any) => {
    // All the boring interval boundary shtuff
    context.times = `time${occurs != 1 ? 's' : ''}`
    context.startStr = '' // `, starting at block 123,456`
    context.endStr = '' // `, ending at block 123,656`

    // TODO: Consider query context: if balance lower than X

    if ('wasm' in a.msg) {
      const m = a.msg.wasm.execute.msg

      // TODO: Migrate to WYND once launched
      // TODO: If known app, add to the recipeNetworks chain for contextual app UI icon
      // DCA Criteria: actions have swap, interval is GT 1
      if (occurs > 0 && Object.keys(m).join('').search('swap') > -1) {
        coreType = 'dca'
        // TODO: Setup way better support for other networks
        const chainName = appConfig.networkType === 'testnet' ? 'junotestnet' : 'juno'
        const pool = junoswap.getPoolByContractAddr(junoswapPools[chainName], a.msg.wasm.execute.contract_addr)
        context.assetA = `${pool.pool_assets[0].symbol}`.toUpperCase()
        context.assetB = `${pool.pool_assets[1].symbol}`.toUpperCase()
      }
    }

    // NOTE: This only works for native tokens
    if ('bank' in a.msg) {
      // Payroll Criteria: actions have 1 or more bank send
      coreType = 'payroll'
      const amount = a.msg.bank.send.amount
      const assets = amount.map(a => {
        const r = `${fromMicroDenom(a.denom)}`.toUpperCase()
        
        if (!context.paymentAssets.includes(r)) return `$${r}`
        return ''
      }) //`$JUNO, $NETA`
      context.paymentAssets = context.paymentAssets.length > 0 ? context.paymentAssets.concat(assets) : assets
      context.totalRecipients = typeof context.totalRecipients !== 'undefined' ? context.totalRecipients + 1 : 1
    }
  })

  switch (coreType) {
    case 'custom':
      const queries = task.queries ? `${task.queries.length == 1 ? '1 query,' : task.queries.length + ' queries,'}` : ''
      const transforms = task.transforms ? `${task.transforms.length == 1 ? ' 1 transform,' : task.transforms.length + ' transforms,'}` : ''
      const actions = `${task.actions.length == 1 ? '1 action' : task.actions.length + ' actions'}`
      title = `Custom task with ${queries}${transforms} and ${actions}`
      break;
    case 'dca':
      title = `Dollar Cost Average from $${context.assetA} to $${context.assetB}${context.startStr}${context.endStr}`
      break;
    case 'payroll':
      const recipients = `recipient${context.totalRecipients != 1 ? 's' : ''}`
      title = `Send ${context.paymentAssets.join(' & ')} tokens to ${context.totalRecipients} ${recipients} ${occurs} ${context.times}${context.startStr}${context.endStr}`
      break;
    default:
      break;
  }

  // Default: Custom Message
  return title
}

const computeBgColor = (task: Task): string => {
  // Color based on task_hash?
  const task_hash = getTaskHash(task)
  // NOTE: Apparently the sha256 variability based on the input has the best difference and 
  // non-pollutive color range as defined below. #wowwwwww
  if (task_hash) return `#${task_hash.substring(task_hash.length - 21, task_hash.length - 15)}`

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
      ellipseLongString,
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
        const occurs = Math.max(1, o)
        return computeTitle(this.task, occurs)
      }
      return ''
    },
    subtitle() {
      let s = ''
      if (this.task && this.task.owner_id) {
        s = ellipseLongString(this.task.owner_id, 16)
      } else {
        const b = this.recipeChains.length > 0 ? this.recipeChains[0].asset.display : null
        s = `croncat.${b}`
      }
      
      return `by <strong>${s}</strong>`
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
      const uniqs: string[] = []

      this.task?.actions.forEach((a: Action) => {
        let address = ''
        // TODO: Support other msg types
        if ('wasm' in a.msg) address = a.msg.wasm.execute.contract_addr
        if ('bank' in a.msg) address = a.msg.bank.send.to_address
        if (address) {
          try {
            const chain = getChainForAccount({ address }, this.networks)
            if (!uniqs.includes(chain.chain_id)) {
              networks.push(getChainData(chain))
              uniqs.push(chain.chain_id)
            }
          } catch (e) {
            // do nothangs
          }
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
