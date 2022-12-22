<template>
  <div class="relative p-3 mt-2 mb-2 w-full text-left bg-white rounded-md border-2 border-gray-200 focus:border-gray-200 focus:outline-none focus:ring-0 focus:ring-gray-200 cursor-default sm:text-sm">
    <div class="flex w-full justify-between">
      <div class="flex w-full justify-between" @click="toggleItem()">
        <span>{{ getItemTitle(item) }}</span>
        <ChevronUpIcon :class="active != true ? 'rotate-180 transform' : ''" class="h-5 w-5 text-gray-500" />
      </div>
      <div v-if="removeCallback" class="cursor-pointer opacity-30 hover:opacity-100 pr-2 pl-6" @click="remove(item)">
        <TrashIcon class="w-5" />
      </div>
    </div>
    <div :class="active == true ? 'visible' : 'hidden'" class="text-sm text-gray-500 relative w-full pt-2">
      <Codemirror :modelValue="JSON.stringify(item, null, 2)"
        :style="{ height: '150px', borderRadius: '6px', overflow: 'scroll' }" :autofocus="false" :indent-with-tab="true"
        :tab-size="2" :extensions="extensions" />
    </div>
  </div>
</template>

<script lang="ts">
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  ChevronUpIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline'

const extensions: any = [json(), oneDark]

export default {
  props: ['item', 'active', 'toggleCallback', 'removeCallback'],

  components: {
    ChevronUpIcon,
    Codemirror,
    PlusIcon,
    TrashIcon,
  },

  data() {
    return {
      extensions,
    }
  },

  computed: {
    code() {
      return this.item.defaultCode
    },
  },

  methods: {
    toggleItem() {
      if (this.toggleCallback) this.toggleCallback()
    },
    remove(item: any) {
      if (this.removeCallback) this.removeCallback(item)
    },
    getItemTitle(item: any) {
      let s = ''

      if (item) s = Object.keys(item)[0]
      if ('msg' in item) s = Object.keys(item.msg)[0]
      if ('kind' in item) {
        s = `${item.kind} ${item.req_idx} ${item.res_idx}`
      }

      return `${s}`
    },
  },
};
</script>
