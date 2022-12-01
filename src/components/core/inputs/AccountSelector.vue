<template>
  <div class="relative">
    <div
      v-if="state && state.chain"
      class="flex z-10 mb-2 bg-white rounded-lg border-2 cursor-pointer"
      :style="{ borderColor: state.chain?.brandColor }"
    >
      <div
        class="flex-col mr-2 w-full"
        @click="toggleList"
        :style="{ minWidth: '42px' }"
      >
        <Account :account="state" :hideBalance="true" />
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
        v-for="item in options"
        :key="item.address"
        class="hover:bg-gray-200 active:bg-gray-200 rounded-lg"
        @click="updateSelect(item)"
      >
        <Account :account="item" :hideBalance="false" />
      </div>

      <hr v-if="availableNetworks.length > 0" class="my-2 mx-auto w-full border-1 border-gray-100" />

      <div v-for="(network, index) in availableNetworks" :key="index" class="relative">
        <div class="flex z-10 px-2">
          <div class="flex-col py-2 mr-2" :style="{ minWidth: '42px' }">
            <LogoFromImage
              class="block"
              :rounded="true"
              size="42"
              :src="network.asset?.logo_URIs?.png || ''"
            />
          </div>
          <div class="flex-col py-2 m-auto w-full">
            <h3 class="text-lg font-bold leading-4">
              {{ network.chain.pretty_name }}
            </h3>
          </div>
          <div class="flex my-auto">
            <button
              class="py-0 px-5 w-full text-xs tracking-widest text-gray-50 bg-gray-700 hover:bg-gray-900 rounded-full border-0 btn"
              @click="connectAccount(network)"
            >
              Connect
            </button>
          </div>
        </div>
      </div>

      <div>
        <div class="p-2">
          <RouterLink
            class="py-0 px-5 w-full text-xs tracking-widest text-black bg-primary hover:bg-secondary rounded-full border-0 btn"
            to="/profile/accounts"
          >
            Manage All Accounts
          </RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
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
    ...mapState(useMultiWallet, ['networks', 'accounts']),
    availableNetworks() {
      // look through the accounts & supported networks, and show which could get added
      const activeChainNames = this.accounts.map(a => a.chain.chain_name)
      return this.networks.filter(n => !activeChainNames.includes(n.chain.chain_name)) || []
    },
  },

  methods: {
    ...mapActions(useMultiWallet, ['openWalletPicker']),
    toggleList() {
      this.toggleActive = !this.toggleActive
    },
    updateSelect(item: any) {
      this.state = item
      this.onChange(item)
      this.toggleList()
    },
    connectAccount(network: ChainMetadata) {
      // Add the supported networks within the list, and link to "manage ALL accounts"
      if (!network || !network.chain?.chain_id) return;
      this.openWalletPicker(network.chain?.chain_id);
      this.toggleList()
    },
  },
};
</script>
