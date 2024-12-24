<template>
  <div>
    <h1 class="title">Gestion des Ressources Humaines</h1>

    <!-- HR Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">Effectif Total</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ employees.length }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <UsersIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">Heures Totales</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ totalHours }}h
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <ClockIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">Rôles Actifs</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ roles.length }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <UserGroupIcon class="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>

    <!-- Employee List -->
    <div class="card mb-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="subtitle mb-0">Liste des employés</h2>
        <button @click="showAddModal = true" class="btn-primary">
          Nouvel Employé
        </button>
      </div>

      <div class="table-container">
        <table class="table-primary">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rôle</th>
              <th>Heures travaillées</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td class="font-medium">{{ employee.name }}</td>
              <td>
                <span class="px-2 py-1 text-sm bg-primary-100 text-primary-600 rounded-full">
                  {{ employee.role }}
                </span>
              </td>
              <td>
                <div class="flex items-center gap-2">
                  <input
                    type="number"
                    v-model.number="employee.hoursWorked"
                    @change="updateHours(employee.id, employee)"
                    class="form-input w-20"
                    min="0"
                  />
                  <span class="text-gray-500">heures</span>
                </div>
              </td>
              <td>
                <div class="flex space-x-2">
                  <button @click="editEmployee(employee)" class="btn-edit">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="confirmDelete(employee)" class="btn-delete">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Role Management -->
    <div class="card">
      <h2 class="subtitle">Gestion des Rôles</h2>
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="role in roles"
          :key="role"
          class="px-3 py-1 bg-primary-100 text-primary-600 rounded-full flex items-center"
        >
          {{ role }}
          <button
            @click="removeRole(role)"
            class="ml-2 text-primary-400 hover:text-primary-600"
          >
            ×
          </button>
        </span>
      </div>
      <div class="flex gap-2">
        <input
          v-model="newRole"
          type="text"
          class="form-input"
          placeholder="Nouveau rôle"
          @keyup.enter="addRole"
        />
        <button @click="addRole" class="btn-primary">Ajouter</button>
      </div>
    </div>

    <!-- Add/Edit Employee Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ isEditing ? 'Modifier l\'employé' : 'Ajouter un employé' }}
        </h2>
        
        <div class="space-y-4">
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input v-model="editingEmployee.name" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">Rôle</label>
            <select v-model="editingEmployee.role" class="form-select">
              <option value="">Sélectionner un rôle</option>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Heures travaillées</label>
            <input
              v-model.number="editingEmployee.hoursWorked"
              type="number"
              class="form-input"
              min="0"
            />
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-6">
          <button @click="closeModal" class="btn-secondary">
            Annuler
          </button>
          <button
            @click="saveEmployee"
            class="btn-primary"
          >
            {{ isEditing ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PencilIcon,
  TrashIcon,
  UsersIcon,
  ClockIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'
import type { Employee } from '../types'
import {
  addEmployeeToDB,
  getEmployeesFromDB,
  updateEmployeeInDB,
  deleteEmployeeFromDB,
} from '../utils/db'

// State
const employees = ref<Employee[]>([])
const roles = ref<string[]>(['Manager', 'Vendeur', 'Technicien'])
const newRole = ref('')
const showAddModal = ref(false)
const isEditing = ref(false)
const editingEmployee = ref<Partial<Employee>>({
  name: '',
  role: '',
  hoursWorked: 0,
})

// Computed
const totalHours = computed(() =>
  employees.value.reduce((sum, emp) => sum + emp.hoursWorked, 0)
)

// Methods
const fetchEmployees = async () => {
  employees.value = await getEmployeesFromDB()
}

const saveEmployee = async () => {
  if (!editingEmployee.value.name || !editingEmployee.value.role) {
    alert('Veuillez remplir tous les champs requis')
    return
  }

  if (isEditing.value && editingEmployee.value.id) {
    await updateEmployeeInDB(editingEmployee.value.id, editingEmployee.value as Employee)
  } else {
    await addEmployeeToDB(editingEmployee.value as Employee)
  }

  await fetchEmployees()
  closeModal()
}

const editEmployee = (employee: Employee) => {
  editingEmployee.value = { ...employee }
  isEditing.value = true
  showAddModal.value = true
}

const confirmDelete = async (employee: Employee) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer ${employee.name} ?`)) {
    await deleteEmployeeFromDB(employee.id!)
    await fetchEmployees()
  }
}

const updateHours = async (id: number, employee: Employee) => {
  await updateEmployeeInDB(id, employee)
  await fetchEmployees()
}

const addRole = () => {
  if (newRole.value && !roles.value.includes(newRole.value)) {
    roles.value.push(newRole.value)
    newRole.value = ''
  }
}

const removeRole = (role: string) => {
  if (employees.value.some(emp => emp.role === role)) {
    alert('Ce rôle est actuellement utilisé et ne peut pas être supprimé')
    return
  }
  roles.value = roles.value.filter(r => r !== role)
}

const closeModal = () => {
  showAddModal.value = false
  isEditing.value = false
  editingEmployee.value = {
    name: '',
    role: '',
    hoursWorked: 0,
  }
}

// Initialize
fetchEmployees()
</script>
