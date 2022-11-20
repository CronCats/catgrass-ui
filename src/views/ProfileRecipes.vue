<template>
  <main>
    <PageHeader title="My Recipes" />

    <div className="py-8 md:mx-auto md:max-w-6xl">
      <div className="grid grid-rows-3 gap-4 w-full md:grid-cols-3">
        TODO: Recipe cards
        <!-- {recipeData
        ? recipeData.map((recipe: any, index) => (
        <RecipeCardComponent key={index} bgColor={recipe.bgColor} data={recipe} />
        ))
        : ''} -->
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import PageHeader from "../components/PageHeader.vue";

const recipeData = [
  {
    title: "Dollar Cost Average from $JUNO to $NETA",
    // subtitle: '',
    owner: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    creator: "juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n",
    recipeHash:
      "8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4",
    totalBalance: { amount: "10000000", denom: "ujuno" },
    // stats: {
    //   copycats: 139,
    //   runs: 1309,
    // },
    actions: [],
    rules: [],
    networks: [],
    bgColor: "#F9226C",
  },
  // {
  //   title: 'Automate Payroll, sending $JUNO to 2 or more accounts',
  //   // subtitle: '',
  //   owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  //   creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  //   recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
  //   totalBalance: { amount: '100000000', denom: 'ujuno' },
  //   // stats: {
  //   //   copycats: 19,
  //   //   runs: 2847,
  //   // },
  //   actions: [],
  //   rules: [],
  //   networks: [],
  //   bgColor: '#037099',
  // },
  // {
  //   title: 'Custom Message, flexible for developer automations',
  //   // subtitle: '',
  //   owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  //   creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  //   recipeHash: '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
  //   totalBalance: { amount: '1000000', denom: 'ujuno' },
  //   // stats: {
  //   //   copycats: 6,
  //   //   runs: 204,
  //   // },
  //   actions: [],
  //   rules: [],
  //   networks: [],
  //   bgColor: '#00787B',
  // },
];

export default {
  components: {
    PageHeader,
  },

  default() {
    return {
      recipeData,
    };
  },
};
</script>
