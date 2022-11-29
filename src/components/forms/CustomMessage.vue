<template>
  <div aria-details="custom message fields" class="my-8 w-full min-h-16">
      <Label class="mb-2" name="From Account" />
      <AccountSelector :onChange="accountCallback" :options="accounts" />

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
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import type { Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import type { Account } from '../../utils/types'
import { chainColors } from '../../utils/constants'
import AccountSelector from '../core/inputs/AccountSelector.vue'
import Label from '../core/display/Label.vue'

const extensions: any = [json(), oneDark]

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

const code: string = `
{
  "wasm": {
    "execute": {
      "swap": {
        ...YOUR THINGS HERE
      }
    }
  }
}
`

// // Status is available at all times via Codemirror EditorView
// const getCodemirrorStates = () => {
//   const state = view.value.state
//   const ranges = state.selection.ranges
//   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
//   const cursor = ranges[0].anchor
//   const length = state.doc.length
//   const lines = state.doc.lines
//   // more state info ...
//   // return ...
// }

export default {
  // props: [""],

  components: {
    AccountSelector,
    Label,
    Codemirror,
  },

  data() {
    return {
      code,
      accounts,
      extensions,
      view: null as any,
    }
  },

  computed: {
    fn() {
      // 
    },
  },

  methods: {
    accountCallback(account: Account) {
      console.log('accountCallback', account)
    },
    handleReady(payload: any) {
      this.view.value = payload.view
    },
    log: console.log,
  },
};
</script>
