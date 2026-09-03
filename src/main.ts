import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/message/style/css'
import './styles/index.css'

import '@/mock/data.ts'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
useThemeStore(pinia)
// eslint-disable-next-line vue/multi-word-component-names
app.component('Icon', Icon)
app.mount('#app')
