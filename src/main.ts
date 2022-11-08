import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './firebase'

import App from './App.vue'
import router from './router'
import '@/style/index.scss'

const options: PluginOptions = {
  timeout: 3000,
}

const app = createApp(App)
const pinia = createPinia()
app
  .use(router)
  .use(pinia)
  .use(Toast, options)
  .mount('#app')
