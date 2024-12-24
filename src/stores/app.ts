import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface AppConfig {
  businessName: string
  businessDescription: string
  logo?: string
  currency: string
  language: string
  notifications: {
    push: boolean
    email: boolean
    stock: boolean
    sales: boolean
  }
}

export const useAppStore = defineStore('app', () => {
  const config = ref<AppConfig>({
    businessName: '',
    businessDescription: '',
    logo: undefined,
    currency: 'EUR',
    language: 'fr',
    notifications: {
      push: true,
      email: true,
      stock: true,
      sales: true,
    }
  })

  // Load config from localStorage
  const loadConfig = () => {
    const savedConfig = localStorage.getItem('appConfig')
    if (savedConfig) {
      config.value = JSON.parse(savedConfig)
    }
  }

  // Watch for changes and save to localStorage
  watch(
    config,
    (newConfig) => {
      localStorage.setItem('appConfig', JSON.stringify(newConfig))
    },
    { deep: true }
  )

  // Initialize
  loadConfig()

  return {
    config,
    loadConfig
  }
}) 