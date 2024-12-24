<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-x-full opacity-0"
    enter-to-class="transform translate-x-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-x-0 opacity-100"
    leave-to-class="transform translate-x-full opacity-0"
    class="fixed top-4 right-4 z-50 space-y-4 max-w-md w-full"
  >
    <div
      v-for="notification in notificationStore.notifications"
      :key="notification.id"
      :class="[
        'rounded-lg shadow-lg border p-4 flex items-start gap-3',
        'transform transition-all duration-300',
        typeStyles[notification.type].wrapper
      ]"
    >
      <!-- Icon -->
      <component 
        :is="typeStyles[notification.type].icon" 
        :class="['w-5 h-5', typeStyles[notification.type].icon]"
      />

      <!-- Content -->
      <div class="flex-1 pt-0.5">
        <p :class="['text-sm font-medium', typeStyles[notification.type].text]">
          {{ notification.message }}
        </p>
      </div>

      <!-- Close Button -->
      <button
        @click="notificationStore.remove(notification.id)"
        class="text-gray-400 hover:text-gray-500 focus:outline-none
               focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
               rounded-full p-1 transition-colors duration-200"
      >
        <XMarkIcon class="w-4 h-4" />
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const notificationStore = useNotificationStore()

const typeStyles = {
  success: {
    wrapper: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    icon: CheckCircleIcon,
    iconColor: 'text-green-500 dark:text-green-400',
    text: 'text-green-800 dark:text-green-200'
  },
  error: {
    wrapper: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    icon: XCircleIcon,
    iconColor: 'text-red-500 dark:text-red-400',
    text: 'text-red-800 dark:text-red-200'
  },
  warning: {
    wrapper: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    text: 'text-yellow-800 dark:text-yellow-200'
  },
  info: {
    wrapper: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
    icon: InformationCircleIcon,
    iconColor: 'text-blue-500 dark:text-blue-400',
    text: 'text-blue-800 dark:text-blue-200'
  }
}
</script> 