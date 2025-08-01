import './assets/main.css'
import 'primevue/resources/themes/aura/theme.css' // Importa tema corretamente
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.component('Toast', Toast)
app.use(ToastService)
app.use(pinia)
app.use(router)
app.use(PrimeVue)

app.mount('#app')
