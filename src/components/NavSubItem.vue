<template>
  <div class="flex">
    <div class="inline mr-2 w-8 h-8">
      <slot name="icon"></slot>
    </div>
    <div class="flex-col">
      <p class="leading-3">
        <slot name="title"></slot>
      </p>
      <small class="text-xs text-gray-400">
        <slot name="subtitle"></slot>
      </small>
    </div>
  </div>
</template>
