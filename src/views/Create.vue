<template>
  <main>
    <PageHeader title="Create Your Recipe" backgroundColor="#008F58" />

    <div class="py-8 md:py-12">
      <div v-if="accounts.length == 0" class="px-2 mx-auto max-w-xl md:px-0">
        <h1 class="block text-center text-xl m-auto mb-4">Connect Wallet</h1>
        <p class="mb-8">Takes a few seconds then you'll be ready to create a recipe!</p>
        <router-link to="/profile/accounts">
          <div class="py-0 px-5 w-full text-xs tracking-widest text-gray-50 bg-gray-700 hover:bg-gray-900 rounded-full border-0 btn">
            Manage Wallets
          </div>
        </router-link>
        
      </div>
      <div v-if="accounts.length > 0" class="px-2 mx-auto max-w-xl md:px-0">

          <!-- <form @submit="handleSubmit"> -->
            <section :class="{ hidden: currentIndex !== 0 }" id="0">
              <h3 class="mb-2 text-xl">I want to…</h3>
    
              <ActionSelector :actions="actions" :onSelectedAction="actionCallback" />
    
              <component :is="selectedAction.Component" />
            </section>
    
            <section :class="{ hidden: currentIndex !== 1 }" id="1">
              <CadenceBoundary />
            </section>
    
            <section :class="{ hidden: currentIndex !== 2 }" id="2">
              <RecipeSummary />
            </section>
    
            <section :class="{ hidden: currentIndex !== 3 }" id="3">
              <NetworkSigner :onComplete="nextSection" />
            </section>
    
            <section :class="{ hidden: currentIndex !== 4 }" id="4">
              <div class="text-center">
                <CakeIcon class="mx-auto mb-4 w-24 text-gray-700" />
    
                <h3 class="mb-2 text-xl">
                  Great Job!
                </h3>
                <p class="text-gray-500">
                  All transactions completed, your recipe will begin immediately.
                </p>
    
                <!-- {/* TODO: Add transaction links to explorers */} -->
              </div>
    
              <div class="my-12">
                <a href="/profile/recipes">
                  <RecipeCard :bgColor="successRecipeData.bgColor" :data="successRecipeData" />
                </a>
              </div>
            </section>
    
            <footer class="flex justify-between">
              <Button :class="{ hidden: currentIndex === 0 || currentIndex > 3 }" @click="prevSection" size="2xl" variant="secondary" >
                <span>Back</span>
              </Button>
              <Button :class="{ hidden: currentIndex> 1, 'ml-auto': true, }" @click="nextSection" size="2xl" variant="primary" >
                <span>Next</span>
              </Button>
    
              <RouterLink :class="{ hidden: currentIndex < 4, 'mx-auto': true }" to="/profile/recipes">
                <Button size="2xl" variant="secondary">
                  <span>View Recipes</span>
                </Button>
              </RouterLink>
    
              <div class="flex">
                <SubmitButton @click="nextSection" :class="{ hidden: currentIndex !== 2, 'ml-auto' : true, }" label="Confirm" variant="primary" />
              </div>
            </footer>
          <!-- </form> -->

      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { mapState } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
  CakeIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'
import PageHeader from "@/components/PageHeader.vue";
import ActionSelector from "@/components/ActionSelector.vue";
import DollarCostAverage from "@/components/forms/DollarCostAverage.vue";
import PaymentMultiSend from "@/components/forms/PaymentMultiSend.vue";
import CustomMessage from "@/components/forms/CustomMessage.vue";
import CadenceBoundary from "@/components/forms/CadenceBoundary.vue";
import RecipeSummary from "@/components/forms/RecipeSummary.vue";
import NetworkSigner from "@/components/forms/NetworkSigner.vue";
import Button from '@/components/core/buttons/Button.vue'
import SubmitButton from '@/components/core/buttons/SubmitButton.vue'
import RecipeCard from "@/components/RecipeCard.vue";
import { successRecipeData } from "@/utils/mvpData"

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

export default {
  components: {
    Button,
    SubmitButton,
    PageHeader,
    ActionSelector,
    ArrowPathRoundedSquareIcon,
    BanknotesIcon,
    CakeIcon,
    DocumentTextIcon,
    CadenceBoundary,
    NetworkSigner,
    RecipeSummary,
    RecipeCard,
  },

  data() {
    return {
      currentIndex: 0,
      selectedAction: actions[0],
      successRecipeData: successRecipeData,
      actions,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
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
