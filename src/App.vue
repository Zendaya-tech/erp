<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <Sidebar />
    <div class="absolute ml-64 w-[calc(100%-256px)] h-full flex flex-col">
      <!-- Notifications -->
      <NotificationToast />
      
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-primary-100 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h2 class="text-xl font-semibold text-primary-900">
            {{ currentPageTitle }}
          </h2>
          <nav class="flex space-x-2">
            <button 
              v-for="breadcrumb in breadcrumbs" 
              :key="breadcrumb.path"
              @click="$router.push(breadcrumb.path)"
              class="text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              {{ breadcrumb.name }}
              <span v-if="!breadcrumb.isLast" class="mx-2 text-primary-400">/</span>
            </button>
          </nav>
        </div>
        
        <div class="flex items-center space-x-4">
          <NotificationBell />

          <!-- Settings -->
          <button 
            @click="$router.push('/settings')"
            class="p-2 text-primary-600 hover:bg-primary-50 rounded-full"
          >
            <Cog6ToothIcon class="w-6 h-6" />
          </button>

          <!-- Theme Toggle -->
          <button 
            @click="themeStore.toggleTheme"
            class="p-2 text-primary-600 hover:bg-primary-50 rounded-full dark:text-primary-400 dark:hover:bg-gray-700"
          >
            <SunIcon v-if="themeStore.isDark" class="w-6 h-6" />
            <MoonIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import NotificationBell from './components/ui/NotificationBell.vue'
import NotificationToast from './components/ui/NotificationToast.vue'
import {
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/vue/24/outline'
import { useThemeStore } from './stores/theme'
import { useAppStore } from './stores/app'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const themeStore = useThemeStore()
const appStore = useAppStore()
const { t } = useI18n()

onMounted(() => {
  appStore.loadConfig()
})

// Computed
const currentPageTitle = computed(() => {
  const routeTitles: Record<string, string> = {
    '/': t('nav.dashboard'),
    '/inventory': t('nav.inventory'),
    '/planning': t('nav.planning'),
    '/clients': t('nav.clients'),
    '/sales': t('nav.sales'),
    '/hr': t('nav.hr'),
    '/settings': t('nav.settings')
  }
  return routeTitles[route.path] || ''
})

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return [
    { name: t('nav.home'), path: '/', isLast: paths.length === 0 },
    ...paths.map((path, index) => ({
      name: t(`nav.${path}`),
      path: '/' + paths.slice(0, index + 1).join('/'),
      isLast: index === paths.length - 1
    }))
  ]
})
</script>

<style>
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg shadow-md 
         hover:bg-primary-700 transition-colors duration-200
         dark:bg-primary-500/90 dark:hover:bg-primary-500 
         dark:shadow-primary-900/20;
}

.btn-secondary {
  @apply px-4 py-2 bg-primary-100 text-primary-700 rounded-lg shadow-md 
         hover:bg-primary-200 transition-colors duration-200
         dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 
         dark:border dark:border-gray-600;
}

.input-primary {
  @apply px-4 py-2 border border-primary-200 rounded-lg focus:ring-2 
         focus:ring-primary-500 focus:border-transparent outline-none;
}

.card {
  @apply bg-white p-6 rounded-xl shadow-md border border-primary-100
         dark:bg-gray-800/50 dark:border-gray-700/50 
         dark:backdrop-blur-sm dark:shadow-lg dark:shadow-gray-900/30;
}

.title {
  @apply text-2xl font-bold text-primary-700 mb-6
         dark:text-primary-300;
}

.subtitle {
  @apply text-lg font-semibold text-primary-600 mb-4
         dark:text-primary-400;
}

/* Table styles */
.table-container {
  @apply overflow-x-auto shadow-md rounded-lg border border-primary-100
         dark:border-gray-700/50 dark:shadow-lg dark:shadow-gray-900/20;
}

.table-primary {
  @apply min-w-full bg-white dark:bg-gray-800/90;
}

.table-primary thead {
  @apply bg-primary-50 dark:bg-gray-900/90 
         dark:border-b dark:border-gray-700/50;
}

.table-primary th {
  @apply px-6 py-4 text-left text-sm font-semibold text-primary-900
         dark:text-primary-300 dark:font-medium;
}

.table-primary th > div {
  @apply flex items-center space-x-2 hover:text-primary-700 transition-colors duration-200;
}

.table-primary td {
  @apply px-6 py-4 text-sm text-gray-700
         dark:text-gray-300 dark:border-gray-700/50;
}

.table-primary tbody tr:hover {
  @apply bg-primary-50 dark:bg-gray-700/50 
         transition-colors duration-150;
}

/* List styles */
.list-container {
  @apply space-y-2 rounded-lg;
}

.list-item {
  @apply flex items-center justify-between p-4 bg-white rounded-lg border border-primary-100
         hover:border-primary-300 hover:shadow-md transition-all duration-200;
}

/* Card styles */
.stats-card {
  @apply bg-white p-6 rounded-xl shadow-md border border-primary-100
         dark:bg-gray-800/50 dark:border-gray-700/50 
         dark:backdrop-blur-sm dark:shadow-lg dark:shadow-gray-900/30
         hover:shadow-lg transition-shadow duration-200;
}

/* Button styles */
.btn-icon {
  @apply p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-edit {
  @apply btn-icon bg-yellow-100 text-yellow-600 hover:bg-yellow-200 focus:ring-yellow-500;
}

.btn-delete {
  @apply btn-icon bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500;
}

.btn-view {
  @apply btn-icon bg-primary-100 text-primary-600 hover:bg-primary-200 focus:ring-primary-500;
}

/* Form styles */
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-primary-700 mb-1;
}

.form-input {
  @apply w-full px-4 py-2.5 border border-primary-200 rounded-lg bg-white
         focus:ring-2 focus:ring-primary-500 focus:border-transparent
         placeholder-gray-400 shadow-sm
         dark:bg-gray-800/90 dark:text-gray-200 
         dark:border-gray-600/50 dark:focus:border-primary-500
         dark:placeholder-gray-500 dark:shadow-inner
         dark:focus:bg-gray-800;
}

.form-select {
  @apply w-full px-4 py-2.5 border border-primary-200 rounded-lg bg-white
         focus:ring-2 focus:ring-primary-500 focus:border-transparent
         shadow-sm cursor-pointer
         dark:bg-gray-800/90 dark:text-gray-200 
         dark:border-gray-600/50 dark:focus:border-primary-500
         dark:shadow-inner dark:focus:bg-gray-800;

  &:disabled {
    @apply bg-gray-100 cursor-not-allowed
           dark:bg-gray-800/50 dark:text-gray-500;
  }
}

/* Modal improvements */
.modal-overlay {
  @apply fixed inset-0 bg-black/50 dark:bg-black/70 
         backdrop-blur-sm flex items-center justify-center z-50;
}

.modal-content {
  @apply bg-white dark:bg-gray-800/90 rounded-lg p-6 
         shadow-xl dark:shadow-gray-900/50 
         border border-gray-200 dark:border-gray-700/50
         w-full max-w-md;
}

/* Checkbox styles */
.form-checkbox {
  @apply rounded border-2 border-primary-300 text-primary-500
         focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
         dark:border-primary-600 dark:bg-gray-700
         dark:focus:ring-offset-gray-800
         transition-colors duration-200;
}

/* Custom checkbox animation */
@keyframes checkbox-check {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.checkbox-animation {
  animation: checkbox-check 0.2s ease-in-out;
}
</style>
