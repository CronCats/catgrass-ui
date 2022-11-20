<template>
  <span
      :class="{
        'inline-block mt-1 ml-1 max-w-prose text-xs text-error': true,
        ...className
      }"
    >
      {{error.message}}
    </span>
</template>

<script lang="ts">
export interface ErrorMessageProps {
  error?: any
  className?: string
}

export default {
  props: ["className", "error", "text"],
};
</script>