<template>
  <TransitionRoot appear :show="walletPickerOpen" as="template">
    <Dialog as="div" @close="close" class="relative z-40">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-700 bg-opacity-80" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            key="0"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" >
              <div>
                <DialogTitle as="div" class="flex text-lg font-medium leading-6 text-gray-900">
                  <div v-if="view != viewStatus.pick && view != viewStatus.connected" @click="backWalletPicker" class="mr-auto p-3 opacity-50 hover:opacity-100 cursor-pointer">
                    <ChevronLeftIcon class="w-6 m-auto" />
                  </div>
                  <span v-if="view == viewStatus.pick" class="py-3">
                    Available wallets:
                  </span>
                  <span v-if="view == viewStatus.connecting" class="py-3">
                    Connecting...
                  </span>
                  <span v-if="view == viewStatus.connected" class="py-3">
                    Account Connected!
                  </span>
                  <span v-if="view == viewStatus.errored" class="py-3">
                    Request Rejected
                  </span>
                  <div @click="close" class="ml-auto p-3 opacity-50 hover:opacity-100 cursor-pointer">
                    <XMarkIcon class="w-6 m-auto" />
                  </div>
                </DialogTitle>

                <div v-if="view == viewStatus.pick" class="mt-2">
                
                  <div v-for="(wallet, index) in availableWallets" :key="index">
                    <div @click="selectWallet(wallet)"
                      class="flex w-full bg-gray-50 hover:bg-gray-200 cursor-pointer p-2 my-1 rounded-lg">
                      <div class="flex-col" :style="{ minWidth: '42px' }">
                        <LogoFromImage class="block mr-4" :size="42" :src="wallet.logo || ''" />
                      </div>
                      <div class="flex-col m-auto w-full px-2">
                        <h3 class="text-lg font-bold leading-4 pb-1">{{ wallet.prettyName }}</h3>
                        <div class="flex flex-col justify-between w-10/12 md:flex-row md:w-full">
                          <small class="inline overflow-hidden mr-auto w-full text-xs text-gray-400 text-ellipsis md:block md:w-1/2 md:h-auto h-10/12">
                            {{ wallet.mobileDisabled == false ? 'Mobile Wallet' : 'Browser Extension'}}
                          </small>
                        </div>
                      </div>
                      <div class="flex">
                        <ChevronRightIcon class="w-5 h-5 m-auto opacity-50" />
                      </div>
                    </div>
                  </div>

                  <Label class="mt-8 mb-2" name="More Wallet Options:" />

                  <div v-for="(wallet, index) in installWallets" :key="index">
                    <a :href="walletDownloadLink(wallet)" target="_blank"
                      class="flex w-full bg-gray-50 hover:bg-gray-200 cursor-pointer p-2 my-1 rounded-lg">
                      <div class="flex-col" :style="{ minWidth: '42px' }">
                        <LogoFromImage class="block mr-4" :size="42" :src="wallet.logo || ''" />
                      </div>
                      <div class="flex-col m-auto w-full px-2">
                        <h3 class="text-lg font-bold leading-4 pb-1">{{ wallet.prettyName }}</h3>
                        <div class="flex flex-col justify-between w-10/12 md:flex-row md:w-full">
                          <small class="inline overflow-hidden mr-auto w-full text-xs text-gray-400 text-ellipsis md:block md:w-1/2 md:h-auto h-10/12">
                            {{ wallet.mobileDisabled == false ? 'Mobile Wallet' : 'Browser Extension'}}
                          </small>
                        </div>
                      </div>
                      <div class="flex">
                        <ArrowTopRightOnSquareIcon class="w-5 h-5 m-auto mr-2 opacity-50" />
                      </div>
                    </a>
                  </div>
                
                </div>

                <div v-if="view == viewStatus.connecting" class="mt-2">
                
                  <div class="flex w-full bg-gray-50 p-2 my-1 rounded-lg">
                    <div class="flex-col" :style="{ minWidth: '42px' }">
                      <LogoFromImage class="block mr-4" :size="42" :src="activeWallet.logo || ''" />
                    </div>
                    <div class="flex-col m-auto w-full px-2">
                      <h3 class="text-lg font-bold leading-4 pb-1">{{ activeWallet.prettyName }}</h3>
                      <div class="flex flex-col justify-between w-10/12 md:flex-row md:w-full">
                        <small class="inline overflow-hidden mr-auto w-full text-xs text-gray-400 text-ellipsis md:block md:w-1/2 md:h-auto h-10/12">
                          {{ activeWallet.mobileDisabled == false ? 'Mobile Wallet' : 'Browser Extension'}}
                        </small>
                      </div>
                    </div>
                    <div class="flex">
                      <Loader className="w-16 m-auto" size="36" />
                    </div>
                  </div>
                
                  <div class="flex-col m-auto mt-8 w-full">
                    <h3 class="text-lg font-bold leading-4 pb-4">Requesting Connection</h3>
                    <p class="flex flex-col justify-between w-10/12 md:flex-row md:w-full pb-4">
                      Please open & review the {{activeWallet.prettyName}} information to connect your wallet.
                    </p>
                  </div>
                
                </div>

                <div v-if="view == viewStatus.connected" class="mt-2">
                
                  <div class="w-full bg-gray-50 p-2 my-1 rounded-lg">
                    <Account :account="activeAccount" />
                  </div>
                
                </div>

                <div v-if="view == viewStatus.errored" class="mt-2">
                
                  <div class="flex-col m-auto mt-8 w-full">
                    <h3 class="text-lg font-bold leading-4 pb-4">Request Denied</h3>
                    <p class="flex flex-col justify-between w-10/12 md:flex-row md:w-full pb-4">
                      Please check your {{activeWallet.prettyName}} information, then try again or close this dialog.
                    </p>
                  </div>
                
                </div>

              </div>

              <!-- TODO: Connected (plus active network account), Rejected, mobile filtered data -->
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "../../stores/multiWallet";
import LogoFromImage from '@/components/core/display/LogoFromImage.vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import {
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import Account from "../core/display/Account.vue";
import Loader from "../Loader.vue";
import Label from "../core/display/Label.vue";

export const viewStatus = {
  pick: 0,
  connecting: 1,
  connected: 2,
  errored: 3,
}

export default {

  components: {
    Account,
    ArrowTopRightOnSquareIcon,
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
    LogoFromImage,
    ChevronRightIcon,
    ChevronLeftIcon,
    XMarkIcon,
    Loader,
    Label,
  },

  data() {
    return {
      activeWallet: null,
      activeAccount: {},
      status: null,
      view: 0,
      viewStatus,
    }
  },

  computed: {
    ...mapState(useMultiWallet, [
      'walletManager',
      'walletPickerOpen',
      'walletPickerState',
      'walletPickerStatus',
      'currentWallet',
    ]),
    availableWallets() {
      if (!this.walletManager) return []
      // TODO: Filter if IS MOBILE!
      return this.walletManager.wallets.filter(w => w.isWalletNotExist == false)
        .filter(w => w.walletInfo.mobileDisabled == true) // TODO: Add support for this!
        .map(w => (w.walletInfo)) || []
    },
    installWallets() {
      if (!this.walletManager) return []
      // TODO: Filter if IS MOBILE!
      return this.walletManager.wallets.filter(w => w.isWalletNotExist == true)
        .filter(w => w.walletInfo.mobileDisabled == true) // TODO: Add support for this!
        .map(w => ({
          ...w.walletInfo,
          ...w.downloadInfo,
        })) || []
    },
  },

  methods: {
    ...mapActions(useMultiWallet, [
      'openWalletPicker',
      'closeWalletPicker',
      'connectChainAccount',
      'getChainMetadataForAccount',
    ]),
    close() {
      this.status = null;
      this.activeWallet = null;
      this.activeAccount = {};
      this.closeWalletPicker()
      setTimeout(() => {
        this.view = this.viewStatus.pick;
      }, 1200)
    },
    backWalletPicker() {
      this.view = this.viewStatus.pick;
    },
    async selectWallet(wallet: any) {
      this.activeWallet = wallet;
      this.view = this.viewStatus.connecting;
      let newAccount = await this.connectChainAccount(wallet.name)
      if (newAccount) newAccount = { ...newAccount, ...this.getChainMetadataForAccount(newAccount) }      
      this.activeAccount = newAccount
      this.view = !newAccount ? this.viewStatus.errored : this.viewStatus.connected;
    },
    walletDownloadLink(wallet: any) {
      console.log('wallet', wallet);
      
      return wallet.downloads[0].link
    },
  }
};
</script>
