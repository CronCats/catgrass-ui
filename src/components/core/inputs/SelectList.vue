<template>
  <Listbox>
    <div class="relative mt-1">
      <ListboxButton class="relative py-3 pr-10 pl-3 w-full text-left bg-white rounded-md border-2 border-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 cursor-default sm:text-sm">
        <span class="flex items-center">
          <div v-if="selected.Icon" class="flex-shrink-0 w-8 h-8">
            <component :is="selected.Icon" />
          </div>
          <span class="block ml-3 text-lg font-bold truncate">
            {{selected.title}}
          </span>
        </span>
        <span class="flex absolute inset-y-0 right-0 items-center mr-3 pointer-events-none">
          <ChevronUpDownIcon aria-hidden="true" class="w-8 h-7" />
        </span>
      </ListboxButton>
    
      <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <ListboxOptions class="overflow-auto absolute z-20 py-1 mt-0 w-full max-h-56 text-base bg-white rounded-md focus:outline-none ring-2 ring-gray-200 shadow-lg sm:text-sm">
          <ListboxOption v-for="(item, index) in options" @click="update(item)" v-slot="{ active, selected }" :key="index" class="relative py-2 pr-9 pl-3 cursor-pointer select-none hover:bg-gray-100" :value="item">
            <div class="flex items-center">
              <div v-if="item.Icon" class="flex-shrink-0 w-8 h-8">
                <component :is="item.Icon" />
              </div>
              <span class="block ml-3 text-lg font-bold truncate">
                {{item.title}}
              </span>
            </div>

            <span v-if="selected" :class="[ active ? 'text-gray-800' : 'text-gray-600' , 'flex absolute inset-y-0 right-0 items-center pr-4' ]">
              <CheckIcon aria-hidden="true" class="w-5 h-5" />
            </span>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts">
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

export default {
  props: ["options", "onChange", "containerClassName", "className"],

  components: {
    CheckIcon,
    ChevronUpDownIcon,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },

  data() {
    return {
      selected: this.options[0] || {},
    }
  },

  methods: {
    update(e) {
      this.selected = e
      if (this.onChange) this.onChange(e)
    },
  },

  mounted() {
    this.selected = this.options[0]
  },
};
</script>
