<template>
  <div class="my-8">
    <h3 class="mb-2 text-xl">Sign Transactions</h3>
  
    <div class="my-12">
      <div v-for="item in chainItems" :key="item.chain.chain_id">
        <div class="flex justify-between p-2 w-full cursor-pointer">
          <div class="flex my-auto w-full">
            <div class="flex-col py-2 mr-2" :style="{ minWidth: '40px' }">
              <LogoFromImage class="block mr-4" :rounded="true" size="40" :src="item.asset?.logo_URIs?.png || ''" />
            </div>
            <div class="flex-col py-2 m-auto w-full">
              <h3 class="text-lg font-bold leading-4">{{item.chain?.pretty_name}}</h3>
              <small class="text-xs text-gray-400 lowercase">
                {{item.chain?.chain_id}}
              </small>
            </div>
            <div class="flex-col py-2 m-auto w-auto">
              <Button class="min-w-[110px] bg-green-600 hover:bg-green-800" @click="onComplete">
                <span>Sign</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
  
    <InputLabel class="mb-2" name="Note:" />
    <small class="text-gray-400">You will be signing transactions per-network. Depending on how many actions you have, there will more multiple times required to sign. Failure to sign all items could result in a bad state, please proceed carefully!</small>
  
    <br />
  </div>
</template>

<script lang="ts">
import type { Chain } from '@chain-registry/types'
import { assets, chains } from 'chain-registry'
import { chainColors } from '@/utils/constants'
import Label from '../core/display/Label.vue'
import Balance from '../core/display/Balance.vue'
import LogoFromImage from '../core/display/LogoFromImage.vue'

const getChainData = (chain: Chain) => {
  const assetList = assets.find(
    ({ chain_name }) => chain_name === chain.chain_name
  )
  const asset = assetList?.assets[0]
  return {
    chain,
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

export default {
  props: ["onComplete"],

  components: {
    Label,
    Balance,
    LogoFromImage,
  },

  data() {
    return {
      chainItems: [supportedChains[0]],
    }
  },

  computed: {
    fn() {
      // 
    },
  },

  methods: {
    fn() {
      // 
    },
  },
};
</script>
