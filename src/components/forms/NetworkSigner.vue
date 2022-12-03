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
              <Button class="min-w-[110px] bg-green-600 hover:bg-green-800" @click="exec">
                <span>Sign</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <hr class="my-8 mx-auto w-1/2 border-2 border-gray-100" />
  
    <InputLabel class="mb-2" name="Note" />
    <small class="text-gray-400">You will be signing transactions per-network. Depending on how many actions you have, there will more multiple times required to sign. Failure to sign all items could result in a bad state, please proceed carefully!</small>
  
    <br />
  </div>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import Label from '../core/display/Label.vue'
import Balance from '../core/display/Balance.vue'
import Button from "../core/buttons/Button.vue";
import LogoFromImage from '../core/display/LogoFromImage.vue'

export default {
  props: ["onComplete"],

  components: {
    Label,
    Balance,
    Button,
    LogoFromImage,
  },

  data() {
    return {
      chainItems: [],
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['networks']),
    ...mapState(useTaskCreator, ['task', 'context']),
  },

  methods: {
    exec() {
      console.log(this.task, this.context)
      if (this.onComplete) this.onComplete()
    },
  },

  mounted() {
    // init defaults
    console.log('this.networks', this.networks);
    this.chainItems = [this.networks[0]]
  },
};
</script>
