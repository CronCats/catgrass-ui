<template>
  <div aria-details="custom message fields" class="my-8 w-full min-h-16">
      <Label class="mb-2" name="Sender Account" />
      <AccountSelector :onChange="pickFromAccount" :options="accounts" />

      <br />
      <Label v-if="availableTokens.length > 0" class="mb-2" name="Funds" />
      <TokenInputSelector :onChange="pickTokenInput" :options="availableTokens" />

      <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />

      <h3 class="mb-2 text-xl">Queries ({{queries.length}})</h3>
      <!-- TODO: Display + remove ability -->

      <h3 class="mb-2 text-xl">Transforms ({{transforms.length}})</h3>
      <!-- TODO: Display + remove ability -->

      <h3 class="mb-2 text-xl">Actions ({{actions.length}})</h3>
      <!-- TODO: Display + remove ability -->

      <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
      
      <div class="p-2 pb-0 -mx-2 mt-4 bg-gray-100 rounded-lg md:p-4 md:pb-0 md:-mx-4">
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
            @change="log('change', $event)"
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
import { mapState } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import type { Account } from '@/utils/types'
import { getChainAssetList } from '@/utils/helpers'
import AccountSelector from '@/components/core/inputs/AccountSelector.vue'
import TokenInputSelector from '@/components/core/inputs/TokenInputSelector.vue'
import SelectList from '@/components/core/inputs/SelectList.vue'
import Label from '@/components/core/display/Label.vue'
import Button from '@/components/core/buttons/Button.vue'
import {
  ArrowsRightLeftIcon,
  BarsArrowDownIcon,
  DocumentCheckIcon,
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
    Button,
    Label,
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
      queries: [],
      transforms: [],
      actions: [],
      activeJsonType: jsonTypeOptions[0],
      jsonTypeOptions,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
  },

  methods: {
    pickFromAccount(account: Account) {
      this.selectedAccount = account
      this.availableTokens = getChainAssetList(account.chain)
    },
    pickTokenInput(coin: Coin) {
      this.funds = coin
    },
    handleReady(payload: any) {
      // this.view.value = payload.view
    },
    log: console.log,
    setActiveJsonType(value: any) {
      this.activeJsonType = value

      // adjust the code sample based on picked JSON Type
      const i = this.jsonTypeOptions.find(t => t.type === value.type)
      if (i?.defaultCode) this.code = i.defaultCode
    },
    addJsonByType() {
      const t = this.activeJsonType.type

      this[t].push(this.code)
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
