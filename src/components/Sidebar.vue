<template>
  <aside class="fixed w-64 h-full bg-white dark:bg-gray-900 border-r border-primary-100 dark:border-gray-700 shadow-lg">
    <div class="p-6 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,theme(colors.white)_1px,transparent_0)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]">
        </div>
      </div>
      <div class="relative flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
          <SparklesIcon class="w-6 h-6 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-white">{{ t('app.name') }}</h1>
      </div>
    </div>
    <nav class="p-4 space-y-1">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 hover:bg-primary-50 dark:hover:bg-gray-800 group relative overflow-hidden"
        :class="[
          $route.path === item.path 
            ? 'bg-primary-600 text-white font-medium shadow-md dark:bg-primary-900' 
            : 'text-gray-700 dark:text-gray-300'
        ]"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000">
        </div>
        <component
          :is="item.icon"
          class="w-5 h-5 mr-3"
          :class="$route.path === item.path 
            ? 'text-white' 
            : 'text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300'"
        />
        <span class="relative">{{ t(item.label) }}</span>
        <div v-if="$route.path === item.path" 
             class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full">
        </div>
      </router-link>
    </nav>
    <div class="absolute bottom-0 left-0 right-0 p-4">
      <div class="px-4 py-3 rounded-lg bg-primary-50 dark:bg-gray-800 text-sm">
        <p class="text-primary-600 dark:text-primary-400 font-medium">{{ t('app.version') }}</p>
        <p class="text-gray-600 dark:text-gray-400 mt-1">{{ t('app.description') }}</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  ChartBarIcon,
  CubeIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyEuroIcon,
  UserGroupIcon,
  CogIcon,
  TruckIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface MenuItem {
  name: string
  label: string
  path: string
  icon: any
}

const menuItems: MenuItem[] = [
  { 
    name: 'Dashboard', 
    label: 'nav.dashboard',
    path: '/', 
    icon: ChartBarIcon 
  },
  { 
    name: 'Inventory', 
    label: 'nav.inventory',
    path: '/inventory', 
    icon: CubeIcon 
  },
  { 
    name: 'Orders', 
    label: 'nav.orders',
    path: '/orders', 
    icon: TruckIcon 
  },
  { 
    name: 'Planning', 
    label: 'nav.planning',
    path: '/planning', 
    icon: CalendarIcon 
  },
  { 
    name: 'Clients', 
    label: 'nav.clients',
    path: '/clients', 
    icon: UsersIcon 
  },
  { 
    name: 'Sales', 
    label: 'nav.sales',
    path: '/sales', 
    icon: CurrencyEuroIcon 
  },
  { 
    name: 'HR', 
    label: 'nav.hr',
    path: '/hr', 
    icon: UserGroupIcon 
  },
  { 
    name: 'Settings', 
    label: 'nav.settings',
    path: '/settings', 
    icon: CogIcon 
  },
]
</script>
