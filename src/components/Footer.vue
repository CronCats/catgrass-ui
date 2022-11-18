<template>
  <div class="font-sans text-gray-800 bg-gray-200 text-center py-2">
    <div class="container mx-auto">Alias DAO &middot; © {{year}}</div>
  </div>
</template>

<script>
export default {
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>
