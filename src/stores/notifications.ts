import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './app'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  persistent?: boolean
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const appStore = useAppStore()

  const add = (notification: Omit<Notification, 'id'>) => {
    // Vérifier si les notifications sont activées pour ce type
    const notifType = getNotificationType(notification.type)
    if (!appStore.config.notifications[notifType]) {
      return
    }

    const id = Math.random().toString(36).substring(2)
    const newNotification = {
      id,
      duration: 5000, // Durée par défaut: 5 secondes
      persistent: false,
      ...notification
    }

    notifications.value.push(newNotification)

    if (!newNotification.persistent) {
      setTimeout(() => {
        remove(id)
      }, newNotification.duration)
    }

    // Jouer un son si activé dans les paramètres
    playNotificationSound(notification.type)
  }

  const remove = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clear = () => {
    notifications.value = []
  }

  // Helpers
  const getNotificationType = (type: Notification['type']): keyof typeof appStore.config.notifications => {
    switch (type) {
      case 'warning':
        return 'lowStock'
      case 'success':
        return 'newSale'
      case 'info':
        return 'reports'
      default:
        return 'newSale'
    }
  }

  const playNotificationSound = (type: Notification['type']) => {
    // Implémenter les sons de notification si nécessaire
    const audio = new Audio(`/sounds/${type}.mp3`)
    audio.play().catch(() => {
      // Gérer l'erreur silencieusement si l'autoplay est bloqué
    })
  }

  return {
    notifications,
    add,
    remove,
    clear
  }
}) 