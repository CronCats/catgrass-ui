<template>
  <div
    :class="{
      'flex flex-row gap-1 items-center text-md': true,
      ...containerClassName,
      'py-[14px] px-3 bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-offset-0 transition border-default': true,
      'ring-2 ring-red-700 shadow-md shadow-red-400': error,
      'ring-transparent': !error,
      'w-28': sizing === 'sm',
      'w-40': sizing === 'md',
      'w-full': sizing === 'full',
      'w-28 md:w-32 lg:w-40': sizing === 'auto',
    }"
  >
    <button v-if="onPlus" :class="{'transition secondary-text': true, 'hover:body-text': !disabled }" :disabled="disabled" @click="onPlus" type="button">
      <PlusIcon class="w-4" />
    </button>
    <button v-if="onMinus" :class="{'transition secondary-text': true, 'hover:body-text' : !disabled }" :disabled="disabled" @click="onMinus" type="button">
      <MinusIcon class="w-4" />
    </button>

    <input
      :class="{
        'w-full text-lg text-right bg-white border-none outline-none ring-none': true,
        ...className
      }"
      :disabled="disabled"
      :required="required"
      @change="change"
      type="number"
    />
  </div>
</template>

<script lang="ts">
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'

export default {
  props: ["error", "validation", "onChange", "onMinus", "onPlus", "disabled", "sizing", "className", "containerClassName", "required"],

  components: {
    MinusIcon,
    PlusIcon,
  },

  methods: {
    change(e) {
      if (this.onChange) this.onChange(e.target.value)
    },
  },
};
</script>
