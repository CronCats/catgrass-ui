<template>
  <div>
    <div class="relative">
      <div
        class="flex z-10 bg-white rounded-lg border-2"
        @click="toggleList"
      >
        <Token :value="state.value" />

        <div class="flex my-auto mr-3 w-8">
          <ChevronUpDownIcon />
        </div>
      </div>

      <div
        :class="{
          'overflow-y-scroll absolute top-12 -right-1 -left-1 z-20 flex-col p-1 max-h-[200px] bg-white rounded-lg border-2 shadow-lg': true,
          visible: toggleActive === true,
          invisible: toggleActive === false,
        }"
      >
        <div
          v-for="(item, index) in options"
          :key="index"
          class="hover:bg-gray-200 active:bg-gray-200 rounded-lg"
          @click="updateSelect(item)"
        >
          <Token :value="item.value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/24/outline'
import Token from '../display/Token.vue'
import Balance from '../display/Balance.vue'
import LogoFromImage from '../display/LogoFromImage.vue'

export interface TokenSelectorValue {
  value: any
}

export interface TokenSelectorOption {
  key: string
  value: any
}

export interface TokenSelectorProps {
  options: TokenSelectorOption[]
  onChange: (value: any) => void
}

export default {
  props: ["options", "onChange"],

  components: {
    ChevronUpDownIcon,
    Token,
    Balance,
    LogoFromImage,
  },

  data() {
    return {
      toggleActive: false,
      state: this.options[0],
    }
  },

  methods: {
    toggleList() {
      this.toggleActive = !this.toggleActive
    },
    updateSelect(item: any) {
      this.state = item
      this.onChange(item)
      this.toggleList()
    },
  },
};
</script>
