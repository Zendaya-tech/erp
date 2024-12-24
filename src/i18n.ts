import { createI18n } from 'vue-i18n'

// Import translation files
import en from './locales/en.json'
import fr from './locales/fr.json'
import sw from './locales/sw.json'

// Configure i18n
export const i18n = createI18n({
  locale: localStorage.getItem('appLanguage') || 'fr', // Default language is French
  fallbackLocale: 'en',
  messages: {
    en,
    fr,
    sw,
  },
})
