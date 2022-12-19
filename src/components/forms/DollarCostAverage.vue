<template>
  <div aria-details="dca fields" class="my-8">
    <Label class="mb-2" name="Sender Account" />
    <AccountSelector :onChange="pickFromAccount" :options="accounts" />

    <div v-if="!currentNetworkIsSupported" class="bg-orange-400 rounded-lg mt-6 p-4">
      <p>Current sender account is not supported for dollar cost averaging.</p>
      <p>Please sign into your Juno wallet to continue</p>
    </div>

    <div v-if="currentNetworkIsSupported">
      <br />
      
      <Label class="mb-2" name="Swap amount each time" />
      <TokenInputSelector :onChange="pickTokenInput" :options="availableFromTokens" />
      <Subtext v-if="errors.fromTokenAmount" class="text-red-500" text="Invalid token amount" />
      
      <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
      
      <Label class="mb-2" name="Receiver Account" />
      <AccountSelector :onChange="pickToAccount" :options="accounts" />
      <Subtext v-if="errors.toAccountNetwork" class="text-red-500" text="Mismatching account network, must match sender network" />
      
      <br />
      
      <Label class="mb-2" name="To Token" />
      <TokenSelector :onChange="pickTokenOutput" :options="availableToTokens" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import { junoswap, junoswapPools } from '@/utils/junoswap'
import Label from '@/components/core/display/Label.vue'
import Subtext from '@/components/core/display/Subtext.vue'
import AccountSelector from '@/components/core/inputs/AccountSelector.vue'
import TokenSelector from '@/components/core/inputs/TokenSelector.vue'
import TokenInputSelector from '@/components/core/inputs/TokenInputSelector.vue'
import NumberInput from '@/components/core/inputs/NumberInput.vue'

// TODO: 
// OSMOSIS Setup


// TODO: Change to work based on all accounts (and their chain)
const isSupportedDexChain = (chain: Chain) => {
  const chainName = chain?.chain_name
  if (!chainName) return false
  let supported = false

  // TODO: add more once built
  if (junoswapPools[chainName]) supported = true

  return supported
}

const getTokensByChain = (chain: Chain) => {
  const chainName = chain?.chain_name
  if (!chainName) return []
  if (junoswapPools[chainName]) return junoswap.formatToAsset(junoswapPools[chainName])
}

const filterPoolPairTokensByChain = (chain: Chain, fromToken: any) => {
  const chainName = chain?.chain_name
  if (!chainName) return []
  if (junoswapPools[chainName]) return junoswap.filterAssetsToPoolPairTokens(junoswapPools[chainName], fromToken)
}

const getQueriesByChain = (chain: Chain, ctx: any) => {
  const chainName = chain?.chain_name
  if (!chainName) return []
  if (junoswapPools[chainName]) return junoswap.getQueries(junoswapPools[chainName], ctx)
}

const getTransformsByChain = (chain: Chain, ctx: any) => {
  const chainName = chain?.chain_name
  if (!chainName) return []
  if (junoswapPools[chainName]) return junoswap.getTransforms(junoswapPools[chainName], ctx)
}

const getActionsByChain = (chain: Chain, ctx: any) => {
  const chainName = chain?.chain_name
  if (!chainName) return []
  if (junoswapPools[chainName]) return junoswap.getActions(junoswapPools[chainName], ctx)
}

export default {
  components: {
    Label,
    Subtext,
    AccountSelector,
    TokenSelector,
    TokenInputSelector,
    NumberInput,
  },

  data() {
    return {
      availableFromTokens: [] as Asset[],
      availableToTokens: [] as Asset[],
      fromAccount: null,
      toAccount: null,
      fromToken: null,
      toToken: null,
      errors: {
        fromTokenAmount: false,
        toAccountNetwork: false,
      },
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
    currentNetworkIsSupported() {
      if (!this.fromAccount || !this.fromAccount.chain) return false
      const chain = this.fromAccount.chain
      if (!chain || !chain.chain_name) return false
      return isSupportedDexChain(chain)
    },
  },

  methods: {
    ...mapActions(useTaskCreator, ['updateTask', 'updateTaskContext']),
    setAvailableFromTokens() {
      this.availableFromTokens = getTokensByChain(this.fromAccount.chain)
      if (this.availableFromTokens) this.fromToken = this.availableFromTokens[0]
      this.setAvailableToTokens()
    },
    setAvailableToTokens() {
      if (!this.fromToken) return;
      const listOfToTokens = filterPoolPairTokensByChain(this.fromAccount.chain, this.fromToken)
      this.availableToTokens = listOfToTokens
      if (!this.toToken || !this.toToken.symbol) {
        this.toToken = listOfToTokens[0]
        return
      }
      const hasToToken = listOfToTokens.filter(p => p.symbol === this.toToken.symbol).length > 0      
      if (!hasToToken) this.toToken = listOfToTokens[0]
    },
    pickFromAccount(account: Account) {
      this.fromAccount = account

      // signer account
      this.updateTaskContext({ signer_addr: account.address })

      // If choosing a network that isn't supported, show notice!
      if (this.currentNetworkIsSupported) this.setAvailableFromTokens()
    },
    pickToAccount(account: Account) {
      this.toAccount = account
      this.updateTaskData()
    },
    pickTokenInput(coin: Coin) {
      this.fromToken = coin
      this.setAvailableToTokens()
      this.updateTaskData()
    },
    pickTokenOutput(coin: Coin) {
      this.toToken = coin
      this.updateTaskData()
    },
    hasErrors(ctx: any) {
      // Check all info is ready, or ERROR
      if (!ctx.fromToken || !ctx.fromToken.amount || ctx.fromToken.amount <= 0) this.errors.fromTokenAmount = true
      else this.errors.fromTokenAmount = false

      // Make sure the same network for to Account
      if (ctx.fromAccount.chain.chain_name !== ctx.toAccount.chain.chain_name) this.errors.toAccountNetwork = true
      else this.errors.toAccountNetwork = false

      // Update context for other listeners
      this.updateTaskContext({ errors: this.errors })

      return this.errors.fromTokenAmount === true || this.errors.toAccountNetwork === true
    },
    updateTaskData() {
      const chain = this.fromAccount.chain
      const context: any = {
        fromAccount: this.fromAccount,
        fromToken: this.fromToken,
        toAccount: this.toAccount,
        toToken: this.toToken,
      }

      if (this.hasErrors(context)) return;
      let queries: any[] = getQueriesByChain(chain, context)
      let transforms: any[] = getTransformsByChain(chain, context)
      let actions: any[] = getActionsByChain(chain, context)

      // Update the task data
      this.updateTask({ queries, transforms, actions })

      // Load context with the token amount needed for FUNDS
      this.updateTaskContext({ attachedFunds: [this.fromToken] })
    },
  },

  mounted() {
    // init defaults
    if (this.accounts.length <= 0) return

    // Check for first supported network account!!!
    this.accounts.forEach((a: any) => {
      if (!this.fromAccount && isSupportedDexChain(a.chain)) {
        this.fromAccount = a
        this.toAccount = a
      }
    })
    
    if (!this.fromAccount) return
    console.log('this.fromAccount', this.fromAccount.address);
    
    this.setAvailableFromTokens(this.fromAccount)
    // TODO: Figure out why this is!?
    setTimeout(() => {
      this.updateTaskContext({ signer_addr: this.fromAccount.address })
    }, 10)
  },
};
</script>
