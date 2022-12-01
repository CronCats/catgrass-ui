<template>
  <div class="relative">
    <div class="flex z-10 p-4 text-gray-100 bg-gray-800 rounded-lg" @click="toggleList">
      <div class="flex px-2 w-full cursor-pointer">
        <div class="flex py-2 mr-4 w-8">
          <component :is="selectedAction.Icon" />
        </div>
        <div class="flex-col py-2 m-auto w-full">
          <h3 class="text-lg font-bold leading-4">{{selectedAction.title}}</h3>
          <small class="text-xs text-gray-400">{{selectedAction.subtitle}}</small>
        </div>
      </div>

      <div class="flex my-auto w-6">
        <ChevronUpIcon v-if="toggleActive" />
        <ChevronDownIcon v-else />
      </div>
    </div>

    <div
      :class="{
        'absolute top-16 -right-1 -left-1 z-20 flex-col p-2 text-gray-100 bg-gray-500 rounded-lg shadow-lg': true,
        visible: toggleActive === true,
        invisible: toggleActive === false,
      }"
    >
      <div
        v-for="(action, index) in actions"
        :key="index"
        class="p-1 hover:bg-gray-800 active:bg-gray-800 rounded-lg"
        @click="selectAction(action)"
      >
        <div class="flex px-2 w-full cursor-pointer">
          <div class="flex py-2 mr-4 w-8">
            <component :is="action.Icon" />
          </div>
          <div class="flex-col py-2 m-auto w-full">
            <h3 class="text-lg font-bold leading-4">{{action.title}}</h3>
            <small class="text-xs text-gray-400">{{action.subtitle}}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'

export default {
  props: ["actions", "onSelectedAction"],

  components: {
    ChevronDownIcon,
    ChevronUpIcon,
  },

  data() {
    return {
      toggleActive: false,
      selectedAction: this.actions[0],
    };
  },

  methods: {
    toggleList() {
      this.toggleActive = !this.toggleActive
    },
    selectAction(action: any) {
      this.selectedAction = action
      this.onSelectedAction(action)
      this.toggleList()
    },
  },
}
</script>
