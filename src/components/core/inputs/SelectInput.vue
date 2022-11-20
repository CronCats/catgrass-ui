<template>
  <select
    :class="{
      'py-3 px-3 w-full text-body bg-transparent rounded-lg border-2 focus:outline-none focus:ring-2 ring-gray-400 ring-offset-0 transition border-default': true,
      'ring-1 ring-error': error,
      ...className
    }"
    :required="required"
  >
    <slot></slot>
  </select>
</template>

<script lang="ts">

export interface SelectInputProps {
  // validation?: any
  error?: any
  required?: boolean
}

export default {
  props: ["className", "error", "required"],
};
</script>
