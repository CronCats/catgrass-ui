<template>
  <div class="">
    <div @click="openSearch" class="cursor-pointer">
      <MagnifyingGlassIcon class="inline h-6 w-6" />
    </div>

    <div class="z-0 p-1" :class="{'fixed top-0 left-0 right-0 bottom-0 z-50': open, 'hidden': !open}">
      <div @click="close()" class="fixed top-0 left-0 right-0 bottom-0 z-10 p-8 bg-green-100 opacity-80" />
      <div class="relative z-20 w-full md:w-1/2 mx-auto">
        <input type="text" autocomplete="off" autofocus="on" name="query" id="query" v-model="query" placeholder="Search by alias or address..." minlength="0" maxlength="100" class="w-full mt-1 focus:ring-green-500 focus:border-green-500 block p-4 shadow-sm sm:text-sm border-gray-300 rounded-md placeholder:text-gray-200 text-gray-800" />
        <button @click="close()" type="button" class="absolute top-0.5 right-0 p-2 z-20">
          <XMarkIcon class="h-8 w-8 text-gray-700 hover:text-gray-900" />
        </button>

        <div>
          <div v-if="loading" class="w-full mt-1 block p-4 shadow-sm sm:text-sm bg-white border-gray-300 rounded-md text-gray-800">
            🕵️‍♀️ Looking ...
          </div>
          <div v-if="!loading && results.length <= 0 && query.length > 0" class="w-full mt-1 block p-4 shadow-sm sm:text-sm bg-white border-gray-300 rounded-md text-gray-800">
            😖 No results found
          </div>

          <div v-if="!loading && results.length > 0">
            <div v-for="item in results" :key="item.owner" @click.prevent="goToSearchResult(item)" class="w-full mt-1 flex p-4 cursor-pointer shadow-sm hover:shadow-md sm:text-sm bg-white border-gray-300 rounded-md text-gray-800">
              <AtSymbolIcon v-if="item.type == 'alias'" class="inline my-auto h-4 w-4 mr-1" />
              <LinkIcon v-if="item.type == 'link'" class="inline my-auto h-4 w-4 mr-1" />
              <div class="w-full" v-html="formatRecord(item.shortname)"></div>
              <ArrowRightIcon class="inline my-auto h-5 w-5 text-gray-200" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
// import config from '../utils/config'
// import msgHandler from '../utils/msgHandler'
// import connection from '../utils/connection'
import {
  MagnifyingGlassIcon,
  AtSymbolIcon,
  ArrowRightIcon,
  XMarkIcon,
  LinkIcon,
} from '@heroicons/vue/24/outline'

export default {

  data() {
    return {
      domain: '.juno',
      config: null,
      querier: null,
      timer: null,

      open: false,
      loading: false,
      query: '',
      results: [],
    }
  },

  components: {
    AtSymbolIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    LinkIcon,
  },

  // methods: {
  //   openSearch() {
  //     this.open = true
  //   },
  //   close() {
  //     this.open = false
  //     this.loading = false
  //     this.query = ''
  //     this.results = []
  //   },

  //   formatRecord(str) {
  //     return `${str}`.replace(this.query, `<b>${this.query}</b>`)
  //   },

  //   goToSearchResult(item) {
  //     if (item && item.type === 'alias') {
  //       this.$router.push(`/${item.url}`)
  //       this.close()
  //     }
  //     if (item && item.type === 'link') {
  //       this.close()
  //       window.open(`${item.url}`, '_blank')
  //     }
  //   },

  //   debounce() {
  //     clearTimeout(this.timer)
  //     this.timer = setTimeout(() => { this.search() }, 300)
  //   },

  //   async search() {
  //     if (!this.query || !this.query.length) return
  //     this.loading = true
  //     this.results = []
  //     const q = `${this.query}`
  //     let msg = msgHandler.search(q)

  //     try {
  //       const res = await this.querier.queryContractSmart(this.config.contractAddress, msg)
  //       // Gets a double list of alias's & links: { alias: [],  links: [] }
  //       let results = []
  //       if (res && res.alias && res.alias.length > 0) results = results.concat(res.alias.map(a => ({ type: 'alias', shortname: a, url: a })))
  //       if (res && res.links && res.links.length > 0) results = results.concat(res.links.map(l => ({ type: 'link', ...l })))
  //       this.results = results
  //     } catch (e) {
  //     }

  //     this.loading = false
  //   },
  // },

  // async mounted() {
  //   this.config = config.getConfig('juno_testnet')
  //   // this.config = config.getConfig('stargaze_testnet')
  //   this.domain = `${this.config.addressPrefix || 'juno'}`
  //   this.querier = await connection.getQueryClient(this.config)
  // },

  // watch: {
  //   'query': ['debounce'],
  // },
}
</script>
