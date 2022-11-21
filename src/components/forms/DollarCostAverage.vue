<template>
  <div aria-details="dca fields" class="my-8">
    <Label class="mb-2" name="From Account" />
    <AccountSelector :onChange="onChange" :options="accounts" />

    <br />

    <Label class="mb-2" name="From Token" />
    <TokenSelector :onChange="onChange" :options="tokenOptions" />

    <br />

    <Label class="mb-2" name="Amount to swap each time" />
    <NumberInput
      :defaultValue="1"
      :error="errors?.amount_to_swap_each"
      :name="fieldNamePrefix + 'amount_to_swap_each'"
      :onMinus="() => {
        return setValue(
          fieldNamePrefix + 'amount_to_swap_each',
          Math.max(
            Number(spendEachAmount) - 1,
            1 / 10 ** amountDecimals
          ).toString()
        )
      }"
      :onPlus="() => {
        return setValue(
          fieldNamePrefix + 'amount_to_swap_each',
          Math.max(
            Number(spendEachAmount) + 1,
            1 / 10 ** amountDecimals
          ).toString()
        )
      }"
      sizing="full"
    />

    <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />

    <Label class="mb-2" name="To Account" />
    <AccountSelector :onChange="onChange" :options="accounts" />

    <br />

    <Label class="mb-2" name="To Token" />
    <TokenSelector :onChange="onChange" :options="tokenOptions" />
  </div>
</template>

<script lang="ts">
import type { Asset, Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import Label from '../core/display/Label.vue'
import AccountSelector from '../core/inputs/AccountSelector.vue'
import TokenSelector from '../core/inputs/TokenSelector.vue'
import NumberInput from '../core/inputs/NumberInput.vue'

import { chainColors } from '../../utils/constants'
const getChainData = (chain: Chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    ...chain,
    asset,
    brandColor: chainColors[chain.chain_id],
  }
}

const unsupportedChainIds = ['cosmoshub-4']
const supportedChainIds = Object.keys(chainColors).filter(
  (id) => !unsupportedChainIds.includes(id)
)
const supportedChains = chains
  .filter((c) => supportedChainIds.includes(c.chain_id))
  .map(getChainData)

const accounts = [
  {
    key: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    value: {
      title: 'Dev Main Account',
      address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '13370000', denom: 'ujuno' },
      chain: supportedChains.find(({ chain_name }) => chain_name === 'juno'),
    },
  },
  {
    key: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    value: {
      title: 'Main Account 1',
      address: 'osmo1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
      balance: { amount: '420690000', denom: 'uosmo' },
      chain: supportedChains.find(
        ({ chain_name }) => chain_name === 'osmosis'
      ),
    },
  },
]

const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
const tokens = assetList?.assets || []
const tokenOptions = tokens.map((token) => ({
  key: token.symbol,
  value: token,
}))

// const fieldNamePrefix = ''
// const spendTotalAmount = watch(fieldNamePrefix + 'amount_total')
// const spendTotalDenom = watch(fieldNamePrefix + 'amount_total_denom')
// const spendEachAmount = watch(fieldNamePrefix + 'amount_to_swap_each')
// const spendEachDenom = watch(fieldNamePrefix + 'amount_to_swap_each_denom')
// const [selectedToken, setSelectedToken] = useState(tokens[0])

// const tokenCallback = (token: Asset) => {
//   console.log('tokenCallback', token)
//   setSelectedToken(token)
// }

// const amountDecimals = useMemo(
//   () => NATIVE_DECIMALS,
//   [spendTotalDenom, selectedToken]
// )

export default {
  // props: [""],

  components: {
    Label,
    AccountSelector,
    TokenSelector,
    NumberInput,
  },

  data() {
    return {
      accounts,
      tokenOptions,
    }
  },

  computed: {
    fn() {
      // 
    },
  },

  methods: {
    onChange() {
      console.log('onChange')
    },
  },
};
</script>
