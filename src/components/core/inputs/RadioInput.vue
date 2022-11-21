<template>
  <div :class="{'flex flex-row gap-2 items-stretch': true, ...className}">
    <div
      v-for="({ label, value }, index) in options"
      :key="index"
      :class="{
        'flex flex-row gap-3 items-center transition': true,
        'py-3 px-4 hover:bg-tab-hover rounded-md': background,
        'bg-card': background && selected === value,
        'cursor-pointer': onChange,
        ...className
      }"
      @click="update(value)"
      :background="background"
      :label="label"
      :selected="selected"
    >
      <div class="aspect-square flex justify-center items-center w-5 h-5 rounded-full border border-default">
        <div
          :class="{
            'w-3 h-3 bg-brand rounded-full transition': true,
            'opacity-0': !selected,
            'opacity-100': selected,
          }"
        ></div>
      </div>

      <p v-if="label" class="primary-text">{{label}}</p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ["options", "onChange", "className", "background"],

  data() {
    return {
      selected: this.options[0],
    }
  },

  methods: {
    update(value: any) {
      this.selected = value
      this.onChange(value)
    },
  },
};
</script>
