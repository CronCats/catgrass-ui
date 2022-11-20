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
              if (network.accounts.length > 0) {
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
              if (network.accounts.length > 0) {
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
              network.accounts.length > 0
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
            hidden: disabled || network.accounts.length < 1,
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
            hidden: disabled || network.accounts.length > 0,
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
import { ref, defineComponent } from "vue";
import type { PropType } from "vue";
// import { wallets, walletNames, KeplrClient } from '@cosmos-kit/keplr'
import { storeToRefs } from "pinia";
import { useMultiWallet } from "../stores/multiWallet";
import type { ChainMetadata } from "../utils/types";
import config from "../utils/config";
import { useKeplr } from "../utils/keplr";
import Balance from "./Balance.vue";
import LogoFromImage from "./LogoFromImage.vue";
import {
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/vue/24/outline";

export default defineComponent({
  setup() {
    const store = useMultiWallet();
    let { networks, accounts } = storeToRefs(store);
    

    // fake data
    // const account = {
    //   title: 'Main Account 1',
    //   address: 'juno1ab3wjkg7uu4awajw5aunctjdce9q657j0rrdpy',
    //   balance: { amount: '13370000', denom: 'ujuno' },
    // }

    // load the account relevant to the network
    networks = ref(
      networks.value.map((n) => {
        n.accounts = accounts.value.filter(
          (a) => a.chain?.chain?.chain_id === n.chain?.chain_id
        );
        // n.accounts.push(account)

        return n;
      })
    )

    return {
      store,
      networks,
      accounts,
    };
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
    filteredNetworks() {
      return this.networks.filter(n => n.supported != this.disabled)
    },
  },

  methods: {
    toggleNetwork(index: number) {
      this.selectedNetworkActive = !this.selectedNetworkActive;
      this.selectedNetworkIndex = index;
    },
  },

  async mounted() {
    const c = config.getConfig('juno')
    const k = useKeplr(c)
    await k.connect()
    console.log('wallets, walletNames', c, k, await k.getAccount());
  }
});
</script>
