<template>
  <input
    :class="{
      'block py-[6px] px-[16px] min-w-[110px] rounded-full transition cursor-pointer md:min-w-[190px]': true,
      // Primary
      'text-lg text-light bg-btn': variant === SubmitVariant.Primary,
      'hover:bg-dark active:bg-toast':
        variant === SubmitVariant.Primary && !disabled,
      // Secondary
      'bg-primary link-text': variant === SubmitVariant.Secondary,
      'hover:bg-btn-secondary-hover active:bg-btn-secondary-pressed':
        variant === SubmitVariant.Secondary && !disabled,
      // Shared
      'bg-btn-disabled': disabled,
      ...className
    }"
    :disabled="disabled"
    type="submit"
    :value="label"
  />
</template>

<script lang="ts">
export enum SubmitVariant {
  Primary = 'primary',
  Secondary = 'secondary',
}

export default {
  props: ["disabled", "className", "label", "variant"],

  data() {
    return {
      SubmitVariant,
    }
  },
};
</script>

