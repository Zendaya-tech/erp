import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  const isDark = ref(theme.value === 'dark')

  watch(theme, (newTheme) => {
    localStorage.setItem('theme', newTheme)
    isDark.value = newTheme === 'dark'
    updateTheme()
  })

  function updateTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
  }

  // Initialize theme
  updateTheme()

  return {
    theme,
    isDark,
    toggleTheme
  }
}) 