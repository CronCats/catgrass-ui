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

        <section :class="{ hidden: currentIndex !== 0 }" id="0">
          <h3 class="mb-2 text-xl">I want to…</h3>

          <ActionSelector :actions="actions" :onSelectedAction="actionCallback" />

          <component :is="selectedAction.Component" />
        </section>

        <section :class="{ hidden: currentIndex !== 1 }" id="1">
          <CadenceBoundary />
        </section>

        <section :class="{ hidden: currentIndex !== 2 }" id="2">
          <RecipeSummary ref="summary" />
        </section>

        <section :class="{ hidden: currentIndex !== 3 }" id="3">
          <NetworkSigner ref="networksigner" :onComplete="nextSection" />
        </section>

        <section :class="{ hidden: currentIndex !== 4 }" id="4">
          <div class="text-center">
            <CakeIcon class="mx-auto mb-4 w-24 text-gray-700" />

            <h3 class="mb-2 text-xl">
              Great Job!
            </h3>
            <p class="text-gray-500">
              All transactions completed, your recipe is now running!
            </p>

            <!-- {/* TODO: Add transaction links to explorers */} -->
          </div>

          <div class="my-12">
            <a href="/profile/recipes">
              <RecipeCard :data="recipeData" />
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
              <span>View Your Recipes</span>
            </Button>
          </RouterLink>

          <div class="flex">
            <SubmitButton @click="nextSection" :class="{ hidden: currentIndex !== 2, 'ml-auto' : true, }" label="Confirm" variant="primary" />
          </div>
        </footer>

      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "@/stores/multiWallet";
import { useTaskCreator } from "@/stores/taskCreator";
import PageHeader from "@/components/PageHeader.vue";
import ActionSelector from "@/components/ActionSelector.vue";
// import DollarCostAverage from "@/components/forms/DollarCostAverage.vue";
import PaymentMultiSend from "@/components/forms/PaymentMultiSend.vue";
import CustomMessage from "@/components/forms/CustomMessage.vue";
import CadenceBoundary from "@/components/forms/CadenceBoundary.vue";
import RecipeSummary from "@/components/forms/RecipeSummary.vue";
import NetworkSigner from "@/components/forms/NetworkSigner.vue";
import Button from '@/components/core/buttons/Button.vue'
import SubmitButton from '@/components/core/buttons/SubmitButton.vue'
import RecipeCard from "@/components/RecipeCard.vue";
import { successRecipeData } from "@/utils/mvpData"
import {
  ArrowPathRoundedSquareIcon,
  BanknotesIcon,
  CakeIcon,
  DocumentTextIcon,
} from '@heroicons/vue/24/outline'

const actions = [
  // NOTE: Junoswap now paused for WYND migration. :(
  // {
  //   Icon: ArrowPathRoundedSquareIcon,
  //   title: 'Dollar Cost Average',
  //   subtitle: 'Periodically swap a token to another token',
  //   Component: DollarCostAverage,
  // },
  {
    Icon: BanknotesIcon,
    title: 'Token Multi-Sender',
    subtitle: 'Send funds to one or many accounts periodically',
    Component: PaymentMultiSend,
  },
  {
    Icon: DocumentTextIcon,
    title: 'Custom Messages',
    subtitle: 'Freeform json task creation, use caution!',
    Component: CustomMessage,
  },
]

// TODO: Validation checker, using context
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
      actions,
    }
  },

  computed: {
    ...mapState(useMultiWallet, ['accounts']),
    ...mapState(useTaskCreator, ['task', 'context']),
    recipeData() {
      const taskHash = this.context.taskHash ? this.context.taskHash : null
      return {
        task: this.task,
        taskHash,
      }
    },
  },

  methods: {
    ...mapActions(useTaskCreator, ['setDefaultTask', 'resetTaskCreator']),
    async nextSection() {
      this.currentIndex = this.currentIndex + 1
      console.log('NEXT:', this.currentIndex, JSON.stringify(this.task), JSON.stringify(this.context));

      // trigger summary computations
      if (this.currentIndex === 2 && this.$refs.summary) {
        await this.$refs.summary.computeEstimates()
      }
      // load context into signers
      if (this.currentIndex === 3 && this.$refs.networksigner) {
        await this.$refs.networksigner.loadContext()
      }
    },
    prevSection() {
      this.currentIndex = this.currentIndex - 1
    },
    actionCallback(action: any) {
      this.selectedAction = action
    },
  },

  mounted() {
    // init default task, to reset the flow
    this.resetTaskCreator()
    this.setDefaultTask()
  },
};
</script>
