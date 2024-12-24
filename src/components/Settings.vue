<template>
  <div>
    <h1 class="title">{{ t('settings.title') }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Application Settings -->
      <div class="card">
        <h2 class="subtitle">{{ t('settings.general.title') }}</h2>
        
        <!-- Theme Selection -->
        <div class="form-group">
          <label class="form-label">{{ t('settings.general.theme') }}</label>
          <div class="flex gap-4">
            <label 
              v-for="(themeOption, index) in themes" 
              :key="index"
              class="relative flex-1"
            >
              <input
                type="radio"
                :value="themeOption.value"
                v-model="themeStore.theme"
                class="sr-only peer"
              />
              <div class="p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                         peer-checked:border-primary-500 
                         peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20
                         hover:bg-gray-50 dark:hover:bg-gray-700
                         flex items-center justify-center gap-2
                         dark:border-gray-600"
              >
                <component :is="themeOption.icon" class="w-5 h-5" />
                <span class="dark:text-gray-300">{{ t(`settings.themes.${themeOption.value}`) }}</span>
              </div>
            </label>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ themeStore.isDark ? 
              t('settings.themes.darkDescription') : 
              t('settings.themes.lightDescription')
            }}
          </p>
        </div>

        <!-- Language Selection -->
        <div class="form-group">
          <label class="form-label">{{ t('settings.general.language') }}</label>
          <select v-model="appStore.config.language" class="form-select" @change="changeLanguage">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="sw">Swahili</option>
          </select>
        </div>

        <!-- Currency Selection -->
        <div class="form-group">
          <label class="form-label">{{ t('settings.general.currency') }}</label>
          <select v-model="appStore.config.currency" class="form-select">
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar ($)</option>
            <option value="GBP">Livre Sterling (£)</option>
          </select>
        </div>
      </div>

      <!-- Business Information -->
      <div class="card">
        <h2 class="subtitle">{{ t('settings.business.title') }}</h2>
        
        <!-- Business Logo -->
        <div class="form-group">
          <label class="form-label">{{ t('settings.business.logo.title') }}</label>
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 rounded-lg bg-primary-100 flex items-center justify-center">
              <PhotoIcon v-if="!appStore.config.logo" class="w-8 h-8 text-primary-400" />
              <img v-else :src="appStore.config.logo" alt="Logo" class="w-full h-full object-contain" />
            </div>
            <div class="flex-1">
              <input
                type="file"
                accept="image/*"
                @change="handleLogoUpload"
                class="hidden"
                ref="logoInput"
              />
              <button 
                @click="$refs.logoInput.click()"
                class="btn-secondary w-full mb-2"
              >
                {{ t('settings.business.logo.upload') }}
              </button>
              <button 
                v-if="appStore.config.logo"
                @click="removeLogo"
                class="btn-secondary w-full text-red-600 hover:bg-red-50"
              >
                {{ t('settings.business.logo.remove') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Business Name -->
        <div class="form-group">
          <label class="form-label">{{ t('settings.business.name') }}</label>
          <input
            v-model="appStore.config.businessName"
            type="text"
            class="form-input"
            placeholder="Nom de votre entreprise"
          />
        </div>

        <!-- Business Description -->
        <div class="form-group">
          <label class="form-label">{{ t('settings.business.description') }}</label>
          <textarea
            v-model="appStore.config.businessDescription"
            class="form-input min-h-[100px]"
            placeholder="Description de votre entreprise"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Notifications Settings -->
    <div class="card mt-8">
      <h2 class="subtitle">{{ t('settings.notifications.title') }}</h2>
      <div class="space-y-4">
        <div v-for="(notification, key) in notificationSettings" :key="key">
          <CustomCheckbox
            v-model="appStore.config.notifications[key]"
          >
            <span class="block text-sm font-medium text-gray-900">{{ t(`settings.notifications.${key}`) }}</span>
            <span class="block text-sm text-gray-500">{{ t(`settings.notifications.${key}Description`) }}</span>
          </CustomCheckbox>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-8 flex justify-end">
      <button @click="saveSettings" class="btn-primary">
        {{ t('settings.save') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '../stores/theme'
import { useAppStore } from '../stores/app'
import CustomCheckbox from './ui/CustomCheckbox.vue'
import { 
  SunIcon, 
  MoonIcon, 
  PhotoIcon,
  ComputerDesktopIcon,
} from '@heroicons/vue/24/outline'

const { t, locale } = useI18n()
const themeStore = useThemeStore()
const appStore = useAppStore()

const themes = [
  { 
    value: 'light', 
    icon: SunIcon,
  },
  { 
    value: 'dark', 
    icon: MoonIcon,
  },
  { 
    value: 'system', 
    icon: ComputerDesktopIcon,
  }
]

const notificationSettings = {
  email: {
  },
  push: {
  },
  stock: {
  },
  sales: {
  }
}

const saveSettings = () => {
  alert(t('settings.success'))
}

const changeLanguage = () => {
  locale.value = appStore.config.language
  localStorage.setItem('appLanguage', appStore.config.language)
}

const handleLogoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      appStore.config.logo = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeLogo = () => {
  appStore.config.logo = undefined
}

// Initialize
onMounted(() => {
  locale.value = appStore.config.language
})
</script>
