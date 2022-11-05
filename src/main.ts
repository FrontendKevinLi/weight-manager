import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './firebase'

import App from './App.vue'
import router from './router'
import '@/style/index.scss'

const app = createApp(App)
const pinia = createPinia()
app.use(router).use(pinia).mount('#app')
