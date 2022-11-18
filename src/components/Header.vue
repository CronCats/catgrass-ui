<template>
<header class="fixed w-full z-10 bg-gray-50 bg-opacity-20" style="backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
  <div class="z-10 w-full">
    <div class="w-full py-2 px-4">
      <div class="w-full flex items-center">
        <div class="flex">
          <router-link to="/">
            <img src="@/assets/images/alias_logo.png" alt="Alias" class="hidden md:block h-6 md:h-8 w-auto">
            <img src="@/assets/images/alias_logo_color.png" alt="Alias" class="md:hidden h-6 md:h-8 w-auto">
          </router-link>
          <span class="hidden md:block rounded-3xl px-2 py-1 bg-pink-500 text-white text-xs my-auto mx-4">BETA</span>
        </div>

        <!-- <Search class=" ml-6 mr-auto" /> -->

        <div @click.prevent="mobileMenuActive = true" class="ml-auto mr-4">
          <button type="button" class="p-2 inline-flex items-center justify-center text-gray-900 focus:outline-none">
            <Bars3Icon class="flex-shrink-0 h-6 w-6" />
          </button>
        </div>

        <div v-if="isAuthed" class="flex items-center justify-end mr-0">
          <div class="relative inline-block text-left">
            <div>
              <button type="button" @click.prevent="toggleAccountMenu" class="inline-flex justify-center w-full rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-2 md:px-4 py-1 bg-gray-100 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-green-500" aria-haspopup="true" aria-expanded="true">
                <AtSymbolIcon class="hidden md:block -ml-1 mr-2 my-auto h-5 w-5 stroke-current text-gray-800 dark:text-gray-200" />
                <div class="w-20 md:w-full grow flex-column text-left">
                  <p class="block truncate text-sm font-bold w-20 md:w-36">{{ account.label }}</p>
                  <span class="block truncate text-xs w-20 md:w-36">{{ account.address }}</span>
                </div>
                <svg class="hidden md:block -mr-1 ml-2 my-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>

            <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-turquoise-1000 ring-1 ring-black ring-opacity-5" :class="{hidden: !accountMenuActive}">
              <div @click="accountMenuActive = false" class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <!-- <router-link to="/user/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-turquoise-900 dark:hover:text-gray-50" role="menuitem">Account</router-link> -->
                <div class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-turquoise-900 dark:hover:text-gray-50" role="menuitem">
                  {{balance}} <span class="uppercase">{{config.denom}}</span>
                </div>
                <button @click.prevent="logout" type="submit" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 dark:text-gray-300 dark:hover:bg-turquoise-900 dark:hover:text-gray-50" role="menuitem">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isAuthed" class="flex">
          <button @click.prevent="loadClient" class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700">
            <BoltIcon class="h-5 w-5 md:mr-4 text-white" />
            <span class="hidden md:block">Connect Wallet</span>
          </button>
        </div>
      </div>
    </div>

    <div :class="{hidden: !mobileMenuActive}" class="absolute top-0 md:right-0 md:w-96 md:left-auto inset-x-0 p-2 transition transform origin-top-right">
      <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
        <div class="pt-5 pb-6 px-5">
          <div class="flex items-center justify-between">
            <div>
              <img src="@/assets/images/alias_logo.png" alt="Alias" class="h-6 md:h-8 w-auto md:hidden">
            </div>
            <div class="-mr-2" @click.prevent="mobileMenuActive = false">
              <button type="button" class="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500">
                <span class="sr-only">Close menu</span>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6">
            <nav class="grid gap-y-8">
              <router-link to="/customizer" @click="mobileMenuActive = false" class="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                <SparklesIcon class="flex-shrink-0 h-6 w-6" />
                <span class="ml-3 text-base font-medium text-gray-900">
                  Customizer
                </span>
              </router-link>

              <router-link to="/url-shortener" @click="mobileMenuActive = false" class="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                <LinkIcon class="flex-shrink-0 h-6 w-6" />
                <span class="ml-3 text-base font-medium text-gray-900">
                  URL Shortener
                </span>
              </router-link>

              <a href="docs.alias.cat" target="_blank" @click="mobileMenuActive = false" class="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                <MapPinIcon class="flex-shrink-0 h-6 w-6" />
                <span class="ml-3 text-base font-medium text-gray-900">
                  Docs
                </span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

</header>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
// import { useKeplr } from '../utils/keplr'
// import config from '../utils/config'
// import connection from '../utils/connection'
// import msgHandler from '../utils/msgHandler'
// import { fromMicroAmount } from '../utils/helpers'
import {
  MapPinIcon,
  Bars3Icon,
  AtSymbolIcon,
  LinkIcon,
  BoltIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline'
import Search from './Search.vue'

export default {
  components: {
    MapPinIcon,
    Bars3Icon,
    AtSymbolIcon,
    LinkIcon,
    BoltIcon,
    Search,
    SparklesIcon,
  },

  data() {
    return {
      mobileMenuActive: false,
      accountMenuActive: false,
      timer: null,
    }
  },

  // computed: {
  //   ...mapGetters([
  //     'isAuthed',
  //     'account',
  //     'domain',
  //     'config',
  //     'signer',
  //     'querier',
  //   ]),

  //   balance() {
  //     const wallet = this.account.balance
  //     if (!wallet) return '0'
  //     const bal = wallet && wallet.amount ? wallet.amount : 0
  //     return fromMicroAmount(bal, this.config.coinDecimals)
  //   },
  // },

  // methods: {
  //   ...mapActions(['update', 'logout']),
  //   hideAccountMenu() {
  //     this.accountMenuActive = false
  //   },
  //   toggleAccountMenu() {
  //     if (this.timer) clearTimeout(this.timer)
  //     if (this.accountMenuActive === false) {
  //       setTimeout(() => {
  //         this.accountMenuActive = false
  //       }, 5000)
  //     }
  //     this.accountMenuActive = !this.accountMenuActive
  //   },

  //   async checkBalance() {
  //     const addr = this.account.address
  //     if (!addr) return;
  //     try {
  //       const res = await this.querier.getBalance(addr, this.config.microDenom)
  //       const acct = { ...this.account, balance: res }
  //       this.update({ key: 'account', value: acct })
  //     } catch (e) {
  //       //
  //     }
  //   },

  //   checkRecursive() {
  //     setInterval(() => {
  //       if (this.querier) this.checkBalance()
  //     }, 30000)
  //   },
    
  //   async loadConfig() {
  //     if (!this.config || !this.config.contractAddress) return
  //     const msg = msgHandler.getConfig()
  //     try {
  //       res = await this.querier.queryContractSmart(this.config.contractAddress, msg)
  //       if (res) this.update({ key: 'contractConfig', value: res })
  //     } catch (e) {
  //     }
  //   },

  //   async loadClient() {
  //     const _config = config.getConfig('juno_testnet')
  //     // const _config = config.getConfig('stargaze_testnet')
  //     this.update({ key: 'config', value: _config })
  //     this.update({ key: 'domain', value: `.${_config.addressPrefix || 'juno'}` })
  //     const { connect, getAccount } = useKeplr(_config)
  //     await connect()
  //     let acct = await getAccount()

  //     // check if real account
  //     if (acct && acct.address) {
  //       this.update({ key: 'isAuthed', value: true })
  //       this.update({ key: 'account', value: { ...acct } })
  //       const signer = await connection.getSigningClient(acct, _config)
  //       this.update({ key: 'signer', value: signer })
  //       const querier = await connection.getQueryClient(_config)
  //       this.update({ key: 'querier', value: querier })
  //       localStorage.setItem('keplr_login', 'true')

  //       // load contract config
  //       await this.loadConfig()
  //       await this.checkBalance()
  //       this.checkRecursive()
  //     } else this.logout()
  //   },
  // },

  // async mounted() {
  //   // Auto-login, if had setup already
  //   const keplr = localStorage.getItem('keplr_login')
  //   if (keplr === 'true') this.loadClient()
  // },

  // watch: {
  //   $route: ['hideAccountMenu'],
  // },
}
</script>
