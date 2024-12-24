<template>
  <div>
    <h1 class="title">{{ t('sales.title') }}</h1>

    <!-- Sales Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('sales.stats.todaySales') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ formatPrice(todaysSales) }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <CurrencyEuroIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('sales.stats.productsSold') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ totalProductsSold }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <ShoppingBagIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('sales.stats.customersServed') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ uniqueCustomers }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <UsersIcon class="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>

    <!-- New Sale Section -->
    <div class="card mb-8">
      <h2 class="subtitle">{{ t('sales.newSale.title') }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Product Selection -->
        <div class="form-group">
          <label class="form-label">{{ t('sales.newSale.selectProduct') }}</label>
          <select
            v-model="selectedProduct.id"
            @change="selectProduct"
            class="form-select"
          >
            <option disabled value="">{{ t('sales.newSale.selectProduct') }}</option>
            <option 
              v-for="product in availableProducts" 
              :key="product.id" 
              :value="product.id"
            >
              {{ product.name }} - {{ formatPrice(product.price) }}
              {{ product.quantity === -1 ? '(∞)' : `(${product.quantity})` }}
            </option>
          </select>
        </div>

        <!-- Quantity Input -->
        <div class="form-group">
          <label class="form-label">{{ t('sales.newSale.quantity') }}</label>
          <div class="flex items-center gap-2">
            <input
              v-model.number="saleQuantity"
              type="number"
              min="1"
              :max="selectedProduct.quantity === -1 ? null : selectedProduct.quantity"
              class="form-input"
            />
            <button @click="addToSale" class="btn-primary">
              {{ t('sales.newSale.add') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Client Selection -->
      <div class="mt-6">
        <label class="form-label">{{ t('sales.newSale.client') }}</label>
        <select
          v-model="clientName"
          class="form-select max-w-md"
        >
          <option value="">{{ t('sales.newSale.selectClient') }}</option>
          <option 
            v-for="client in clients" 
            :key="client.code" 
            :value="client.code"
          >
            {{ client.firstName }} {{ client.lastName }}
          </option>
        </select>
      </div>

      <!-- Cart Summary -->
      <div v-if="saleItems.length" class="mt-6">
        <h3 class="text-lg font-medium text-primary-800 mb-4">{{ t('sales.newSale.cart') }}</h3>
        <div class="table-container">
          <table class="table-primary">
            <thead>
              <tr>
                <th>{{ t('inventory.table.name') }}</th>
                <th>{{ t('sales.newSale.quantity') }}</th>
                <th>{{ t('sales.newSale.unitPrice') }}</th>
                <th>{{ t('sales.newSale.subtotal') }}</th>
                <th>{{ t('common.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in saleItems" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ formatPrice(item.price) }}</td>
                <td class="font-medium">{{ formatPrice(item.totalPrice) }}</td>
                <td>
                  <button 
                    @click="removeFromSale(index)" 
                    class="btn-delete"
                    :title="t('sales.newSale.removeItem')"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
              <tr class="bg-primary-50 font-bold">
                <td colspan="3" class="text-right">{{ t('sales.newSale.total') }}</td>
                <td>{{ formatPrice(totalSalePrice) }}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-6 flex justify-end">
          <button 
            @click="completeSale" 
            class="btn-primary"
          >
            {{ t('sales.newSale.finalize') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Sales History -->
    <div class="card">
      <h2 class="subtitle">{{ t('dashboard.recentSales.title') }}</h2>
      <div class="table-container">
        <table class="table-primary">
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Produits</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in completedSales" :key="sale.id">
              <td>{{ formatDate(sale.date) }}</td>
              <td>{{ sale.client || t('sales.anonymous') }}</td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span 
                    v-for="product in sale.products" 
                    :key="product.id"
                    class="px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded-full"
                  >
                    {{ product.name }} (×{{ product.quantity }})
                  </span>
                </div>
              </td>
              <td class="font-medium">{{ formatPrice(sale.totalPrice) }}</td>
              <td>
                <button @click="viewSaleDetails(sale)" class="btn-view">
                  <EyeIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  TrashIcon,
  EyeIcon,
  CurrencyEuroIcon,
  ShoppingBagIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import type { Product, Sale, SaleItem, Client } from '../types'
import { addSaleToDB, getSalesFromDB, getStocksFromDB, updateStockInDB, getClientsFromDB } from '../utils/db'

const { t } = useI18n()

// State
const stocks = ref<Product[]>([])
const saleItems = ref<SaleItem[]>([])
const selectedProduct = ref<Partial<Product>>({})
const saleQuantity = ref(1)
const clientName = ref('')
const completedSales = ref<Sale[]>([])
const clients = ref<Client[]>([])

// Computed
const availableProducts = computed(() => 
  stocks.value.filter(p => p.quantity === -1 || p.quantity > 0)
)

const totalSalePrice = computed(() =>
  saleItems.value.reduce((total, item) => total + item.totalPrice, 0)
)

const todaysSales = computed(() => {
  const today = new Date().toDateString()
  return completedSales.value
    .filter(sale => new Date(sale.date).toDateString() === today)
    .reduce((total, sale) => total + sale.totalPrice, 0)
})

const totalProductsSold = computed(() =>
  completedSales.value.reduce((total, sale) => 
    total + sale.products.reduce((sum, product) => sum + product.quantity, 0), 0
  )
)

const uniqueCustomers = computed(() => 
  new Set(completedSales.value.map(sale => sale.client)).size
)

// Methods
const fetchData = async () => {
  stocks.value = await getStocksFromDB()
  completedSales.value = await getSalesFromDB()
  clients.value = await getClientsFromDB()
}

const selectProduct = () => {
  const product = stocks.value.find(p => p.id === selectedProduct.value.id)
  if (product) {
    selectedProduct.value = product
    saleQuantity.value = 1
  }
}

const addToSale = () => {
  if (!selectedProduct.value.id || !saleQuantity.value) {
    alert('Veuillez sélectionner un produit et une quantité valide')
    return
  }

  const product = selectedProduct.value as Product
  if (product.quantity !== -1 && product.quantity < saleQuantity.value) {
    alert('Quantité insuffisante en stock')
    return
  }

  saleItems.value.push({
    id: product.id!,
    name: product.name,
    quantity: saleQuantity.value,
    price: product.price,
    totalPrice: product.price * saleQuantity.value
  })

  // Reset form
  selectedProduct.value = {}
  saleQuantity.value = 1
}

const removeFromSale = (index: number) => {
  saleItems.value.splice(index, 1)
}

const completeSale = async () => {
  if (saleItems.value.length === 0) {
    alert(t('sales.newSale.cartEmpty'))
    return
  }

  try {
    const sale: Sale = {
      date: new Date().toISOString(),
      products: saleItems.value,
      totalPrice: totalSalePrice.value,
      client: clientName.value || null
    }

    // Update stock quantities
    for (const item of saleItems.value) {
      const product = stocks.value.find(p => p.id === item.id)
      if (product && product.quantity !== -1) {
        product.quantity -= item.quantity
        await updateStockInDB(product.id!, product)
      }
    }

    await addSaleToDB(sale)
    await fetchData()

    // Reset form
    saleItems.value = []
    clientName.value = ''
    alert(t('sales.newSale.success'))
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la vente:', error)
    alert(t('sales.newSale.error'))
  }
}

const viewSaleDetails = (sale: Sale) => {
  // Implement sale details view
  console.log('Sale details:', sale)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Initialize
fetchData()
</script>
