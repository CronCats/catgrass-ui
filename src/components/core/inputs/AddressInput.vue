<template>
  <div
    :class="{
      'flex gap-1 items-center py-[17px] px-3 font-mono text-sm bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-offset-0 transition border-default': true,
      'ring-2 ring-red-700 shadow-md shadow-red-400': error,
      'ring-transparent': !error,
      ...containerClassName
    }"
  >
    <WalletIcon class="mr-2 w-6 h-6" color="currentColor" />
    <input
      :class="{
        'w-full bg-transparent border-none outline-none ring-none body-text': true,
        ...className
      }"
      v-model="v"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      @change="change"
      type="text"
    />
  </div>
</template>

<script lang="ts">
import { WalletIcon } from '@heroicons/vue/24/outline'

export interface AddressInputProps {
  placeholder?: string
  onChange?: any
  validation?: any
  error?: any
  disabled?: boolean
  required?: boolean
  containerClassName?: string
}

export default {
  props: ["default", "error", "validation", "onChange", "disabled", "required", "className", "containerClassName", "placeholder"],

  components: {
    WalletIcon,
  },

  data() {
    return {
      v: null
    }
  },

  methods: {
    change(e) {
      if (this.onChange) this.onChange(this.v)
    },
    reset() {
      this.v = null
    },
  },

  mounted() {
    if (this.default) this.v = this.default
  },
};
</script>