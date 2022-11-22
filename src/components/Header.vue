<template>
  <nav
    class="fixed top-0 right-0 left-0 z-40 justify-between w-full backdrop-blur md:py-2 md:px-6 navbar backdrop-filter"
  >
    <div class="flex-none md:hidden">
      <div class="w-6 h-6">
        <!-- <ArrowSmallLeftIcon :class="w-6 h-6" /> -->
      </div>
    </div>
    <div class="flex">
      <RouterLink class="w-9 h-9 md:w-10 md:h-10" to="/">
        <div class="flex">
          <img
            alt="CronCat"
            height="42"
            src="/croncat_color_logo.png"
            width="42"
          />
          <div class="my-auto ml-4 badge badge-md">ALPHA</div>
        </div>
      </RouterLink>
    </div>
    <div class="flex-none md:hidden">
      <div @click="toggleActive">
        <XMarkIcon v-if="menuActive" class="w-6 h-6" />
        <Bars3BottomRightIcon v-if="!menuActive" class="w-6 h-6" />
      </div>
    </div>

    <div
      :class="{
        'fixed top-16 right-0 bottom-0 left-0 flex-none w-full h-fit bg-white rounded-t-xl shadow md:hidden': true,
        'flex-none': menuActive,
        hidden: !menuActive,
      }"
      data-note="mobile menu"
    >
      <ul class="p-3 w-full list-none">
        <li
          v-for="(item, index) in mobileNav"
          :key="index"
          class="flex p-2 mb-2 hover:bg-gray-200 active:bg-gray-200 rounded-md"
        >
          <a :href="item.href">
            <NavSubItem>
              <template #icon>
                <component :is="item.icon"></component>
              </template>
              <template #title>
                {{ item.title }}
              </template>
              <template #subtitle>
                {{ item.subtitle }}
              </template>
            </NavSubItem>
          </a>
        </li>
        <li>
          <button
            class="py-0 px-5 my-8 mx-auto w-full text-xs tracking-widest text-gray-50 bg-green-600 hover:bg-green-700 rounded-full border-0 btn"
          >
            Create Recipe
          </button>
        </li>
      </ul>
    </div>

    <div class="flex-none xs:hidden sm:hidden md:flex" data-note="desktop menu">
      <ul class="p-0 menu menu-horizontal">
        <li
          v-for="(item, index) in navData"
          :key="index"
          class="mr-4"
          :tabIndex="index"
        >
          <a class="text-lg font-bold" :href="item.href">
            <component :is="item.icon" :class="[item.className]"></component>
            <span v-if="item.title" class="-mr-2">{{ item.title }}</span>
            <svg
              v-if="item.sub && item.sub.length > 0 && !item.hideSubDesktop"
              class="fill-current"
              height="20"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"
              />
            </svg>
          </a>
          <ul
            v-if="item.sub && item.sub.length > 0 && !item.hideSubDesktop"
            class="right-0 p-2 bg-white rounded shadow"
          >
            <li
              v-for="sub in item.sub"
              :key="sub.title"
              class="hover:bg-gray-200 rounded-md"
            >
              <a class="flex" :href="sub.href">
                <NavSubItem>
                  <template #icon>
                    <component :is="sub.icon"></component>
                  </template>
                  <template #title>
                    {{ sub.title }}
                  </template>
                  <template #subtitle>
                    {{ sub.subtitle }}
                  </template>
                </NavSubItem>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
// import { mapActions, mapGetters } from 'vuex'
// import { useKeplr } from '../utils/keplr'
// import config from '../utils/config'
// import connection from '../utils/connection'
// import msgHandler from '../utils/msgHandler'
// import { fromMicroAmount } from '../utils/helpers'
// import Search from './Search.vue'
// import { mapActions } from "pinia";
// import { useMultiWallet } from "@/stores/multiWallet";

// export default defineComponent({
//   methods: {
//     ...mapActions(useMultiWallet, ['init']),
//   },

//   mounted() {
//     this.init()
//   }
// })

import {
  // ArrowSmallLeftIcon,
  Bars3BottomRightIcon,
  CogIcon,
  CommandLineIcon,
  MapIcon,
  NewspaperIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  Square2StackIcon,
  WalletIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { UserCircleIcon as UserCircleSolidIcon } from "@heroicons/vue/24/solid";
import NavSubItem from "./NavSubItem.vue";

const navData = [
  {
    title: "Explore",
    href: "/explore",
    hideSubDesktop: true,
    sub: [
      {
        icon: NewspaperIcon,
        title: "Explore",
        subtitle: "Search & automate anything",
        href: "/explore",
        sort: 1,
      },
    ],
  },
  {
    title: "Agents",
    href: "/agents",
    sub: [
      {
        icon: CommandLineIcon,
        title: "Agent Setup",
        subtitle: "Install & become an agent",
        href: "/agents/setup",
        sort: 9,
      },
      {
        icon: QuestionMarkCircleIcon,
        title: "FAQs",
        subtitle: "Helpful answers & resources",
        href: "/faqs",
        sort: 10,
      },
    ],
  },
  {
    title: "More",
    href: "#",
    sub: [
      {
        icon: PresentationChartLineIcon,
        title: "Stats",
        subtitle: "Operations & growth analytics",
        href: "/stats",
        sort: 8,
      },
      {
        icon: MapIcon,
        title: "Docs",
        subtitle: "Developer references & SDKs",
        href: "https://docs.cron.cat",
        sort: 7,
      },
    ],
  },
  {
    icon: UserCircleSolidIcon,
    className: "inline md:-mr-3 md:ml-2 w-8 h-8",
    href: "#",
    sub: [
      {
        icon: WalletIcon,
        title: "My Accounts",
        subtitle: "Manage your connected networks & accounts",
        href: "/profile/accounts",
        sort: 2,
      },
      {
        icon: Square2StackIcon,
        title: "My Recipes",
        subtitle: "Watch & manage automated tasks",
        href: "/profile/recipes",
        sort: 3,
      },
      {
        icon: CogIcon,
        title: "Settings",
        subtitle: "Notifications, preferences & more",
        href: "/profile/settings",
        sort: 4,
      },
    ],
  },
];

const mobileNav = navData
  .map(({ sub }) => {
    return sub;
  })
  .reduce((pre, cur) => {
    return pre.concat(cur);
  }, [])
  .sort((a, b) => a.sort - b.sort);

export default {
  components: {
    // ArrowSmallLeftIcon,
    Bars3BottomRightIcon,
    CogIcon,
    CommandLineIcon,
    MapIcon,
    NewspaperIcon,
    PresentationChartLineIcon,
    QuestionMarkCircleIcon,
    Square2StackIcon,
    WalletIcon,
    XMarkIcon,
    NavSubItem,
  },

  data() {
    return {
      menuActive: false,
      navData,
      mobileNav,
      timer: null,
    };
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

  methods: {
    //   ...mapActions(['update', 'logout']),
    hideAccountMenu() {
      this.menuActive = false;
    },
    toggleActive() {
      if (this.timer) clearTimeout(this.timer);
      if (this.menuActive === false) {
        setTimeout(() => {
          this.menuActive = false;
        }, 5000);
      }
      this.menuActive = !this.menuActive;
    },

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
  },

  // async mounted() {
  //   // Auto-login, if had setup already
  //   const keplr = localStorage.getItem('keplr_login')
  //   if (keplr === 'true') this.loadClient()
  // },

  watch: {
    $route: ["hideAccountMenu"],
  },
};
</script>
