import { createApp } from "vue";
import { createPinia } from "pinia";
import persistedstate from 'pinia-persistedstate';
import SecureLS from "secure-ls";
var ls = new SecureLS({ encodingType: 'aes' });

import { useMultiWallet } from "./stores/multiWallet";
import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);
const store = createPinia()

store.use(
  persistedstate({
    key: "litterbox", // so you're too disgusted to inspect it
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key)
    }
  })
)

app.use(store)
app.use(router);

const multiWallet = useMultiWallet()
multiWallet.init()


app.mount("#app");
