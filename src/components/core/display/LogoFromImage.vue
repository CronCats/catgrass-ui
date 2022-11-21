<template>
  <img
    alt=""
    :class="[`${rounded ? 'overflow-hidden rounded-full' : ''}`, className]"
    :height="size"
    :src="src"
    :width="size"
  />
</template>

<script setup lang="ts">
defineProps<{
  src: string;
  rounded?: boolean;
  size?: number | string;
  className?: string;
  invert?: boolean;
}>();
</script>
