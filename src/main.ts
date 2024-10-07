import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

const app = createApp(App)

app.use(createVuetify())
app.use(createPinia())
app.use(router)

app.mount('#app')
