<template>
  <label :class="['flex items-center space-x-1', labelClassName]">
    <span
      :class="{
        'text-xs tracking-widest text-gray-700 uppercase': true,
        'font-mono': mono,
        ...className
      }"
    >
      {{name}}
    </span>
  </label>
</template>

<script lang="ts">
export interface LabelProps {
  labelClassName?: string
  className?: string
  mono?: boolean
  name: string
}

export default {
  props: ["labelClassName", "className", "mono", "name"],
};
</script>
