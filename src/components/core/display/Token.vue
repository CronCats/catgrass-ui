<template>
  <div class="flex px-2 w-full cursor-pointer">
    <div class="flex py-2 mr-2" :style="{ minWidth: '42px' }">
      <LogoFromImage
        class="block"
        :rounded="true"
        size="42"
        :src="getAccountImage(value)"
      />
    </div>
    <div class="flex-col py-2 m-auto w-full">
      <h3 class="text-lg font-bold leading-4">{{value?.symbol || ''}}</h3>
    </div>
  </div>
</template>

<script lang="ts">
import type { Asset } from '@/utils/types';
import LogoFromImage from './LogoFromImage.vue';

export default {
  props: ["value"],

  components: {
    LogoFromImage,
  },

  methods: {
    getAccountImage(asset: Asset): string {
      return asset?.logoURI || asset?.logo_URIs?.png || ''
    }
  },
};
</script>