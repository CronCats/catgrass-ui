<template>
  <div aria-details="custom message fields" class="my-8 w-full min-h-16">
      <Label class="mb-2" name="Sender Account" />
      <AccountSelector :onChange="pickFromAccount" :options="accounts" />

      <!-- <br /> -->
      <Label v-if="availableTokens.length > 0" class="mb-2" name="Funds" />
      <TokenInputSelector :onChange="pickTokenInput" :options="availableTokens" />

      <br />
      <Label class="mb-2" name="Custom JSON Message" />
      <div class="relative">
        <Codemirror
          v-model="code"
          placeholder="Code goes here..."
          :style="{ height: '350px' }"
          :autofocus="true"
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="extensions"
          @ready="handleReady"
          @change="log('change', $event)"
        />
      </div>
      <!-- 
        @focus="log('focus', $event)"
        @blur="log('blur', $event)" -->
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
import AccountSelector from '../core/inputs/AccountSelector.vue'
import TokenInputSelector from '../core/inputs/TokenInputSelector.vue'
import Label from '../core/display/Label.vue'

const extensions: any = [json(), oneDark]

const code: string = `
{
  "method_name": {
    "example": "YOUR THINGS HERE"
  }
}
`

export default {
  components: {
    AccountSelector,
    TokenInputSelector,
    Label,
    Codemirror,
  },

  data() {
    return {
      code,
      extensions,
      view: null as any,
      selectedAccount: null,
      selectedToken: null,
      funds: { amount: 0, denom: '' } as Coin,
      availableTokens: [] as Asset[],
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
  },

  mounted() {
    // init defaults
    this.selectedAccount = this.accounts[0]
    if (!this.selectedAccount || this.accounts.length <= 0) return []
    let acc = this.selectedAccount || this.accounts[0]
    if (!acc) return
    this.availableTokens = getChainAssetList(acc.chain)
    if (this.availableTokens) this.selectedToken = this.availableTokens[0]
  },
};
</script>
