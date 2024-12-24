import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/components/Dashboard.vue'
import Inventory from '@/components/Inventory.vue'
import Sales from '@/components/Sales.vue'
import Hr from '@/components/Hr.vue'
import Clients from '@/components/Clients.vue'
import Planning from '@/components/Planning.vue'
import Settings from '@/components/Settings.vue'
import Orders from '@/components/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Dashboard', component: Dashboard },
    { path: '/inventory', name: 'Inventory', component: Inventory },
    { path: '/sales', name: 'Sales', component: Sales },
    { path: '/clients', name: 'Clients', component: Clients },
    { path: '/planning', name: 'Plannings', component: Planning },
    { path: '/settings', name: 'settings', component: Settings },

    { path: '/hr', name: 'HR', component: Hr },

    {
      path: '/orders',
      name: 'Orders',
      component: Orders
    }
  ],
})

export default router
