import { createApp } from "vue"
import App from "./App.vue"
import ElementPlus from "element-plus"
import "remixicon/fonts/remixicon.css"
import { onKeyStroke } from "@vueuse/core"
import "element-plus/dist/index.css"
import "./index.less"
import "@toast-ui/editor/dist/toastui-editor.css"

import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"

import router from "@/router"

onKeyStroke("Tab", e => {
  e.preventDefault()
})
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount("#app")
