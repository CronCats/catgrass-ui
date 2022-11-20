<template>
  <div
    :class="['py-8 bg-noise', className]"
    :style="{ backgroundColor: backgroundColor || 'rgb(245, 245, 245)' }"
  >
    <div
      class="m-auto mt-20 mb-0 w-10/12 text-center md:mt-40 md:mb-4 md:w-1/2"
    >
      <h1 class="text-3xl font-bold md:text-5xl">
        {{ title }}
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  className?: string;
  backgroundColor?: string;
}>();
</script>
