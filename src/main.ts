import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/style/index.scss'

createApp(App).use(store).use(router).mount('#app')

const a = true
if (a) {
  console.log(1)
}
