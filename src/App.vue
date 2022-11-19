<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="w-full h-full">
    <Header />

    <main class="min-h-screen bg-gray-50">
      <RouterView />
    </main>
  
    <Footer />
  </div>
</template>

