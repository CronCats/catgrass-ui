<template>
  <textarea
    :class="{
      'py-2 px-3 w-full bg-transparent rounded-lg border focus:outline-none focus:ring-1 ring-brand ring-offset-0 transition border-default body-text': true,
      'ring-1 ring-error': error,
      ...className
    }"
    :required="required"
  >
    <slot></slot>
  </textarea>
</template>

<script lang="ts">

export interface TextAreaInput {
  // validation?: any
  error?: any
  required?: boolean
}

export default {
  props: ["className", "error", "required"],
};
</script>
