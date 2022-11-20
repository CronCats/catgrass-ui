<template>
  <span>
    <template v-if="imageUrl">
      <div
        class="w-4 h-4 bg-brand bg-center bg-cover rounded-full"
        :style="{ backgroundImage: iconUrl ? `url(${iconUrl})` : '' }"
      ></div>
    </template>
    <!-- <template v-else>
      <div
        class="inline-flex justify-center items-center w-4 h-4 text-black bg-disabled rounded-full"
      >
        ?
      </div>
    </template> -->

    {{formattedAmt}} {{symbol}}
  </span>
</template>

<script lang="ts">
import {
  convertMicroDenomToDenomWithDecimals,
  nativeTokenLabel,
  nativeTokenLogoURI,
} from "../../../utils/helpers";

export interface BalanceProps {
  denom: string;
  amount: string;
  decimals: number;
  imageUrl?: string;
  usdcValue?: number;
}

export default {
  props: ["denom", "amount", "decimals", "imageUrl"],

  computed: {
    symbol() {
      return nativeTokenLabel(this.denom);
    },
    icon() {
      return nativeTokenLogoURI(this.denom);
    },
    iconUrl() {
      return this.icon || this.imageUrl;
    },
    formattedAmt() {
      return convertMicroDenomToDenomWithDecimals(
        this.amount,
        this.decimals
      ).toLocaleString(undefined, {
        maximumFractionDigits: this.decimals,
      });
    },
  },
};
</script>
