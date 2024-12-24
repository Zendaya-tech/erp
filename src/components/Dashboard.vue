<template>
  <div>
    <h1 class="title">Tableau de Bord</h1>

    <!-- Zendaya Story Banner -->
    <div class="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-purple-600 to-primary-600 dark:from-purple-800 dark:to-primary-800">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative p-8 text-white">
        <div class="max-w-3xl">
          <h1 class="text-3xl font-bold mb-4">{{ t('dashboard.story.welcome') }}</h1>
          <p class="text-lg mb-6">{{ t('dashboard.story.description') }}</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-white/20 dark:bg-white/10 p-2 flex items-center justify-center">
              <SparklesIcon class="w-8 h-8 text-white" />
            </div>
            <div>
              <p class="font-medium">Zendaya</p>
              <p class="text-sm text-white/90 dark:text-white/80">{{ t('dashboard.story.tagline') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Products Showcase -->
    <div class="card mb-8">
      <h2 class="subtitle mb-4">{{ t('dashboard.products.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="product in featuredProducts" :key="product.id" 
             class="relative group overflow-hidden rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800/50 dark:to-gray-700/50 p-6 dark:border dark:border-gray-700"
        >
          <div class="flex flex-col h-full">
            <div class="flex items-center justify-center mb-4">
              <component :is="product.icon" class="w-12 h-12 text-primary-600 dark:text-primary-300" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium dark:text-white">{{ product.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-200 mt-2">{{ product.description }}</p>
              <div class="mt-4 flex justify-between items-center">
                <span class="text-xs bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-200 px-2 py-1 rounded">
                  {{ t('dashboard.products.comingSoon') }}
                </span>
                <button class="text-sm text-primary-600 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200">
                  {{ t('dashboard.products.learnMore') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="stat in stats" 
        :key="stat.label" 
        class="bg-white dark:bg-gray-800/80 rounded-xl p-6 shadow-sm hover:shadow-md
               transition-all duration-300 border border-gray-100 dark:border-gray-700
               relative overflow-hidden group"
      >
        <!-- Background Gradient -->
        <div 
          :class="`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300
                    bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600`"
        />

        <!-- Content -->
        <div class="relative">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ stat.label }}
            </p>
            <div :class="`text-${stat.color}-500 dark:text-${stat.color}-400`">
              <component :is="stat.icon" class="w-6 h-6" />
            </div>
          </div>

          <!-- Value -->
          <div class="space-y-2">
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ typeof stat.value === 'number' ? stat.value.toLocaleString('fr-FR') : stat.value }}
            </p>
            
            <!-- Trend -->
            <div class="flex items-center space-x-2">
              <div 
                :class="[
                  'flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  stat.trend > 0 
                    ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                ]"
              >
                <span class="mr-1">
                  {{ stat.trend > 0 ? '↑' : '↓' }}
                </span>
                {{ Math.abs(stat.trend) }}%
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                vs mois précédent
              </span>
            </div>
          </div>
        </div>

        <!-- Hover Effect Border -->
        <div 
          :class="`absolute inset-x-0 bottom-0 h-1 bg-${stat.color}-500
                   transform scale-x-0 group-hover:scale-x-100
                   transition-transform duration-300 origin-left`"
        />
      </div>
    </div>

    <!-- Chart Controls -->
    <div class="card mb-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-4">
          <button
            v-for="option in chartOptions"
            :key="option.value"
            @click="activeChart = option.value"
            class="btn-secondary"
            :class="{ 'bg-primary-600 text-white': activeChart === option.value }"
          >
            {{ option.label }}
          </button>
        </div>
        
        <div class="flex items-center space-x-4">
          <select v-model="timeRange" class="form-select w-40">
            <option value="day">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      <!-- Sales Chart -->
      <div class="mt-6 h-[400px]">
        <canvas id="salesChart"></canvas>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Sales -->
      <div class="card dark:bg-gray-800/50">
        <h2 class="subtitle mb-4 dark:text-white">{{ t('dashboard.recentSales.title') }}</h2>
        <div class="space-y-4">
          <div v-for="sale in recentSales" :key="sale.id" 
              class="list-item dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:border-gray-700"
          >
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <ShoppingCartIcon class="w-6 h-6 text-primary-600 dark:text-primary-300" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ sale.client }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(sale.date) }} • 
                  <span class="dark:text-primary-300">
                    {{ sale.products.length }} {{ t('common.products') }}
                  </span>
                </p>
              </div>
            </div>
            <div class="text-lg font-semibold text-primary-600 dark:text-primary-300">
              {{ formatPrice(sale.totalPrice) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Alert -->
      <div class="card dark:bg-gray-800/50">
        <h2 class="subtitle mb-4 dark:text-white">{{ t('dashboard.stockAlerts.title') }}</h2>
        <div class="space-y-4">
          <div v-for="product in lowStockProducts" :key="product.id" 
              class="list-item dark:bg-gray-800/80 dark:hover:bg-gray-800 dark:border-gray-700 relative"
          >
            <!-- Alert Indicator -->
            <div class="absolute -left-0.5 top-0 bottom-0 w-1 bg-red-500 dark:bg-red-600 rounded-l"></div>
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ product.name }}</p>
                <p class="text-sm text-red-500 dark:text-red-400">
                  {{ t('dashboard.stockAlerts.lowStock') }} : 
                  <span class="font-medium">{{ product.quantity }}</span> 
                  {{ t('dashboard.stockAlerts.units') }}
                </p>
              </div>
            </div>
            <button 
              @click="openOrderModal(product)"
              class="btn-primary dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-500
                     transition-colors duration-200"
            >
              {{ t('dashboard.stockAlerts.reorder') }}
            </button>
          </div>
         
          <!-- Empty State -->
          <div v-if="lowStockProducts.length === 0" 
               class="text-center py-8 text-gray-500 dark:text-gray-400"
          >
            <CheckCircleIcon class="w-12 h-12 mx-auto mb-3 text-green-500 dark:text-green-400" />
            <p>{{ t('dashboard.stockAlerts.noAlerts') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Order Modal -->
    <div v-if="showOrderModal" class="modal-overlay">
      <div class="modal-content dark:bg-gray-800 dark:border dark:border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold dark:text-white">{{ t('orders.modal.title') }}</h2>
          <button @click="closeOrderModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Product Info -->
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 class="font-medium mb-2">{{ selectedProduct?.name }}</h3>
            <p class="text-sm text-gray-500">
              {{ t('inventory.table.quantity') }}: {{ selectedProduct?.quantity }}
            </p>
          </div>

          <!-- Order Form -->
          <div class="form-group">
            <label class="form-label">{{ t('orders.form.quantity') }}</label>
            <input 
              v-model.number="orderQuantity"
              type="number"
              class="form-input"
              min="1"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.supplier') }}</label>
            <input 
              v-model="orderSupplier"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.expectedDelivery') }}</label>
            <input 
              v-model="orderDeliveryDate"
              type="date"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.notes') }}</label>
            <textarea 
              v-model="orderNotes"
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <!-- Total -->
          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ t('orders.form.total') }}</span>
              <span class="text-xl font-bold">
                {{ formatPrice(orderQuantity * (selectedProduct?.price || 0)) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button @click="closeOrderModal" class="btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="createOrder" class="btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Chart } from 'chart.js/auto'
import {
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  CurrencyEuroIcon,
  UsersIcon,
  ArchiveBoxIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  CloudIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
import { getStocksFromDB, getSalesFromDB, addOrderToDB } from '../utils/db'
import type { Sale, Product, Order } from '../types'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '../stores/notifications'

const { t } = useI18n()
const notificationStore = useNotificationStore()

// State
const stats = ref([
  { 
    label: 'Ventes Totales',
    value: '0 €',
    icon: CurrencyEuroIcon,
    color: 'green',
    trend: 0
  },
  { 
    label: 'Nouveaux Clients',
    value: 0,
    icon: UsersIcon,
    color: 'blue',
    trend: 0
  },
  { 
    label: 'Produits en Stock',
    value: 0,
    icon: ArchiveBoxIcon,
    color: 'yellow',
    trend: 0
  },
  { 
    label: 'Commandes en Attente',
    value: 0,
    icon: ClockIcon,
    color: 'purple',
    trend: 0
  }
])

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0,0,0,0.1)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
} as const

const timeRange = ref('month')
const activeChart = ref('quantity')
const recentSales = ref<Sale[]>([])
const lowStockProducts = ref<Product[]>([])

// Chart instance
let chartInstance: Chart | null = null

// Order Modal State
const showOrderModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const orderQuantity = ref(1)
const orderSupplier = ref('')
const orderDeliveryDate = ref('')
const orderNotes = ref('')

// Computed
const filteredSales = computed(() => {
  const now = new Date()
  return recentSales.value.filter(sale => {
    const saleDate = new Date(sale.date)
    switch (timeRange.value) {
      case 'day':
        return saleDate.toDateString() === now.toDateString()
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7))
        return saleDate >= weekAgo
      case 'month':
        return saleDate.getMonth() === now.getMonth()
      case 'year':
        return saleDate.getFullYear() === now.getFullYear()
      default:
        return true
    }
  })
})

// Computed pour calculer les tendances
const calculateTrend = (currentValue: number, previousValue: number): number => {
  if (previousValue === 0) return 0
  return Number((((currentValue - previousValue) / previousValue) * 100).toFixed(1))
}

const getStatsForPeriod = (sales: Sale[], startDate: Date, endDate: Date) => {
  return sales.filter(sale => {
    const saleDate = new Date(sale.date)
    return saleDate >= startDate && saleDate <= endDate
  })
}

// Methods
const fetchData = async () => {
  const [sales, stocks] = await Promise.all([
    getSalesFromDB(),
    getStocksFromDB()
  ])

  // Calcul des périodes
  const now = new Date()
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const currentMonthSales = getStatsForPeriod(sales, currentMonth, now)
  const previousMonthSales = getStatsForPeriod(sales, previousMonth, lastDayPreviousMonth)

  // Calcul des valeurs actuelles et précédentes
  const currentTotalSales = currentMonthSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  const previousTotalSales = previousMonthSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  
  const currentUniqueClients = new Set(currentMonthSales.map(sale => sale.client)).size
  const previousUniqueClients = new Set(previousMonthSales.map(sale => sale.client)).size

  const lowStockCount = stocks.filter(product => product.quantity < 10).length
  const previousLowStockCount = stocks.filter(product => product.quantity < 20).length

  // Mise à jour des stats avec les tendances
  stats.value[0].value = `${currentTotalSales.toLocaleString('fr-FR')} €`
  stats.value[0].trend = calculateTrend(currentTotalSales, previousTotalSales)

  stats.value[1].value = currentUniqueClients
  stats.value[1].trend = calculateTrend(currentUniqueClients, previousUniqueClients)

  stats.value[2].value = stocks.length
  stats.value[2].trend = calculateTrend(stocks.length, stocks.length) // À adapter selon vos besoins

  stats.value[3].value = lowStockCount
  stats.value[3].trend = calculateTrend(lowStockCount, previousLowStockCount)

  // Mise à jour des autres données
  recentSales.value = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  lowStockProducts.value = stocks.filter(product => 
    product.quantity > -1 && 
    !product.isService && 
    product.quantity < 10
  )
  .sort((a, b) => a.quantity - b.quantity)

  renderChart()
}

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = document.getElementById('salesChart') as HTMLCanvasElement
  if (!ctx) return

  const labels = getSalesChartLabels()
  const data = activeChart.value === 'quantity' ? getSalesChartData() : getSalesAmountData()

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: activeChart.value === 'quantity' ? 'Nombre de ventes' : 'Montant des ventes (€)',
        data,
        borderColor: '#7e22ce',
        backgroundColor: 'rgba(126, 34, 206, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            display: true,
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  })
}

const getSalesChartLabels = () => {
  const labels = []
  const now = new Date()
  
  switch (timeRange.value) {
    case 'day':
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}h`)
      }
      break
    case 'week':
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        labels.push(days[d.getDay()])
      }
      break
    case 'month':
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        labels.push(`${i}`)
      }
      break
    case 'year':
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
      labels.push(...months)
      break
  }
  return labels
}

const getSalesChartData = () => {
  const data = new Array(getSalesChartLabels().length).fill(0)
  
  filteredSales.value.forEach(sale => {
    const date = new Date(sale.date)
    let index = 0
    
    switch (timeRange.value) {
      case 'day':
        index = date.getHours()
        break
      case 'week':
        index = 6 - Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        break
      case 'month':
        index = date.getDate() - 1
        break
      case 'year':
        index = date.getMonth()
        break
    }
    
    if (index >= 0 && index < data.length) {
      data[index] += 1
    }
  })
  
  return data
}

const getSalesAmountData = () => {
  const data = new Array(getSalesChartLabels().length).fill(0)
  
  filteredSales.value.forEach(sale => {
    const date = new Date(sale.date)
    let index = 0
    
    switch (timeRange.value) {
      case 'day':
        index = date.getHours()
        break
      case 'week':
        index = 6 - Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
        break
      case 'month':
        index = date.getDate() - 1
        break
      case 'year':
        index = date.getMonth()
        break
    }
    
    if (index >= 0 && index < data.length) {
      data[index] += sale.totalPrice
    }
  })
  
  return data
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const openOrderModal = (product: Product) => {
  if (product.quantity === -1 || product.isService) {
    notificationStore.add({
      type: 'error',
      message: t('orders.validation.cannotOrder')
    })
    return
  }
  
  selectedProduct.value = product
  orderQuantity.value = Math.max(10, product.quantity * 2) // Suggestion de quantité
  showOrderModal.value = true
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedProduct.value = null
  orderQuantity.value = 1
  orderSupplier.value = ''
  orderDeliveryDate.value = ''
  orderNotes.value = ''
}

const createOrder = async () => {
  if (!selectedProduct.value || !orderQuantity.value) {
    alert(t('orders.validation.required'))
    return
  }

  if (selectedProduct.value.quantity === -1 || selectedProduct.value.isService) {
    notificationStore.add({
      type: 'error',
      message: t('orders.validation.cannotOrder')
    })
    return
  }

  try {
    const order: Omit<Order, 'id'> = {
      date: new Date().toISOString(),
      product: selectedProduct.value,
      quantity: orderQuantity.value,
      status: 'pending',
      totalPrice: orderQuantity.value * selectedProduct.value.price,
      supplier: orderSupplier.value,
      expectedDeliveryDate: orderDeliveryDate.value,
      notes: orderNotes.value
    }

    await addOrderToDB(order)
    notificationStore.add({
      type: 'success',
      message: t('orders.newOrder.success')
    })
    closeOrderModal()
  } catch (error) {
    console.error('Error creating order:', error)
    notificationStore.add({
      type: 'error',
      message: t('orders.newOrder.error')
    })
  }
}

// Watchers
watch([activeChart, timeRange], () => {
  renderChart()
})

// Initialize
onMounted(fetchData)

// Featured Products Data
const featuredProducts = ref([
  {
    id: 1,
    name: 'Z-Smart Analytics',
    description: t('dashboard.products.analytics'),
    icon: ChartBarIcon
  },
  {
    id: 2,
    name: 'Z-Mobile',
    description: t('dashboard.products.mobile'),
    icon: DevicePhoneMobileIcon
  },
  {
    id: 3,
    name: 'Z-Cloud',
    description: t('dashboard.products.cloud'),
    icon: CloudIcon
  }
])
</script>
