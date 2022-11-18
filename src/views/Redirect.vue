<template>
  <div class="bg-gray-50 text-shadow-400 flex w-full h-full p-36">
    <h1 v-if="loading" class="block text-3xl m-auto">Redirecting...</h1>
    <div v-if="!loading" class="block text-3xl m-auto">Link Not Found</div>
  </div>
</template>

<script>
import config from '../utils/config'
import msgHandler from '../utils/msgHandler'
import connection from '../utils/connection'
export default {

  data() {
    return {
      loading: true,
    }
  },

  async mounted () {
    const sn = this.$route.params.shortname
    if (!sn) {
      this.loading = false
      return
    }
    this.config = config.getConfig('juno_testnet')
    // this.config = config.getConfig('stargaze_testnet')
    this.domain = `${this.config.addressPrefix || 'juno'}`
    this.querier = await connection.getQueryClient(this.config)

    // immediately query link, then redirect if any found.
    let msg = msgHandler.getLink(sn)

    try {
      const res = await this.querier.queryContractSmart(this.config.contractAddress, msg)
      // returns a web URL to move to
      if (res && res.length > "http://a.bc".length) {
        window.open(res, '_self')
        return;
      }
    } catch (e) {
    }
    this.loading = false
  }
}
</script>
