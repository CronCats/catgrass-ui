<template>
  <small
    :class="{
      'text-red-700': error,
      'text-gray-700': !error,
      ...className
    }"
  >
    {{text}}
  </small>
</template>

<script lang="ts">
export interface SubtextProps {
  error?: boolean
  className?: string
  text: string
}

export default {
  props: ["className", "error", "text"],
};
</script>