<template>
  <span>
    <template v-if="imageUrl">
      <div
        class="w-4 h-4 bg-brand bg-center bg-cover rounded-full"
        :style="{ backgroundImage: iconUrl ? `url(${iconUrl})` : '' }"
      ></div>
    </template>

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
  balance?: {
    denom: string;
    amount: string;
  }
}

export default {
  props: ["denom", "amount", "decimals", "imageUrl", "balance"],

  computed: {
    symbol() {
      let s = ''
      if (this.denom) s = nativeTokenLabel(this.denom);
      if (this.balance?.denom) s = nativeTokenLabel(this.balance.denom);
      return `${s}`.toUpperCase();
    },
    icon() {
      return nativeTokenLogoURI(this.denom);
    },
    iconUrl() {
      return this.icon || this.imageUrl;
    },
    // TODO: connect with assets list to find relevant decimals
    formattedAmt() {
      const amt = this.balance?.amount ? this.balance.amount : this.amount
      return convertMicroDenomToDenomWithDecimals(
        amt,
        this.decimals
      ).toLocaleString(undefined, {
        maximumFractionDigits: this.decimals,
      });
    },
  },
};
</script>
