<template>
  <main>
    <PageHeader title="My Accounts" />

    <div class="py-8 md:py-12">
      <div class="px-2 mx-auto max-w-xl md:px-0">
        <h4 class="mb-2 text-xs tracking-widest text-gray-400 uppercase">
          Supported Networks
        </h4>

        <div @click="testquery" class="my-6 p-4 bg-gray-600">
          QUERY ME - See Console
        </div>
        <div @click="testexec" class="my-6 p-4 bg-red-600">
          EXEC ME - See Console
        </div>

        <NetworkAccountSelector />

        <h4 class="mt-12 mb-2 text-xs tracking-widest text-gray-400 uppercase">
          Coming Soon
        </h4>

        <NetworkAccountSelector disabled />
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import NetworkAccountSelector from "../components/NetworkAccountSelector.vue";
import PageHeader from "@/components/PageHeader.vue";
import { mapState, mapActions } from "pinia";
import { useMultiWallet } from "../stores/multiWallet";

export default {
  components: {
    NetworkAccountSelector,
    PageHeader,
  },

  computed: {
    ...mapState(useMultiWallet, ['networks', 'accounts', 'walletManager']),
  },

  methods: {
    ...mapActions(useMultiWallet, ['queryContract', 'execContract']),
    async testquery() {
      const contractAddr = 'juno13fuh46m0wpc4kgv3e0p7gsax9xh3e74wp58xcu2kzyvrgh87zzeqxdva56' // TN
      // const contractAddr = 'juno1x4uaf50flf6af8jpean8ruu8q8jdraaqj7e3gg3wemqm5cdw040qk982ec' // MN
      const msg = { get_state: { from_index: null, limit: null } }
      // const msg = { query_config: { } }
      const hi = await this.queryContract(contractAddr, msg)
      console.log('hi', hi);
    },
    async testexec() {
      const contractAddr = 'juno13fuh46m0wpc4kgv3e0p7gsax9xh3e74wp58xcu2kzyvrgh87zzeqxdva56' // TN
      // const contractAddr = 'juno1x4uaf50flf6af8jpean8ruu8q8jdraaqj7e3gg3wemqm5cdw040qk982ec' // MN
      const msg = { register_agent: { } }
      // const msg = { unregister_agent: { } }
      console.log('accounts', this.accounts);
      
      const hi = await this.execContract(this.accounts[0], contractAddr, msg, 'auto')
      console.log('hi', hi);
    },
  }
};
</script>
