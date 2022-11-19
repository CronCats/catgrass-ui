<template>
  <main>
    <PageHeader title="Create" backgroundColor="#008F58" />
    
    <div class="py-8 md:mx-auto md:max-w-6xl">
      <div class="grid grid-rows-3 gap-4 w-full md:grid-cols-3">
        TODO: create
        <!-- {recipeData
        ? recipeData.map((recipe: any, index) => (
        <a key={index} href="/create">
          <RecipeCardComponent bgColor={recipe.bgColor} data={recipe} />
        </a>
        ))
        : ''} -->
      </div>
    </div>

  </main>
</template>

<script lang="ts">
import PageHeader from '../components/PageHeader.vue'

export default {
  components: {
    PageHeader,
  }
}
</script>