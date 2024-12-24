<template>
  <div>
    <h1 class="title">{{ t('planning.title') }}</h1>

    <!-- Task Progress Overview -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('planning.stats.todo') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ tasks.filter(t => t.status === 'To Do').length }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <ClipboardIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('planning.stats.inProgress') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ tasks.filter(t => t.status === 'In Progress').length }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <ArrowPathIcon class="w-10 h-10" />
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h3 class="text-lg font-medium text-primary-800 mb-2">{{ t('planning.stats.done') }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-primary-600">
            {{ tasks.filter(t => t.status === 'Done').length }}
          </span>
          <div class="w-16 h-16 flex items-center justify-center text-primary-400">
            <CheckCircleIcon class="w-10 h-10" />
          </div>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="card mb-8">
      <h2 class="subtitle">Progression Globale</h2>
      <div class="relative pt-1">
        <div class="flex mb-2 items-center justify-between">
          <div>
            <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
              Progression
            </span>
          </div>
          <div class="text-right">
            <span class="text-xs font-semibold inline-block text-primary-600">
              {{ progress }}%
            </span>
          </div>
        </div>
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
          <div
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Task Filters -->
    <div class="card mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="form-group">
          <label class="form-label">{{ t('planning.form.status') }}</label>
          <select v-model="filter.status" class="form-select">
            <option value="">{{ t('common.filter.all') }}</option>
            <option value="To Do">{{ t('planning.stats.todo') }}</option>
            <option value="In Progress">{{ t('planning.stats.inProgress') }}</option>
            <option value="Done">{{ t('planning.stats.done') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('planning.form.priority') }}</label>
          <select v-model="filter.priority" class="form-select">
            <option value="">{{ t('common.filter.all') }}</option>
            <option value="Low">{{ t('planning.priority.low') }}</option>
            <option value="Medium">{{ t('planning.priority.medium') }}</option>
            <option value="High">{{ t('planning.priority.high') }}</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">{{ t('planning.form.tags') }}</label>
          <input
            v-model="filter.tag"
            type="text"
            class="form-input"
            :placeholder="t('planning.search.byTag')"
          />
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button @click="clearFilters" class="btn-secondary">
          {{ t('planning.filters.reset') }}
        </button>
      </div>
    </div>

    <!-- Task List -->
    <div class="card">
      <div class="flex justify-between items-center mb-6">
        <h2 class="subtitle">{{ t('planning.taskList') }}</h2>
        <button @click="showAddTaskModal = true" class="btn-primary">
          {{ t('planning.addTask') }}
        </button>
      </div>

      <div class="table-container">
        <table class="table-primary">
          <thead>
            <tr>
              <th>{{ t('planning.form.title') }}</th>
              <th>{{ t('planning.form.description') }}</th>
              <th>{{ t('planning.form.status') }}</th>
              <th>{{ t('planning.form.priority') }}</th>
              <th>{{ t('planning.form.tags') }}</th>
              <th>{{ t('planning.form.deadline') }}</th>
              <th>{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks" :key="task.id">
              <td class="font-medium text-primary-900">{{ task.title }}</td>
              <td>{{ task.description }}</td>
              <td>
                <select
                  v-model="task.status"
                  @change="updateTaskStatus(task.id!, task)"
                  class="form-select"
                >
                  <option value="To Do">{{ t('planning.stats.todo') }}</option>
                  <option value="In Progress">{{ t('planning.stats.inProgress') }}</option>
                  <option value="Done">{{ t('planning.stats.done') }}</option>
                </select>
              </td>
              <td>
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-red-100 text-red-700': task.priority === 'High',
                    'bg-yellow-100 text-yellow-700': task.priority === 'Medium',
                    'bg-green-100 text-green-700': task.priority === 'Low'
                  }"
                >
                  {{ t(`planning.priority.${task.priority.toLowerCase()}`) }}
                </span>
              </td>
              <td>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in task.tags"
                    :key="tag"
                    class="px-2 py-1 text-xs bg-primary-100 text-primary-600 rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td>{{ formatDate(task.deadline) }}</td>
              <td>
                <div class="flex space-x-2">
                  <button 
                    @click="editTask(task)" 
                    class="btn-edit"
                    :title="t('common.edit')"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button 
                    @click="removeTask(task.id)" 
                    class="btn-delete"
                    :title="t('common.delete')"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Task Modal -->
    <div
      v-if="showAddTaskModal"
      class="modal-overlay"
    >
      <div class="modal-content">
        <h2 class="subtitle mb-6">
          {{ editingTask ? t('planning.modal.editTask') : t('planning.modal.newTask') }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label class="form-label">{{ t('planning.form.title') }}</label>
            <input v-model="newTask.title" type="text" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('planning.form.priority') }}</label>
            <select v-model="newTask.priority" class="form-select">
              <option value="Low">{{ t('planning.priority.low') }}</option>
              <option value="Medium">{{ t('planning.priority.medium') }}</option>
              <option value="High">{{ t('planning.priority.high') }}</option>
            </select>
          </div>

          <div class="form-group md:col-span-2">
            <label class="form-label">{{ t('planning.form.description') }}</label>
            <textarea
              v-model="newTask.description"
              class="form-input"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('planning.form.deadline') }}</label>
            <input v-model="newTask.deadline" type="date" class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">{{ t('planning.form.tags') }}</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="newTag"
                type="text"
                class="form-input"
                @keyup.enter="addTag"
                :placeholder="t('planning.tags.enterToAdd')"
              />
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="tag in newTask.tags"
                :key="tag"
                class="px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-sm flex items-center"
              >
                {{ tag }}
                <button
                  @click="removeTag(tag)"
                  class="ml-1 text-primary-400 hover:text-primary-600"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button @click="closeModal" class="btn-secondary">
            {{ t('common.cancel') }}
          </button>
          <button @click="saveTask" class="btn-primary">
            {{ editingTask ? t('common.update') : t('common.save') }}
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
  TrashIcon,
  PencilIcon,
  ClipboardIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import type { Task } from '../types'
import { addTaskToDB, getTasksFromDB, updateTaskInDB, deleteTaskFromDB } from '../utils/db'

const { t } = useI18n()

// State
const tasks = ref<Task[]>([])
const showAddTaskModal = ref(false)
const editingTask = ref<Task | null>(null)
const newTag = ref('')
const filter = ref({
  status: '',
  priority: '',
  tag: '',
})

// New task form
const defaultTask = {
  title: '',
  description: '',
  status: 'To Do' as const,
  priority: 'Medium' as const,
  tags: [],
  deadline: '',
}

const newTask = ref<Partial<Task>>({ ...defaultTask })

// Computed
const progress = computed(() => {
  if (tasks.value.length === 0) return 0
  const completed = tasks.value.filter((task) => task.status === 'Done').length
  return Math.round((completed / tasks.value.length) * 100)
})

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => {
    const matchStatus = !filter.value.status || task.status === filter.value.status
    const matchPriority = !filter.value.priority || task.priority === filter.value.priority
    const matchTag =
      !filter.value.tag ||
      task.tags.some((tag) => tag.toLowerCase().includes(filter.value.tag.toLowerCase()))
    return matchStatus && matchPriority && matchTag
  })
})

// Methods
const fetchTasks = async () => {
  tasks.value = await getTasksFromDB()
}

const addTag = () => {
  if (newTag.value && !newTask.value.tags?.includes(newTag.value)) {
    newTask.value.tags = [...(newTask.value.tags || []), newTag.value]
    newTag.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  newTask.value.tags = newTask.value.tags?.filter((tag) => tag !== tagToRemove)
}

const saveTask = async () => {
  if (!newTask.value.title || !newTask.value.description) {
    alert('Veuillez remplir tous les champs requis')
    return
  }

  if (editingTask.value) {
    await updateTaskInDB(editingTask.value.id!, { ...newTask.value } as Task)
  } else {
    await addTaskToDB({ ...newTask.value } as Task)
  }

  await fetchTasks()
  closeModal()
}

const editTask = (task: Task) => {
  editingTask.value = task
  newTask.value = { ...task }
  showAddTaskModal.value = true
}

const removeTask = async (id: number) => {
  if (confirm(t('planning.confirmDelete'))) {
    await deleteTaskFromDB(id)
    await fetchTasks()
  }
}

const closeModal = () => {
  showAddTaskModal.value = false
  editingTask.value = null
  newTask.value = { ...defaultTask }
  newTag.value = ''
}

const clearFilters = () => {
  filter.value = {
    status: '',
    priority: '',
    tag: '',
  }
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const updateTaskStatus = async (taskId: number, task: Task) => {
  if (taskId) {
    try {
      await updateTaskInDB(taskId, task)
      await fetchTasks()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error)
    }
  }
}

// Initialize
fetchTasks()
</script>
