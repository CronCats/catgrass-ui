<template>
  <div class="relative">
    <div
      class="flex z-10 mb-2 bg-white rounded-lg border-2 cursor-pointer"
      :style="{ borderColor: active.chain?.brandColor }"
    >
      <div
        class="flex-col mr-2 w-full"
        @click="toggleList"
        :style="{ minWidth: '42px' }"
      >
        <Account :account="active" :hideBalance="true" />
      </div>
      <div class="flex my-auto mr-4 w-6">
        <ChevronUpIcon v-if="toggleActive" />
        <ChevronDownIcon v-else />
      </div>
    </div>

    <div
      :class="{
        'absolute top-12 -right-1 -left-1 z-20 flex-col p-1 bg-white rounded-lg border-2 shadow-lg': true,
        visible: toggleActive === true,
        invisible: toggleActive === false,
      }"
    >
      <div
        v-for="item in list"
        :key="item.address"
        class="hover:bg-gray-200 active:bg-gray-200 rounded-lg"
        @click="updateSelect(item)"
      >
        <Account :account="item" :hideBalance="false" />
      </div>
      <div>
        <div class="p-2">
          <button
            class="py-0 px-5 w-full text-xs tracking-widest text-black bg-primary hover:bg-secondary rounded-full border-0 btn"
            @click="connectAccount"
          >
            Connect Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import type { Account as AccountType } from '@/utils/types';
import { getChainData } from '@/utils/helpers';
import { ChevronDownIcon, ChevronUpIcon, } from '@heroicons/vue/24/outline'
import Account from '../display/Account.vue'
import Balance from '../display/Balance.vue'
import LogoFromImage from '../display/LogoFromImage.vue'

export default {
  props: ["options", "onChange"],

  components: {
    ChevronDownIcon,
    ChevronUpIcon,
    Account,
    Balance,
    LogoFromImage,
  },

  data() {
    return {
      toggleActive: false,
      state: this.options[0],
    }
  },

  computed: {
    list(): any {
      return this.options.map((a: AccountType) => {
        const data = this.getChainMetadataForAccount(a)

        return {
          ...a,
          ...data,
        }
      })
    },
    active(): any {
      const data = this.getChainMetadataForAccount(this.state)

      return {
        ...this.state,
        ...data,
      }
    },
  },

  methods: {
    ...mapActions(useMultiWallet, ['openWalletPicker', 'getChainMetadataForAccount']),
    toggleList() {
      this.toggleActive = !this.toggleActive
    },
    updateSelect(item: any) {
      this.state = item
      this.onChange(item)
      this.toggleList()
    },
    connectAccount(network: ChainMetadata) {
      // TODO: Add the supported networks within the list, and link to "manage ALL accounts"
      // TODO: Indicator for active/current account if possible
      // if (!network || !network.chain?.chain_id) return;
      // this.openWalletPicker();
      this.toggleList()
      console.log('TODO: hook up useWallet', network);
    },
  },
};
</script>
