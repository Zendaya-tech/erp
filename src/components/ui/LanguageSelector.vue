<template>
  <div class="relative">
    <select
      v-model="currentLocale"
      @change="changeLanguage"
      class="form-select appearance-none pl-10 pr-10"
    >
      <option v-for="locale in availableLocales" :key="locale.code" :value="locale.code">
        {{ locale.name }}
      </option>
    </select>
    <GlobeAltIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
    <ChevronDownIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAppStore } from '@/stores/app'

const { locale } = useI18n()
const appStore = useAppStore()

const availableLocales = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' }
]

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
    appStore.config.language = value
  }
})

const changeLanguage = () => {
  localStorage.setItem('appLanguage', currentLocale.value)
}
</script> 