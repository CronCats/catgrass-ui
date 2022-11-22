<template>
  <div>
    <div
      v-for="(network, index) in filteredNetworks"
      :key="index"
      class="relative"
    >
      <div
        :class="{
          'flex z-10 px-2 mb-2 bg-white rounded-lg border-2 cursor-pointer': true,
          'opacity-30': disabled,
        }"
        :style="{ borderColor: network.brandColor }"
      >
        <div
          class="flex-col py-2 mr-2"
          @click="
            () => {
              if (network && network.accounts && network.accounts.length > 0) {
                toggleNetwork(index);
              }
            }
          "
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
          @click="
            () => {
              if (network && network.accounts && network.accounts.length > 0) {
                toggleNetwork(index);
              }
            }
          "
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
            hidden: disabled || (!network || !network.accounts || network.accounts.length < 1),
          }"
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
            hidden: disabled || (!network || !network.accounts || network.accounts.length < 1),
          }"
        >
          <button
            class="py-0 px-5 w-full text-xs tracking-widest text-gray-50 bg-gray-700 hover:bg-gray-900 rounded-full border-0 btn"
            @click="onConnectAccount(network)"
          >
            Connect
          </button>
        </div>
      </div>

      <ul
        :class="{
          'absolute top-12 -right-1 -left-1 z-20 bg-white rounded-lg border-2 border-gray-100 shadow-xl menu': true,
          hidden: disabled,
          visible:
            selectedNetworkIndex === index && selectedNetworkActive === true,
          invisible:
            selectedNetworkIndex !== index || selectedNetworkActive === false,
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
                <small
                  className="overflow-hidden w-1/2 text-xs text-gray-400 lowercase text-ellipsis"
                >
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
                @click="onDisconnectAccount(account)"
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
              @click="onConnectAccount(network)"
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
import type { PropType } from "vue";
// import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "../stores/multiWallet";
import type { ChainMetadata } from "../utils/types";
import Balance from "./core/display/Balance.vue";
import LogoFromImage from "./core/display/LogoFromImage.vue";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/vue/24/outline";

export default {
  setup() {
    const store = useMultiWallet();
    const { networks, accounts, walletManager } = store;

    return {
      networks,
      accounts,
      walletManager,
    }
  },

  props: {
    networks: {
      type: Object as PropType<ChainMetadata[]>,
      required: true,
    },
    onConnectAccount: { type: Function, default: () => {} },
    onDisconnectAccount: { type: Function, default: () => {} },
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
    // ...mapState(useMultiWallet, ['networks', 'accounts', 'walletManager']),
    filteredNetworks() {
      if (!this.networks || this.networks.length === 0) return;
      return this.networks.filter(n => n.supported != this.disabled)
    },
  },

  methods: {
    // ...mapActions(useMultiWallet, ['addAccount', 'removeAccount']),
    toggleNetwork(index: number) {
      this.selectedNetworkActive = !this.selectedNetworkActive;
      this.selectedNetworkIndex = index;
    },
  },

  // async beforeUnmount() {
  //   if (!this.walletManager) return
  //   await this.walletManager.onUnmounted()
  // },

  async mounted() {
    if (!this.walletManager) return
    // const c = config.getConfig('juno')
    // const k = useKeplr(c)
    // await k.connect()
    // console.log('wallets, walletNames', c, k, await k.getAccount());
    console.log('HEfjdkslfjskalf mounted');

    // const { walletManager } = useMultiWallet();
    const walletManager = this.walletManager;
    // let { walletManager } = storeToRefs(store);
    // console.log('HERE', walletManager);

    const {
      onMounted,
      setCurrentWallet,
      setCurrentChain,
      enable,
      connect,
      disconnect,
      isWalletDisconnected,
    } = walletManager;
    
    await onMounted()
    setCurrentWallet(walletManager.walletNames[0])
    setCurrentChain('juno')
    // setCurrentChain('junotestnet')
    enable(['juno-1'])
    // await enable(['uni-5'])
    if (!isWalletDisconnected) {
      await disconnect();
    }
    await enable(['juno-1'])
    await connect()

    const {
      walletNames,
      getWallet,
      currentChainName,
      walletStatus,
      address,
      username,
      data,
    } = walletManager;
    // const st = await getStargateClient()
    // console.log('st', st);
    const w = await getWallet(walletNames[0])
    console.log('ww,',w);
    
    
    
    // await wallet.client.client.enable('uni-5')
    console.log('wallet currentChainName', walletStatus, currentChainName);
    console.log('address, username', address, username);
    console.log('address:: data', data);
    if (address && username) this.addAccount({
      address,
      title: username,
      balance: { amount: '0', denom: 'ujuno' }
    })
  }
};
</script>
