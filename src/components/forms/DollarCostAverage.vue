<template>
  <div aria-details="dca fields" class="my-8">
    <Label class="mb-2" name="Sender Account" />
    <AccountSelector :onChange="pickFromAccount" :options="accounts" />

    <br />

    <Label class="mb-2" name="Swap amount each time" />
    <TokenInputSelector :onChange="pickTokenInput" :options="availableTokens" />

    <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />

    <Label class="mb-2" name="Receiver Account" />
    <AccountSelector :onChange="pickToAccount" :options="accounts" />

    <br />

    <Label class="mb-2" name="To Token" />
    <TokenSelector :onChange="pickTokenOutput" :options="availableTokens" />
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { getChainAssetList } from '@/utils/helpers'
import Label from '../core/display/Label.vue'
import AccountSelector from '../core/inputs/AccountSelector.vue'
import TokenSelector from '../core/inputs/TokenSelector.vue'
import TokenInputSelector from '../core/inputs/TokenInputSelector.vue'
import NumberInput from '../core/inputs/NumberInput.vue'


export default {
  components: {
    Label,
    AccountSelector,
    TokenSelector,
    TokenInputSelector,
    NumberInput,
  },

  data() {
    return {
      availableTokens: [] as Asset[],
      swap_amount: { amount: 0, denom: '' } as Coin,
      fromAccount: null,
      toAccount: null,
      fromToken: null,
      toToken: null,
      errors: {},
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    pickFromAccount(account: Account) {
      this.fromAccount = account
      this.availableTokens = getChainAssetList(account.chain)
    },
    pickToAccount(account: Account) {
      this.toAccount = account
    },
    pickTokenInput(coin: Coin) {
      this.fromToken = coin
    },
    pickTokenOutput(coin: Coin) {
      this.toToken = coin
    },
  },

  mounted() {
    // init defaults
    this.fromAccount = this.accounts[0]
    this.toAccount = this.accounts[0]
    if (!this.fromAccount || this.accounts.length <= 0) return []
    let acc = this.fromAccount || this.accounts[0]
    if (!acc) return
    this.availableTokens = getChainAssetList(acc.chain)
    if (this.availableTokens) this.fromToken = this.availableTokens[0]
  },
};
</script>
