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
          <div v-if="flag" class="my-auto ml-4 px-2 py-1 text-xs bg-teal-400 rounded-full uppercase">{{ flag }}</div>
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
import { appConfig } from "@/utils/constants"
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

  computed: {
    flag() {
      return appConfig && appConfig.networkType && appConfig.networkType === 'testnet' ? appConfig.networkType : null
    },
  },

  methods: {
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
  },

  watch: {
    $route: ["hideAccountMenu"],
  },
};
</script>
