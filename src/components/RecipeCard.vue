<template>
  <div class="cursor-pointer">
    <div
      class="relative z-20 p-6 text-white bg-pink-600 rounded-2xl"
      :style="{ backgroundColor: bgColor || '' }"
    >
      <div>
        <h3 class="text-2xl font-bold">{{ data.title }}</h3>
      </div>
      <div class="my-4">
        <p v-if="!data.subtitle" class="flex overflow-hidden text-ellipsis">
          by&nbsp;
          <strong class="overflow-hidden text-ellipsis">
            {{ data.creator || data.owner }}
          </strong>
        </p>
        <p v-if="data.subtitle">{{ data.subtitle }}</p>
      </div>
      <div class="flex justify-between mt-2">
        <div class="mt-auto">
          <Balance
            v-if="data.totalBalance"
            :amount="data.totalBalance.amount"
            :denom="data.totalBalance.denom"
            :imageUrl="data.totalBalance.imageUrl"
            :decimals="6"
          />
          <p v-if="data.stats?.copycats">{{ data.stats?.copycats }}</p>
        </div>
        <div class="flex">
          <div
            v-for="(chain, index) in recipeChains"
            :key="index"
            :class="{ 'ml-[-12px]': index > 0 }"
          >
            <LogoFromImage
              class="block"
              :rounded="true"
              size="32"
              :src="chain?.asset?.logo_URIs?.png || ''"
            />
          </div>
        </div>
      </div>
      <slot name="body"></slot>
    </div>
    <div
      v-if="data.recipeHash"
      class="relative z-10 px-6 pt-5 pb-2 -mt-4 bg-gray-200 rounded-b-2xl"
    >
      <div class="flex justify-between text-xs">
        <small
          class="overflow-hidden pr-8 my-auto w-full text-ellipsis break-normal"
        >
          Hash:&nbsp;
          <span class="overflow-hidden text-ellipsis break-normal">
            {{ data.recipeHash }}
          </span>
        </small>
        <DocumentDuplicateIcon
          class="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Action, Addr, ChainMetadata, Coin, Rule } from "@/utils/types";
import Balance from "./core/display/Balance.vue";
import LogoFromImage from "./core/display/LogoFromImage.vue";

import { DocumentDuplicateIcon } from "@heroicons/vue/24/outline";

interface RecipeCardProps {
  title: String;
  subtitle?: string;
  owner: Addr;
  creator?: Addr;
  creatorAlias?: string;
  recipeHash?: string;
  fee?: Coin;
  totalBalance?: Coin;

  actions?: Action[];
  rules?: Rule[];
  networks?: ChainMetadata[];

  stats?: {
    copycats?: Number;
    runs?: Number;
  };
}

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<RecipeCardProps>,
      required: true,
      validator: (data: RecipeCardProps) => !!data.title,
    },
    containerClassName: { type: String, required: false },
    active: { type: Boolean, required: false },
    bgColor: { type: String, required: false },
  },

  components: {
    Balance,
    DocumentDuplicateIcon,
    LogoFromImage,
  },

  default() {
    return {};
  },

  computed: {
    recipeChains() {
      return this.data.networks || [];
    },
  },
});
</script>
