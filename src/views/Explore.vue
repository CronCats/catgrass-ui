<template>
  <main>
    <PageHeader title="Explore" />

    <div class="py-8 md:mx-auto md:max-w-6xl">
      <div class="grid grid-rows-3 gap-4 w-full md:grid-cols-3">
        <!-- <Loader /> -->
        <template v-if="recipeData.length > 0">
          <a
            v-for="(recipe, index) in recipeData || []"
            :key="index"
            href="/create"
          >
            <RecipeCard :bgColor="recipe.bgColor" :data="recipe" class="h-full" />
          </a>
        </template>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { appConfig } from "@/utils/constants";
import { recipes } from "@/utils/recipeHelpers";
import PageHeader from "../components/PageHeader.vue";
import Loader from "../components/Loader.vue";
import RecipeCard from "../components/RecipeCard.vue";

export default {
  components: {
    PageHeader,
    Loader,
    RecipeCard,
  },

  data() {
    return {
      recipeData: recipes(appConfig.networkType)
    };
  },
};
</script>
