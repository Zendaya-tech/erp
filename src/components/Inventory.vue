<template>
  <div>
    <h1 class="title">{{ t('inventory.title') }}</h1>

    <!-- Stock List -->
    <div class="card mb-8">
      <h2 class="subtitle">{{ t('inventory.stockList.title') }}</h2>
      <div class="table-container">
        <table class="table-primary">
          <thead>
            <tr>
              <th>{{ t('inventory.table.name') }}</th>
              <th>{{ t('inventory.table.quantity') }}</th>
              <th>{{ t('inventory.table.price') }}</th>
              <th>{{ t('inventory.table.type') }}</th>
              <th>{{ t('inventory.table.addDate') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedStocks" :key="product.id">
              <td>{{ product.name }}</td>
              <td>
                <input
                  type="number"
                  v-model.number="product.quantity"
                  @change="updateStock(product.id, product)"
                  class="form-input w-24"
                />
                <span v-if="product.quantity === -1" class="text-green-500 ml-2">
                  {{ t('inventory.unlimited') }}
                </span>
              </td>
              <td>
                <div class="flex items-center">
                  <input
                    type="number"
                    v-model.number="product.price"
                    @change="updateStock(product.id, product)"
                    class="form-input w-24"
                    step="0.01"
                  />
                  <span class="ml-2">€</span>
                </div>
              </td>
              <td>
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="product.isService"
                    @change="updateStock(product.id, product)"
                    class="form-checkbox text-primary-600"
                  />
                  <span class="ml-2" :class="product.isService ? 'text-blue-500' : 'text-gray-500'">
                    {{ product.isService ? t('inventory.type.service') : t('inventory.type.product') }}
                  </span>
                </label>
              </td>
              <td>{{ formatDate(product.creationDate) }}</td>
              <td>
                <div class="flex space-x-2">
                  <button 
                    @click="removeStock(product.id)" 
                    class="btn-delete"
                    :title="t('common.delete')"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-4 gap-2">
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="btn-secondary disabled:opacity-50"
        >
          {{ t('common.previous') }}
        </button>
        <span class="px-4 py-2">{{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="btn-secondary disabled:opacity-50"
        >
          {{ t('common.next') }}
        </button>
      </div>
    </div>

    <!-- Add Product Form -->
    <div class="card">
      <h2 class="subtitle">{{ t('inventory.addProduct.title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="form-group">
          <label class="form-label">{{ t('inventory.form.name') }}</label>
          <input
            v-model="newProduct.name"
            type="text"
            class="form-input"
            :placeholder="t('inventory.form.namePlaceholder')"
          />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('inventory.form.quantity') }}</label>
          <input
            v-model.number="newProduct.quantity"
            type="number"
            class="form-input"
            :placeholder="t('inventory.form.quantityPlaceholder')"
          />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('inventory.form.price') }}</label>
          <input
            v-model.number="newProduct.price"
            type="number"
            step="0.01"
            class="form-input"
            :placeholder="t('inventory.form.pricePlaceholder')"
          />
        </div>
        <div class="form-group">
          <label class="form-label">{{ t('inventory.form.type') }}</label>
          <div class="flex items-center mt-2">
            <input
              v-model="newProduct.isService"
              type="checkbox"
              class="form-checkbox text-primary-600"
            />
            <span class="ml-2">{{ t('inventory.form.isService') }}</span>
          </div>
        </div>
      </div>
      <div class="mt-4">
        <button @click="addNewProduct" class="btn-primary">
          {{ t('inventory.addProduct.submit') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { TrashIcon } from '@heroicons/vue/20/solid'
import type { Product } from '../types'
import { addStockToDB, getStocksFromDB, updateStockInDB, deleteStockFromDB } from '../utils/db'

const { t } = useI18n()

// Products in stock
const stocks = ref<Product[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = 5

// New product form
const newProduct = ref<Partial<Product>>({
  name: '',
  quantity: 0,
  price: 0,
  isService: false,
})

// Computed properties for pagination
const totalPages = computed(() => Math.ceil(stocks.value.length / itemsPerPage))
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return stocks.value.slice(start, start + itemsPerPage)
})

// Fetch all products from IndexedDB
const fetchStocks = async () => {
  stocks.value = await getStocksFromDB()
}

// Add new product
const addNewProduct = async () => {
  if (newProduct.value.name) {
    const productWithDate = {
      ...newProduct.value,
      creationDate: new Date().toISOString(),
    } as Product
    
    await addStockToDB(productWithDate)
    newProduct.value = { name: '', quantity: 0, price: 0, isService: false }
    fetchStocks()
  } else {
    alert(t('inventory.validation.nameRequired'))
  }
}

// Update product
const updateStock = async (id: number, updatedProduct: Product) => {
  if (id) {
    await updateStockInDB(id, updatedProduct)
    fetchStocks()
  }
}

// Remove product
const removeStock = async (id: number) => {
  if (confirm(t('inventory.confirmDelete'))) {
    await deleteStockFromDB(id)
    fetchStocks()
  }
}

// Pagination methods
const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Format date
const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Fetch stocks on component mount
fetchStocks()
</script>
