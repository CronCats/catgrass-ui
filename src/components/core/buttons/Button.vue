<template>
  <button
    :class="{
      'relative py-[6px] px-[16px] text-center rounded-full transition': true,
      // Primary
      'text-white bg-btn': variant == 'primary',
      'hover:bg-dark active:bg-toast': variant == 'primary' && !isDisabled,
      'bg-dark': variant === 'primary' && active,
      // Secondary
      'border-2 border-gray-700': variant === 'secondary',
      'hover:bg-btn-secondary-hover active:bg-btn-secondary-pressed':
        variant === 'secondary' && !isDisabled,
      'bg-btn-secondary-hover': variant === 'secondary' && active,
      // Shared
      'bg-btn-disabled': isDisabled,
      'py-[18px] px-10 min-w-[110px] text-lg md:min-w-[190px]':
        size === '2xl',
      'py-[12px] px-[24px]': size === 'xl',
      'py-[10px] px-[16px]': size === 'lg',
      'py-[4px] px-[8px]': size === 'sm',
      ...className
    }"
    :disabled="isDisabled"
    :type="type"
  >
    <div
      :class="{
        'flex flex-row gap-2 justify-center items-center': true,
        invisible: loading,
        ...contentContainerClassName
      }"
    >
      <slot></slot>
    </div>
  </button>
</template>

<script lang="ts">
export interface ButtonProps {
  children: any
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'lg' | 'xl' | '2xl'
  disabled?: boolean
  className?: string
  loading?: boolean
  contentContainerClassName?: string
  active?: boolean
  Logo?: any
}

export default {
  props: ["type", "variant", "size", "disabled", "className", "loading", "contentContainerClassName", "active", "Logo"],

  computed: {
    isDisabled() {
      return this.disabled || this.loading
    },
  },
};
</script>

