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
  balance?: {
    denom: string;
    amount: string;
  }
}

export default {
  props: ["denom", "amount", "decimals", "imageUrl", "balance"],

  computed: {
    symbol() {
      if (this.balance?.denom) return nativeTokenLabel(this.balance.denom);
      return nativeTokenLabel(this.denom);
    },
    icon() {
      return nativeTokenLogoURI(this.denom);
    },
    iconUrl() {
      return this.icon || this.imageUrl;
    },
    // TODO: connect with assets list to find relevant decimals
    formattedAmt() {
      console.log('BALANCE', this.balance);
      
      const amt = this.balance?.denom ? this.balance?.denom : this.amount
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
