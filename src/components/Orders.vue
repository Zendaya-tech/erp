<template>
  <div>
    <h1 class="title">{{ t('orders.title') }}</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ t('common.loading') }}</p>
    </div>

    <div v-else>
      <!-- Orders Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="stats-card">
          <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('orders.stats.pending') }}</h3>
          <div class="flex items-end justify-between">
            <span class="text-3xl font-bold text-primary-600">
              {{ pendingOrders.length }}
            </span>
            <div class="w-16 h-16 flex items-center justify-center text-primary-400">
              <ClockIcon class="w-10 h-10" />
            </div>
          </div>
        </div>

        <div class="stats-card">
          <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('orders.stats.confirmed') }}</h3>
          <div class="flex items-end justify-between">
            <span class="text-3xl font-bold text-primary-600">
              {{ confirmedOrders.length }}
            </span>
            <div class="w-16 h-16 flex items-center justify-center text-primary-400">
              <CheckCircleIcon class="w-10 h-10" />
            </div>
          </div>
        </div>

        <div class="stats-card">
          <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('orders.stats.delivered') }}</h3>
          <div class="flex items-end justify-between">
            <span class="text-3xl font-bold text-primary-600">
              {{ deliveredOrders.length }}
            </span>
            <div class="w-16 h-16 flex items-center justify-center text-primary-400">
              <TruckIcon class="w-10 h-10" />
            </div>
          </div>
        </div>

        <div class="stats-card">
          <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('orders.stats.cancelled') }}</h3>
          <div class="flex items-end justify-between">
            <span class="text-3xl font-bold text-primary-600">
              {{ cancelledOrders.length }}
            </span>
            <div class="w-16 h-16 flex items-center justify-center text-primary-400">
              <XCircleIcon class="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="card">
        <div class="flex justify-between items-center mb-6">
          <h2 class="subtitle">{{ t('orders.list.title') }}</h2>
          <button @click="showAddModal = true" class="btn-primary">
            <PlusIcon class="w-5 h-5 mr-2 inline-block" />
            {{ t('orders.actions.new') }}
          </button>
        </div>

        <div class="table-container">
          <table class="table-primary">
            <thead>
              <tr>
                <th>{{ t('orders.table.date') }}</th>
                <th>{{ t('orders.table.product') }}</th>
                <th>{{ t('orders.table.quantity') }}</th>
                <th>{{ t('orders.table.total') }}</th>
                <th>{{ t('orders.table.status') }}</th>
                <th>{{ t('orders.table.delivery') }}</th>
                <th>{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td>{{ formatDate(order.date) }}</td>
                <td>{{ order.product.name }}</td>
                <td>{{ order.quantity }}</td>
                <td>{{ formatPrice(order.totalPrice) }}</td>
                <td>
                  <span 
                    class="px-2 py-1 text-sm rounded-full"
                    :class="getStatusStyle(order.status)"
                  >
                    {{ t(`orders.status.${order.status}`) }}
                  </span>
                </td>
                <td>{{ order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : '-' }}</td>
                <td>
                  <div class="flex space-x-2">
                    <button 
                      @click="updateOrderStatus(order, 'confirmed')"
                      v-if="order.status === 'pending'"
                      class="btn-success"
                      :title="t('orders.actions.confirm')"
                    >
                      <CheckIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="updateOrderStatus(order, 'delivered')"
                      v-if="order.status === 'confirmed'"
                      class="btn-primary"
                      :title="t('orders.actions.deliver')"
                    >
                      <TruckIcon class="w-4 h-4" />
                    </button>
                    <button 
                      @click="updateOrderStatus(order, 'cancelled')"
                      v-if="['pending', 'confirmed'].includes(order.status)"
                      class="btn-delete"
                      :title="t('orders.actions.cancel')"
                    >
                      <XMarkIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Order Modal -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">{{ t('orders.modal.title') }}</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="form-group">
            <label class="form-label">{{ t('orders.form.product') }}</label>
            <select 
              v-model="newOrder.productId" 
              class="form-select" 
              @change="updatePrice"
              :class="{ 'border-red-500': formErrors.product }"
            >
              <option value="">{{ t('orders.form.selectProduct') }}</option>
              <option 
                v-for="product in products" 
                :key="product.id" 
                :value="product.id"
              >
                {{ product.name }} - {{ formatPrice(product.price) }}
              </option>
            </select>
            <p v-if="formErrors.product" class="text-red-500 text-sm mt-1">
              {{ formErrors.product }}
            </p>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.quantity') }}</label>
            <input 
              v-model.number="newOrder.quantity" 
              type="number" 
              class="form-input"
              min="1"
              @input="updatePrice"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.supplier') }}</label>
            <input 
              v-model="newOrder.supplier" 
              type="text" 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.expectedDelivery') }}</label>
            <input 
              v-model="newOrder.expectedDeliveryDate" 
              type="date" 
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('orders.form.notes') }}</label>
            <textarea 
              v-model="newOrder.notes" 
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div class="flex justify-between items-center">
              <span class="font-medium">{{ t('orders.form.total') }}</span>
              <span class="text-xl font-bold">{{ formatPrice(newOrder.totalPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button @click="closeModal" class="btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="saveOrder" class="btn-primary">
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import type { Order, Product } from '../types'
import { getOrdersFromDB, addOrderToDB, updateOrderInDB, getStocksFromDB } from '../utils/db'

const { t } = useI18n()

// State
const orders = ref<Order[]>([])
const products = ref<Product[]>([])
const showAddModal = ref(false)
const formErrors = ref<{ [key: string]: string }>({})

// New order form
const defaultOrder = {
  productId: '',
  quantity: 1,
  supplier: '',
  expectedDeliveryDate: '',
  notes: '',
  totalPrice: 0
}

const newOrder = ref({ ...defaultOrder })

// Computed
const pendingOrders = computed(() => 
  orders.value.filter(order => order.status === 'pending')
)

const confirmedOrders = computed(() => 
  orders.value.filter(order => order.status === 'confirmed')
)

const deliveredOrders = computed(() => 
  orders.value.filter(order => order.status === 'delivered')
)

const cancelledOrders = computed(() => 
  orders.value.filter(order => order.status === 'cancelled')
)

// Add loading state
const loading = ref(true)

// Methods
const fetchData = async () => {
  try {
    loading.value = true
    const [ordersData, productsData] = await Promise.all([
      getOrdersFromDB(),
      getStocksFromDB()
    ])
    console.log('Loaded products:', productsData)
    console.log('Loaded orders:', ordersData)
    orders.value = ordersData
    products.value = productsData
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const updatePrice = () => {
  if (!newOrder.value.productId || !newOrder.value.quantity) {
    newOrder.value.totalPrice = 0
    return
  }

  const product = products.value.find(p => p.id === Number(newOrder.value.productId))
  console.log('Selected product:', product)
  if (product) {
    newOrder.value.totalPrice = product.price * newOrder.value.quantity
  }
}

const saveOrder = async () => {
  if (!newOrder.value.productId || !newOrder.value.quantity) {
    alert(t('orders.validation.required'))
    return
  }

  const product = products.value.find(p => p.id === Number(newOrder.value.productId))
  if (!product) return

  try {
    const order: Omit<Order, 'id'> = {
      date: new Date().toISOString(),
      product,
      quantity: newOrder.value.quantity,
      status: 'pending',
      totalPrice: newOrder.value.totalPrice,
      supplier: newOrder.value.supplier,
      expectedDeliveryDate: newOrder.value.expectedDeliveryDate,
      notes: newOrder.value.notes
    }

    console.log('Saving order:', order)
    await addOrderToDB(order)
    await fetchData()
    closeModal()
  } catch (error) {
    console.error('Error saving order:', error)
    alert('Error saving order')
  }
}

const updateOrderStatus = async (order: Order, newStatus: Order['status']) => {
  if (confirm(t(`orders.confirmation.${newStatus}`))) {
    await updateOrderInDB(order.id!, { ...order, status: newStatus })
    await fetchData()
  }
}

const closeModal = () => {
  showAddModal.value = false
  newOrder.value = { ...defaultOrder }
}

const getStatusStyle = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'confirmed':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    case 'delivered':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  }
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Initialize
fetchData()
</script> 