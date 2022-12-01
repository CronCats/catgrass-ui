<template>
  <div class="flex justify-between p-2 w-full cursor-pointer">
    <div class="flex flex-row my-auto w-full">
      <div :style="{ minWidth: '42px' }">
        <LogoFromImage class="block" :rounded="true" :size="42" :src="getAccountImage(account)" />
      </div>
      <div class="flex-col w-full my-auto mt-1 px-2">
        <h3 class="block text-lg font-bold leading-4 pb-[2px] max-w-full">{{account.title}}</h3>
        <div class="w-full">
          <small
            class="block md:inline-block max-w-[220px] md:max-w-auto md:w-[48%] text-xs text-gray-400 lowercase text-ellipsis overflow-hidden">
            {{account.address}}
          </small>
          <small
            v-if="account.balance && hideBalance != true"
            class="block md:inline-block md:w-[48%] text-xs text-gray-400 uppercase md:ml-auto md:mr-0 md:text-right">
            <Balance :amount="account.balance.amount" :denom="account.balance.denom" :decimals="6" />
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Account } from '../../../utils/types';
import Balance from './Balance.vue';
import LogoFromImage from '@/components/core/display/LogoFromImage.vue';

export interface AccountProps {
  account: Account
  hideBalance: boolean
}

export default {
  props: ["account", "hideBalance"],

  components: {
    Balance,
    LogoFromImage,
  },

  methods: {
    getAccountImage(account: Account): string {
      return account.asset?.logo_URIs?.png || account.chain?.asset?.logo_URIs?.png || ''
    }
  },
};
</script>