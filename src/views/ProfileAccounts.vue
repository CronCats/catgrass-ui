<template>
  <main>
    <PageHeader title="My Accounts" />
    
    <div class="py-8 md:py-12">
      <div class="px-2 mx-auto max-w-xl md:px-0">
        <h4 class="mb-2 text-xs tracking-widest text-gray-400 uppercase">
          Supported Networks
        </h4>
    
        <NetworkAccountSelector :networks="networks" />
        
        <h4 class="mt-12 mb-2 text-xs tracking-widest text-gray-400 uppercase">
          Coming Soon
        </h4>
        
        <NetworkAccountSelector :networks="networks" disabled />
      </div>
    </div>

  </main>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useMultiWallet } from '../stores/multiWallet'
import NetworkAccountSelector from '../components/NetworkAccountSelector.vue'
import PageHeader from '../components/PageHeader.vue'

export default {
  setup() {
    const store = useMultiWallet()

    return {
      networks: store.networks,
    }
  },
  
  components: {
    NetworkAccountSelector,
    PageHeader,
  },
}
</script>