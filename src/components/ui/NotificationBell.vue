<template>
  <div class="relative">
    <!-- Bell Button -->
    <button 
      @click="isOpen = !isOpen"
      class="p-2 text-primary-600 hover:bg-primary-50 rounded-full relative
             dark:text-primary-400 dark:hover:bg-gray-700
             transition-colors duration-200"
      ref="buttonRef"
    >
      <BellIcon class="w-6 h-6" />
      <span 
        v-if="notificationStore.notifications.length" 
        class="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs 
               rounded-full flex items-center justify-center
               transform translate-x-1 -translate-y-1
               animate-pulse"
      >
        {{ notificationStore.notifications.length }}
      </span>
    </button>

    <!-- Notifications Popover -->
    <TransitionRoot
      :show="isOpen"
      enter="transition ease-out duration-200"
      enter-from="opacity-0 translate-y-1"
      enter-to="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leave-from="opacity-100 translate-y-0"
      leave-to="opacity-0 translate-y-1"
      @click.outside="isOpen = false"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 rounded-lg shadow-lg
               bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5
               border border-gray-200 dark:border-gray-700
               transform origin-top-right z-50"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ t('notifications.title') }}
            </h3>
            <button 
              v-if="notificationStore.notifications.length"
              @click="notificationStore.clear()"
              class="text-sm text-primary-600 hover:text-primary-800
                     dark:text-primary-400 dark:hover:text-primary-300"
            >
              {{ t('notifications.clearAll') }}
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div v-if="notificationStore.notifications.length === 0" 
               class="p-4 text-center text-gray-500 dark:text-gray-400">
            <BellSlashIcon class="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>{{ t('notifications.empty') }}</p>
          </div>

          <TransitionGroup
            enter="transition-all duration-300 ease-out"
            enter-from="opacity-0 -translate-x-4"
            enter-to="opacity-100 translate-x-0"
            leave="transition-all duration-200 ease-in"
            leave-from="opacity-100 translate-x-0"
            leave-to="opacity-0 translate-x-4"
          >
            <div
              v-for="notification in notificationStore.notifications"
              :key="notification.id"
              :class="[
                'p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50',
                'border-b border-gray-200 dark:border-gray-700',
                'transition-colors duration-200'
              ]"
            >
              <div class="flex gap-3">
                <component 
                  :is="typeStyles[notification.type].icon"
                  :class="['w-5 h-5 mt-0.5', typeStyles[notification.type].iconColor]"
                />
                <div class="flex-1 min-w-0">
                  <p :class="['text-sm font-medium', typeStyles[notification.type].text]">
                    {{ notification.message }}
                  </p>
                </div>
                <button
                  @click="notificationStore.remove(notification.id)"
                  class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TransitionRoot, TransitionGroup } from '@headlessui/vue'
import { useNotificationStore } from '@/stores/notifications'
import { useI18n } from 'vue-i18n'
import {
  BellIcon,
  BellSlashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const notificationStore = useNotificationStore()
const { t } = useI18n()
const isOpen = ref(false)

const typeStyles = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-500 dark:text-green-400',
    text: 'text-green-800 dark:text-green-200'
  },
  error: {
    icon: XCircleIcon,
    iconColor: 'text-red-500 dark:text-red-400',
    text: 'text-red-800 dark:text-red-200'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    text: 'text-yellow-800 dark:text-yellow-200'
  },
  info: {
    icon: InformationCircleIcon,
    iconColor: 'text-blue-500 dark:text-blue-400',
    text: 'text-blue-800 dark:text-blue-200'
  }
}
</script> 