<template>
  <div>
    <div
      v-for="(network, index) in filteredNetworks"
      :key="index"
      class="relative"
    >
      <div
        :class="{
          'flex z-10 px-2 mb-2 bg-white rounded-lg border-2': true,
          'opacity-30': disabled,
          'cursor-pointer': !disabled,
        }"
        :style="{ borderColor: network.brandColor }"
      >
        <div
          class="flex-col py-2 mr-2"
          @click="toggleNetwork(index)"
          :style="{ minWidth: '42px' }"
        >
          <LogoFromImage
            class="block"
            :rounded="true"
            size="42"
            :src="network.asset?.logo_URIs?.png || ''"
          />
        </div>
        <div
          class="flex-col py-2 m-auto w-full"
          @click="toggleNetwork(index)"
        >
          <h3 class="text-lg font-bold leading-4">
            {{ network.chain.pretty_name }}
          </h3>
          <small class="text-xs text-gray-400 lowercase">
            {{ network.chain.chain_id }}{{
              network && network.accounts &&network.accounts.length > 0
                ? `, ${network.accounts.length} account${
                    network.accounts.length > 1 ? "s" : ""
                  }`
                : ""
            }}
          </small>
        </div>
        <div
          :class="{
            'flex my-auto w-6': true,
            hidden: disabled || !network.accounts || network.accounts.length === 0,
          }"
          @click="toggleNetwork(index)"
        >
          <ChevronUpIcon
            v-if="
              selectedNetworkIndex === index && selectedNetworkActive === true
            "
          />
          <ChevronDownIcon v-else />
        </div>
        <div
          :class="{
            'flex my-auto': true,
            hidden: !(disabled == false && network.accounts.length === 0),
          }"
        >
          <button
            class="py-0 px-5 w-full text-xs tracking-widest text-gray-50 bg-gray-700 hover:bg-gray-900 rounded-full border-0 btn"
            @click="connectAccount(network)"
          >
            Connect
          </button>
        </div>
      </div>

      <ul
        :class="{
          'absolute top-12 -right-1 -left-1 z-20 bg-white rounded-lg border-2 border-gray-100 shadow-xl menu': true,
          hidden: disabled,
          visible: selectedNetworkIndex === index && selectedNetworkActive === true,
          invisible: selectedNetworkIndex !== index || selectedNetworkActive === false,
        }"
      >
        <li v-for="account in network.accounts" :key="account.address">
          <div
            className="flex justify-between w-full active:text-gray-800 hover:bg-transparent focus:bg-transparent active:bg-gray-300 active:bg-transparent cursor-default"
          >
            <div className="flex-col my-auto w-10/12">
              <h3 className="text-lg leading-4">{{ account.title }}</h3>
              <div className="flex w-full">
                <!-- <small className="text-xs text-gray-400 lowercase">{address.substring(0,20)}...</small> -->
                <small className="overflow-hidden w-1/2 text-xs text-gray-400 lowercase text-ellipsis">
                  {{ account.address }}
                </small>
                <small
                  className="ml-auto w-1/2 text-xs text-right text-gray-400 uppercase"
                >
                  <Balance
                    :amount="account.balance.amount"
                    :denom="account.balance.denom"
                    :decimals="6"
                  />
                </small>
              </div>
            </div>
            <div class="w-1/12">
              <div
                className="px-2 text-right cursor-pointer opacity-40 hover:opacity-80"
                @click="disconnectAccount(account)"
                title="Logout"
                >
                <ArrowRightOnRectangleIcon className="inline mr-0 w-5 h-5 text-gray-400 hover:text-gray-700" />
              </div>
            </div>
          </div>
        </li>
        <li>
          <div class="p-2">
            <button
              class="py-0 px-5 w-full text-xs tracking-widest text-black bg-primary hover:bg-secondary rounded-full border-0 btn"
              @click="connectAccount(network)"
            >
              Connect Account
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet, appendAccountsToNetworks } from "../stores/multiWallet";
import type { Account, ChainMetadata } from "../utils/types";
import Balance from "./core/display/Balance.vue";
import LogoFromImage from "./core/display/LogoFromImage.vue";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/vue/24/outline";

export default {
  props: {
    disabled: { type: Boolean, required: false },
  },

  components: {
    Balance,
    LogoFromImage,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
  },

  data() {
    return {
      selectedNetworkActive: false,
      selectedNetworkIndex: 0,
    };
  },

  computed: {
    ...mapState(useMultiWallet, ['networks', 'accounts', 'walletManager']),
    filteredNetworks() {
      if (!this.networks || this.networks.length === 0) return;
      return appendAccountsToNetworks(
        this.networks.filter(n => n.supported != this.disabled),
        this.accounts
      )
    },
  },

  methods: {
    ...mapActions(useMultiWallet, ['removeAccount', 'openWalletPicker']),
    toggleNetwork(index: number) {
      this.selectedNetworkActive = !this.selectedNetworkActive;
      this.selectedNetworkIndex = index;
    },
    disconnectAccount(account: Account) {
      if (!account || !account.address) return;
      this.removeAccount(account.address)
      this.toggleNetwork(this.selectedNetworkIndex)
    },
    connectAccount(network: ChainMetadata) {
      if (!network || !network.chain?.chain_id) return;
      this.openWalletPicker(network.chain.chain_id);
    },
  },
};
</script>
