<template>
  <main>
    <PageHeader title="Create Your Recipe" backgroundColor="#008F58" />

    <div class="py-8 md:py-12">
      <div class="px-2 mx-auto max-w-xl md:px-0">

          <form @submit="handleSubmit">
            <section :class="{ hidden: currentIndex !== 0 }" id="0">
              <h3 class="mb-2 text-xl">I want to…</h3>
    
              <ActionSelector :actions="actions" :onSelectedAction="actionCallback" />
    
              <component :is="selectedAction.Component" />
            </section>
    
            <!-- <section :class="{ hidden: currentIndex !== 1, }" id="1">
              <CadenceBoundaryComponent />
            </section> -->
    
            <!-- <section :class="{ hidden: currentIndex !== 2, }" id="2">
              <RecipeSummaryComponent />
            </section> -->
    
            <!-- <section :class="{ hidden: currentIndex !== 3, }" id="3">
              <NetworkSignerComponent onComplete={nextSection} />
            </section> -->
    
            <!-- <section :class="{ hidden: currentIndex !== 4, }" id="4">
              <div class="text-center">
                <CakeIcon class="mx-auto mb-4 w-24 text-gray-700" />
    
                <h3 class="mb-2 text-xl">
                  {{'form.recipe_success_title')}}
                </h3>
                <p class="text-gray-500">
                  {{'form.recipe_success_subtitle')}}
                </p>
    
                {/* TODO: Add transaction links to explorers */}
              </div>
    
              <div class="my-12">
                <a href="/profile/recipes">
                  <RecipeCardComponent :bgColor="successRecipeData.bgColor" :data="successRecipeData" />
                </a>
              </div>
            </section> -->
    
            <!-- <footer class="flex justify-between">
              <Button :class="{ hidden: currentIndex === 0 || currentIndex > 3 }"
                @click="prevSection"
                size="2xl"
                variant="secondary"
                >
                <span>Back</span>
              </Button>
              <Button :class="{ hidden: currentIndex> 1, 'ml-auto': true, }"
                @click="nextSection"
                size="2xl"
                variant="primary"
                >
                <span>Next</span>
              </Button>
    
              <RouterLink to="/profile/recipes">
                <Button :class="{ hidden: currentIndex < 4, 'mx-auto' : true, }" size="2xl" variant="secondary">
                  <span>View Recipes</span>
                </Button>
              </RouterLink>
    
              <div class="flex">
                <SubmitButton :class="{ hidden: currentIndex !==2, 'ml-auto' : true, }" label="Confirm" variant="primary" />
              </div>
            </footer> -->
          </form>

      </div>
    </div>
  </main>
</template>

<script lang="ts">
import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
  CakeIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'
import PageHeader from "../components/PageHeader.vue";
import ActionSelector from "../components/ActionSelector.vue";
import DollarCostAverage from "../components/forms/DollarCostAverage.vue";
import PaymentMultiSend from "../components/forms/PaymentMultiSend.vue";
import CustomMessage from "../components/forms/CustomMessage.vue";

const actions = [
  {
    Icon: ArrowPathRoundedSquareIcon,
    title: 'Dollar Cost Average',
    subtitle: 'Periodically swap a token to another token',
    Component: DollarCostAverage,
  },
  {
    Icon: BanknotesIcon,
    title: 'Payment Multi-Sender',
    subtitle: 'Send funds to one or many accounts periodically',
    Component: PaymentMultiSend,
  },
  {
    Icon: DocumentTextIcon,
    title: 'Custom Message',
    subtitle: 'Freeform json, use caution!',
    Component: CustomMessage,
  },
]

// TODO: Change to dynamic
const successRecipeData = {
  title: 'Dollar Cost Average from $JUNO to $NETA',
  // subtitle: '',
  owner: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  creator: 'juno1hmzk8ngj5zx4gxt80n8z72r50zxvlpk8kpqk6n',
  recipeHash:
    '8855DEBAB57DA0D06781B10501654F947CF4FA2925ACA2C1B26D5323EAF9DEC4',
  totalBalance: { amount: '10000000', denom: 'ujuno' },
  actions: [],
  rules: [],
  networks: [],
  bgColor: '#F9226C',
};

// TODO: computed
// const assetList = assets.find(({ chain_name }) => chain_name === 'juno')
// const tokens = assetList?.assets || []

export default {
  components: {
    PageHeader,
    ActionSelector,
    ArrowPathRoundedSquareIcon,
    BanknotesIcon,
    CakeIcon,
    DocumentTextIcon,
  },

  data() {
    return {
      currentIndex: 0,
      selectedAction: actions[0],
      successRecipeData: successRecipeData,
      actions,
    }
  },

  methods: {
    nextSection() {
      this.currentIndex = this.currentIndex + 1
    },
    prevSection() {
      this.currentIndex = this.currentIndex - 1
    },
    onSubmit(data: any) {
      console.log(data)
      this.nextSection()
    },
    actionCallback(action: any) {
      console.log('actionCallback', action)
      this.selectedAction = action
    },
    accountCallback(account: any) {
      console.log('accountCallback', account)
    },
    tokenCallback(token: any) {
      console.log('tokenCallback', token)
    },
    handleSubmit() {
      console.log('handleSubmit')
    },
  },
};
</script>
