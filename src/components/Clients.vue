<template>
  <div>
    <h1 class="title">{{ t('clients.title') }}</h1>

    <!-- Client Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('clients.stats.totalClients') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ clients.length }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <UsersIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('clients.stats.newClients') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ newClientsCount }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <UserPlusIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('clients.stats.activeClients') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ activeClientsCount }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <UserGroupIcon class="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>

    <!-- Client List -->
    <div class="card">
      <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h2 class="subtitle">{{ t('clients.title') }}</h2>
        <div class="flex gap-4">
          <div class="relative min-w-[300px]">
            <input
              v-model="searchQuery"
              type="text"
              class="form-input pl-10"
              :placeholder="t('clients.search')"
            />
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <button 
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
          <div class="relative min-w-[200px]">
            <select 
              v-model="filterGender" 
              class="form-select appearance-none pl-10 pr-10"
            >
              <option value="">{{ t('clients.filter.all') }}</option>
              <option value="Homme">{{ t('clients.filter.male') }}</option>
              <option value="Femme">{{ t('clients.filter.female') }}</option>
            </select>
            <UserGroupIcon class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <ChevronDownIcon class="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <button @click="openAddModal" class="btn-primary">
            <PlusIcon class="w-5 h-5 mr-2 inline-block" />
            {{ t('clients.addClient') }}
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="table-primary">
          <thead>
            <tr>
              <th>{{ t('clients.table.code') }}</th>
              <th>{{ t('clients.table.lastName') }}</th>
              <th>{{ t('clients.table.firstName') }}</th>
              <th>{{ t('clients.table.gender') }}</th>
              <th>{{ t('clients.table.purchases') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in filteredClients" :key="client.code">
              <td class="font-mono">{{ client.code }}</td>
              <td>{{ client.lastName }}</td>
              <td>{{ client.firstName }}</td>
              <td>{{ client.sex === 'Homme' ? t('clients.form.male') : t('clients.form.female') }}</td>
              <td>{{ getClientPurchases(client.code) }}</td>
              <td>
                <div class="flex gap-2 justify-end">
                  <button 
                    @click="viewClientDetails(client)"
                    class="btn-icon"
                    :title="t('common.view')"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="editClient(client)"
                    class="btn-icon"
                    :title="t('common.edit')"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button 
                    @click="confirmDelete(client)"
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
    </div>

    <!-- Add/Edit Client Modal -->
    <div 
      v-if="showAddModal" 
      class="modal-overlay"
    >
      <div class="modal-content">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">
            {{ isEditing ? t('clients.form.edit') : t('clients.form.new') }}
          </h2>
          <button 
            @click="closeModal" 
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-6">
          <div class="form-group">
            <label class="form-label">{{ t('clients.form.code') }}</label>
            <input 
              v-model="editingClient.code" 
              type="text" 
              class="form-input font-mono uppercase"
              disabled
            />
            <span class="text-sm text-gray-500">
              {{ t('clients.form.autoGenerated') }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label class="form-label">{{ t('clients.form.lastName') }}</label>
              <input 
                v-model="editingClient.lastName" 
                type="text" 
                class="form-input"
                :class="{ 'error': formErrors.lastName }"
              />
              <span v-if="formErrors.lastName" class="error-message">
                {{ t('clients.form.validation.lastNameRequired') }}
              </span>
            </div>

            <div class="form-group">
              <label class="form-label">{{ t('clients.form.firstName') }}</label>
              <input 
                v-model="editingClient.firstName" 
                type="text" 
                class="form-input"
                :class="{ 'error': formErrors.firstName }"
              />
              <span v-if="formErrors.firstName" class="error-message">
                {{ t('clients.form.validation.firstNameRequired') }}
              </span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('clients.form.gender') }}</label>
            <div class="flex gap-6">
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="editingClient.sex"
                  value="Homme"
                  class="form-radio"
                />
                <span class="ml-2">{{ t('clients.form.male') }}</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  v-model="editingClient.sex"
                  value="Femme"
                  class="form-radio"
                />
                <span class="ml-2">{{ t('clients.form.female') }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-8">
          <button 
            @click="closeModal" 
            class="btn-secondary"
          >
            {{ t('common.cancel') }}
          </button>
          <button
            @click="saveClient"
            class="btn-primary"
          >
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div 
      v-if="selectedClient"
      class="modal-overlay"
    >
      <div class="modal-content">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">{{ t('clients.details.title') }}</h2>
          <button 
            @click="selectedClient = null" 
            class="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="space-y-6">
          <div>
            <h3 class="font-medium mb-3">{{ t('clients.details.personalInfo') }}</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">{{ t('clients.table.code') }}</p>
                <p class="font-mono">{{ selectedClient.code }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('clients.table.gender') }}</p>
                <p>{{ selectedClient.sex === 'Homme' ? t('clients.form.male') : t('clients.form.female') }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('clients.table.lastName') }}</p>
                <p>{{ selectedClient.lastName }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">{{ t('clients.table.firstName') }}</p>
                <p>{{ selectedClient.firstName }}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-medium mb-3">{{ t('clients.details.purchaseHistory') }}</h3>
            <div class="table-container">
              <table class="table-primary">
                <thead>
                  <tr>
                    <th>{{ t('clients.details.purchaseDate') }}</th>
                    <th>{{ t('clients.details.purchaseAmount') }}</th>
                    <th>{{ t('common.products') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sale in clientSales" :key="sale.id">
                    <td>{{ formatDate(sale.date) }}</td>
                    <td>{{ formatPrice(sale.totalPrice) }}</td>
                    <td>{{ sale.items.length }} {{ t('clients.details.products') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-8">
          <button 
            @click="selectedClient = null" 
            class="btn-secondary"
          >
            {{ t('clients.details.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  UserPlusIcon,
  UserGroupIcon,
  EyeIcon,
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import type { Client, Sale } from '../types'
import {
  addClientToDB,
  getClientsFromDB,
  updateClientInDB,
  deleteClientFromDB,
  getSalesFromDB,
  generateClientCode,
} from '../utils/db'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// State
const clients = ref<Client[]>([])
const sales = ref<Sale[]>([])
const showAddModal = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const filterGender = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedClient = ref<Client | null>(null)
const formErrors = ref<Record<string, string>>({})

const editingClient = ref<Partial<Client>>({
  code: '',
  firstName: '',
  lastName: '',
  sex: 'Homme',
})

// Computed
const newClientsCount = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return clients.value.length - clients.value.length
})

const activeClientsCount = computed(() => {
  const activeClientCodes = new Set(
    sales.value
      .filter(sale => {
        const saleDate = new Date(sale.date)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        return saleDate >= sixMonthsAgo
      })
      .map(sale => sale.client)
  )
  return activeClientCodes.size
})

const filteredClients = computed(() => {
  return clients.value.filter(client => {
    const matchesSearch = (
      client.firstName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.lastName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.code.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    const matchesGender = !filterGender.value || client.sex === filterGender.value
    return matchesSearch && matchesGender
  })
})

const totalPages = computed(() =>
  Math.ceil(filteredClients.value.length / itemsPerPage)
)

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredClients.value.slice(start, start + itemsPerPage)
})

interface ExtendedSale extends Sale {
  items: {
    id: number
    name: string
    quantity: number
    totalPrice: number
  }[]
}

const clientSales = ref<ExtendedSale[]>([])

const fetchClientSales = async (clientId: number) => {
  try {
    const sales = await getSalesByClientId(clientId)
    clientSales.value = sales.map(sale => ({
      ...sale,
      items: sale.products
    }))
  } catch (error) {
    console.error('Erreur lors de la récupération des ventes:', error)
  }
}

// Methods
const fetchData = async () => {
  clients.value = await getClientsFromDB()
  sales.value = await getSalesFromDB()
}

const validateForm = () => {
  const errors: Record<string, string> = {}
  
  if (!editingClient.value.code?.trim()) {
    errors.code = t('clients.form.validation.codeRequired')
  } else if (!isEditing.value && clients.value.some(c => c.code === editingClient.value.code)) {
    errors.code = t('clients.form.validation.codeExists')
  }
  
  if (!editingClient.value.firstName?.trim()) {
    errors.firstName = t('clients.form.validation.firstNameRequired')
  }
  
  if (!editingClient.value.lastName?.trim()) {
    errors.lastName = t('clients.form.validation.lastNameRequired')
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const saveClient = async () => {
  if (!validateForm()) return

  try {
    if (isEditing.value) {
      await updateClientInDB(editingClient.value.code!, editingClient.value as Client)
    } else {
      const newClient = {
        code: editingClient.value.code!,
        firstName: editingClient.value.firstName!,
        lastName: editingClient.value.lastName!,
        sex: editingClient.value.sex!
      }
      await addClientToDB(newClient)
    }

    await fetchData()
    closeModal()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du client:', error)
    // Gérer l'erreur ici (par exemple, afficher un message à l'utilisateur)
  }
}

const editClient = (client: Client) => {
  editingClient.value = { ...client }
  isEditing.value = true
  showAddModal.value = true
}

const viewClientDetails = (client: Client) => {
  selectedClient.value = client
}

const confirmDelete = async (client: Client) => {
  if (confirm(t('clients.form.deleteConfirm'))) {
    await deleteClientFromDB(client.code)
    await fetchData()
  }
}

const closeModal = () => {
  showAddModal.value = false
  isEditing.value = false
  editingClient.value = {
    code: '',
    firstName: '',
    lastName: '',
    sex: 'Homme',
  }
  formErrors.value = {}
}

const getClientPurchases = (clientCode: string) => {
  const clientSales = sales.value.filter(sale => sale.client === clientCode)
  const totalAmount = clientSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  return t('clients.details.purchaseCount', {
    count: clientSales.length,
    amount: formatPrice(totalAmount)
  })
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

const openAddModal = async () => {
  if (!isEditing.value) {
    editingClient.value = {
      code: await generateClientCode(),
      firstName: '',
      lastName: '',
      sex: 'Homme',
    }
  }
  showAddModal.value = true
}

// Initialize
onMounted(fetchData)
</script>
