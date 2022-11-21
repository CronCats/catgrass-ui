<template>
  <div class="flex justify-between p-2 w-full cursor-pointer">
    <div class="flex my-auto w-full">
      <div class="flex-col" :style="{ minWidth: '42px' }">
        <LogoFromImage class="block mr-4" :rounded="true" :size="42" :src="account.chain?.asset?.logo_URIs?.png || ''" />
      </div>
      <div class="flex-col m-auto w-full">
        <h3 class="text-lg font-bold leading-4">{{account.title}}</h3>
        <div class="flex flex-col justify-between w-10/12 md:flex-row md:w-full">
          <small
            class="inline overflow-hidden mr-auto w-full text-xs text-gray-400 lowercase text-ellipsis md:block md:w-1/2 md:h-auto h-10/12">
            {{account.address}}
          </small>
          <small
            v-if="hideBalance === false"
            class="inline grow text-xs text-gray-400 uppercase md:block md:w-1/2 md:h-auto md:text-right h-10/12">
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
};
</script>