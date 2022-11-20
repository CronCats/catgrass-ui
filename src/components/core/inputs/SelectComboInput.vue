<template>
  <div
    :class="{
      'flex w-full text-lg text-right bg-white rounded-lg border-2 focus-within:outline-none focus-within:ring-2 ring-offset-0 transition border-default': true,
      'ring-2 ring-red-700 shadow-md shadow-red-400': error,
      'ring-transparent': !error,
      ...containerClassName
    }"
  >
    <input
      :class="{
        'py-[14px] px-3 w-2/3 text-lg bg-transparent border-none outline-none ring-none': true,
        ...className
      }"
      name="input"
      @change="updateInput"
      type="text"
      v-model="input"
    />
    <select
      :class="{
        'py-[14px] px-3 w-1/3 text-body bg-transparent border-l-2 focus:outline-none focus:ring-none border-default': true
      }"
      name="select"
      @change="updateSelect"
      v-model="select"
    >
      <option v-for="(option, index) in options" :key="index" :value="option.value">
        {{option.key}}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
export interface ComboInputSelectValue {
  select: string
  input: string
}

export interface ComboInputSelectOption {
  key: string
  value: string
  default: string
}

export default {
  props: ["options", "onChange", "containerClassName", "className", "error", "validation"],

  data() {
    return {
      input: '',
      prevInput: '',
      select: this.options[0] || {},
      prevSelect: this.options[0] || {},
    }
  },

  methods: {
    updateInput() {
      if (this.prevInput === this.input) return
      this.prevInput = this.input
      this.onChange({
        input: this.input,
        select: this.select,
      })
    },
    updateSelect() {
      if (this.prevSelect === this.select) return
      this.prevSelect = this.select
      this.onChange({
        input: this.input,
        select: this.select,
      })
    },
  },
};
</script>
