import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import fr from './locales/fr.json'
import en from './locales/en.json'
import sw from './locales/sw.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('appLanguage') || 'fr',
  fallbackLocale: 'fr',
  messages: {
    fr,
    en,
    sw
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')
