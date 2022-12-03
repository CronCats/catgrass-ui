<template>
  <div>
    <div class="relative">
      <div class="flex z-10 bg-white rounded-lg border-2">
        <div class="flex z-10 w-2/3">
          <input
            :class="{
              'w-full ml-4 p-[14px] text-lg text-right bg-white border-none outline-none ring-none': true,
              ...className
            }"
            name="input"
            @change="updateInput"
            type="text"
            v-model="input"
          />
        </div>

        <div class="flex w-1/3 z-10 border-l-2" @click="toggleList">
          <div class="flex-col py-2 pl-2 m-auto w-full">
            <h3 class="text-md font-bold leading-4">{{select.key || ''}}</h3>
          </div>

          <div class="flex my-auto mr-3 w-8">
            <ChevronUpDownIcon aria-hidden="true" class="w-8 h-7" />
          </div>
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
          class="hover:bg-gray-200 active:bg-gray-200 rounded-lg p-4"
          @click="updateSelect(item)"
        >
          <h3 class="text-lg font-bold leading-4">{{ item.key || ''}}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'

export default {
  props: ["options", "onChange", "containerClassName", "className", "error", "validation"],

  components: {
    ChevronUpDownIcon,
  },

  data() {
    return {
      toggleActive: false,
      input: '',
      prevInput: '',
      select: this.options[0] || {},
      prevSelect: this.options[0] || {},
    }
  },

  methods: {
    toggleList() {
      this.toggleActive = !this.toggleActive
    },
    updateInput() {
      if (this.prevInput === this.input) return
      this.prevInput = this.input
      this.onChange({
        input: this.input,
        select: this.select.value,
      })
    },
    updateSelect(option: any) {
      this.toggleList()
      if (this.prevSelect === option) return
      this.select = option
      this.input = option.default
      this.prevSelect = this.select
      this.onChange({
        input: this.input,
        select: this.select.value,
      })
    },
  },

  mounted() {
    this.select = this.options[0]
    this.input = this.select.default
  },
};
</script>
