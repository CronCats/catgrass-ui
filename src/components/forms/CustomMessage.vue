<template>
  <div aria-details="custom message fields" class="my-8 w-full min-h-16">
      <Label class="mb-2" name="Signer Account" />
      <AccountSelector :onChange="pickFromAccount" :options="accounts" />

      <br />
      <Label v-if="availableTokens.length > 0" class="mb-2" name="Attached Funds" />
      <TokenInputSelector :onChange="pickTokenInput" :options="availableTokens" />

      <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />

      <h3 class="text-xl">Queries ({{queries.length}})</h3>
      <Subtext text="Request data or check data meets criteria before actions" />
      <div v-for="(item, idx) in queries" :key="idx" class="relative p-3 mt-2 mb-2 w-full text-left bg-white rounded-md border-2 border-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 cursor-default sm:text-sm">
        <div class="flex w-full justify-between">
          <div class="flex w-full justify-between" @click="toggleItem(item)">
            <span>{{ getItemTitle(item, idx) }}</span>
            <ChevronUpIcon :class="activeItem == item ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-500" />
          </div>
          <div class="cursor-pointer opacity-30 hover:opacity-100 pr-2 pl-6" @click="removeJsonByType(idx, 'queries')">
            <TrashIcon class="w-5" />
          </div>
        </div>
        <div :class="activeItem == item ? 'visible' : 'hidden'" class="text-sm text-gray-500 relative w-full pt-2">
          <Codemirror
            :modelValue="JSON.stringify(item, null, 2)"
            :style="{ height: '150px', borderRadius: '6px', overflow: 'scroll' }"
            :autofocus="false"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
          />
        </div>
      </div>

      <h3 class="mt-6 text-xl">Transforms ({{transforms.length}})</h3>
      <Subtext text="Use context from queries as variables inside other queries or actions" />
      <div v-for="(item, idx) in transforms" :key="idx" class="relative p-3 mt-2 mb-2 w-full text-left bg-white rounded-md border-2 border-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 cursor-default sm:text-sm">
        <div class="flex w-full justify-between">
          <div class="flex w-full justify-between" @click="toggleItem(item)">
            <span>{{ getItemTitle(item, idx) }}</span>
            <ChevronUpIcon :class="activeItem == item ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-500" />
          </div>
          <div class="cursor-pointer opacity-30 hover:opacity-100 pr-2 pl-6" @click="removeJsonByType(idx, 'transforms')">
            <TrashIcon class="w-5" />
          </div>
        </div>
        <div :class="activeItem == item ? 'visible' : 'hidden'" class="text-sm text-gray-500 relative w-full pt-2">
          <Codemirror
            :modelValue="JSON.stringify(item, null, 2)"
            :style="{ height: '150px', borderRadius: '6px', overflow: 'scroll' }"
            :autofocus="false"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
          />
        </div>
      </div>

      <h3 class="mt-6 text-xl">Actions ({{actions.length}})</h3>
      <Subtext text="Execute cross-contract calls with any kind of Cosmos or CosmWasm message" />
      <div v-for="(item, idx) in actions" :key="idx" class="relative p-3 mt-2 mb-2 w-full text-left bg-white rounded-md border-2 border-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 cursor-default sm:text-sm">
        <div class="flex w-full justify-between">
          <div class="flex w-full justify-between" @click="toggleItem(item)">
            <span>{{ getItemTitle(item, idx) }}</span>
            <ChevronUpIcon :class="activeItem == item ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-500" />
          </div>
          <div class="cursor-pointer opacity-30 hover:opacity-100 pr-2 pl-6" @click="removeJsonByType(idx, 'actions')">
            <TrashIcon class="w-5" />
          </div>
        </div>
        <div :class="activeItem == item ? 'visible' : 'hidden'" class="text-sm text-gray-500 relative w-full pt-2">
          <Codemirror
            :modelValue="JSON.stringify(item, null, 2)"
            :style="{ height: '150px', borderRadius: '6px', overflow: 'scroll' }"
            :autofocus="false"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
          />
        </div>
      </div>
      

      <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
      
      <div class="p-2 pb-0 mt-4 bg-gray-100 rounded-lg md:p-4 md:pb-0">
        <Label class="mb-2" name="Configure JSON" />
        <SelectList name="activeJsonType" :onChange="setActiveJsonType" :options="jsonTypeOptions" />

        <!-- <Label class="mb-2" name="Custom JSON Message" /> -->
        <div class="relative mt-4">
          <Codemirror
            v-model="code"
            placeholder="JSON goes here..."
            :style="{ height: '350px', borderRadius: '6px', overflow: 'hidden' }"
            :autofocus="true"
            :indent-with-tab="true"
            :tab-size="2"
            :extensions="extensions"
            @ready="handleReady"
          />
          <!-- 
            @focus="log('focus', $event)"
            @blur="log('blur', $event)" -->
        </div>

        <Button @click="addJsonByType" :active="true" class="mt-6 mb-4 btn-success" variant="primary">
          <PlusIcon class="w-4" />
          <span>Add to {{ activeJsonType.title }}</span>
        </Button>
      </div>

    </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import type { Account } from '@/utils/types'
import { getChainAssetList } from '@/utils/helpers'
import AccountSelector from '@/components/core/inputs/AccountSelector.vue'
import TokenInputSelector from '@/components/core/inputs/TokenInputSelector.vue'
import SelectList from '@/components/core/inputs/SelectList.vue'
import Label from '@/components/core/display/Label.vue'
import Subtext from '@/components/core/display/Subtext.vue'
import Button from '@/components/core/buttons/Button.vue'
import {
  ArrowsRightLeftIcon,
  BarsArrowDownIcon,
  DocumentCheckIcon,
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

const extensions: any = [json(), oneDark]

const actionDefaultCode: string = `{
  "method_name": {
    "example": "YOUR THINGS HERE"
  }
}`
const queryDefaultCode: string = `{
  "contract_addr": "COSMWASM_CONTRACT_ADDRESS HERE",
  "msg": {
    "example": "YOUR QUERY HERE"
  },
  "res_query_value": [
    {
      "key": "admin"
    }
  ],
  "ordering": "unit_above",
  "value": "500"
}`
const transformDefaultCode: string = `{
  "kind": "Action",
  "req_idx": 1,
  "res_idx": 0,
  "req_path": [
    {
      "key": "transfer"
    },
    {
      "key": "amount"
    }
  ],
  "res_path": [
    {
      "key": "admin"
    }
  ]
}`

const jsonTypeOptions = [
  {
    sort: 1,
    Icon: BarsArrowDownIcon,
    title: 'Actions',
    type: 'actions',
    defaultCode: actionDefaultCode,
  },
  {
    sort: 2,
    Icon: DocumentCheckIcon,
    title: 'Queries',
    type: 'queries',
    defaultCode: queryDefaultCode,
  },
  {
    sort: 3,
    Icon: ArrowsRightLeftIcon,
    title: 'Transforms',
    type: 'transforms',
    defaultCode: transformDefaultCode,
  },
]

export default {
  components: {
    AccountSelector,
    TokenInputSelector,
    ChevronUpIcon,
    Button,
    Label,
    Subtext,
    Codemirror,
    PlusIcon,
    TrashIcon,
    SelectList,
  },

  data() {
    return {
      code: '',
      extensions,
      view: null as any,
      selectedAccount: null,
      selectedToken: null,
      funds: { amount: 0, denom: '' } as Coin,
      availableTokens: [] as Asset[],
      activeItem: null,
      queries: [],
      transforms: [],
      actions: [],
      activeJsonType: jsonTypeOptions[0],
      jsonTypeOptions,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    toggleItem(item: any) {
      if (this.activeItem === item) this.activeItem = null
      else this.activeItem = item
    },
    pickFromAccount(account: Account) {
      this.selectedAccount = account
      this.availableTokens = getChainAssetList(account.chain)

      // signer account
      this.updateTaskContext({
        signer_addr: account.address,
      })
    },
    pickTokenInput(coin: Coin) {
      this.funds = coin

      // attached funds
      // TODO: Figure out cw20 setup as well
      this.updateTaskContext({
        funds: [coin],
      })
    },
    setActiveJsonType(value: any) {
      this.activeJsonType = value

      // adjust the code sample based on picked JSON Type
      const i = this.jsonTypeOptions.find(t => t.type === value.type)
      if (i?.defaultCode) this.code = i.defaultCode
    },
    addJsonByType() {
      const t = this.activeJsonType.type
      const task: any = {}

      this[t].push(JSON.parse(this.code))
      task[t] = [...this[t]]

      this.updateTask(task)
    },
    removeJsonByType(idx: number, type: string) {
      const task: any = {}

      this[type].splice(idx, 1)
      task[type] = [...this[type]]

      this.updateTask(task)
    },
    getItemTitle(item, idx) {
      let s = ''

      if (item) s = Object.keys(item)[0]
      if ('msg' in item) s = Object.keys(item.msg)[0]
      if ('kind' in item) {
        s = `${item.kind} ${item.req_idx} ${item.res_idx}`
      }

      return `${s}` // ${idx}
    },
  },

  mounted() {
    // init defaults
    this.code = jsonTypeOptions[0].defaultCode
    this.selectedAccount = this.accounts[0]
    if (!this.selectedAccount || this.accounts.length <= 0) return []
    let acc = this.selectedAccount || this.accounts[0]
    if (!acc) return
    this.availableTokens = getChainAssetList(acc.chain)
    if (this.availableTokens) this.selectedToken = this.availableTokens[0]
  },
};
</script>
