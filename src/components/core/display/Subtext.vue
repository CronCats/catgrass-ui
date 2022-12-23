<template>
  <small
    :class="error ? 'text-red-700' : className || 'text-gray-700'"
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