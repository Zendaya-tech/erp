import { openDB } from 'idb'
import type { Employee, Product, Sale, Client, Task, Order } from '../types'

// Initialize IndexedDB
export const initDB = async () => {
  return openDB('sirius', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('employees')) {
        db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true })
      }

      if (!db.objectStoreNames.contains('stocks')) {
        db.createObjectStore('stocks', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('sales')) {
        db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true })
      }

      if (!db.objectStoreNames.contains('clients')) {
        db.createObjectStore('clients', { keyPath: 'code' })
      }

      if (!db.objectStoreNames.contains('planning')) {
        db.createObjectStore('planning', { keyPath: 'id', autoIncrement: true })
      }

      if (!db.objectStoreNames.contains('orders')) {
        db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true })
      }
    },
  })
}

// Add an employee
export const addEmployeeToDB = async (employee: Employee) => {
  const db = await initDB()
  await db.add('employees', { ...employee })
}

// Get all employees
export const getEmployeesFromDB = async () => {
  const db = await initDB()
  return await db.getAll('employees')
}

// Update employee hours
export const updateEmployeeInDB = async (id: number, updatedEmployee: Employee) => {
  const db = await initDB()
  await db.put('employees', { ...updatedEmployee, id })
}

// Delete an employee
export const deleteEmployeeFromDB = async (id: number) => {
  const db = await initDB()
  await db.delete('employees', id)
}

/* --- Stock Functions --- */

// Add stock
export const addStockToDB = async (product: Product) => {
  const db = await initDB()
  await db.add('stocks', product)
}

// Get all stocks
export const getStocksFromDB = async () => {
  const db = await initDB()
  return await db.getAll('stocks')
}

// Update stock
export const updateStockInDB = async (id: number, updatedProduct: Product) => {
  const db = await initDB()
  await db.put('stocks', { ...updatedProduct, id })
}

// Delete stock
export const deleteStockFromDB = async (id: number) => {
  const db = await initDB()
  await db.delete('stocks', id)
}

/* --- Sales Functions --- */

// Add sale
export const addSaleToDB = async (sale: Sale) => {
  const db = await initDB()
  // Ensure the sale object is serializable
  const serializedSale = {
    ...sale,
    products: sale.products.map(product => ({
      id: product.id,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      totalPrice: product.totalPrice
    }))
  }
  await db.add('sales', serializedSale)
}

// Get all sales
export const getSalesFromDB = async () => {
  const db = await initDB()
  return await db.getAll('sales')
}

// Delete sale
export const deleteSaleFromDB = async (id: number) => {
  const db = await initDB()
  await db.delete('sales', id)
}

export const addClientToDB = async (client: Client) => {
  const db = await initDB()
  // Créer un nouvel objet avec uniquement les propriétés nécessaires
  const serializedClient = {
    code: client.code,
    firstName: client.firstName,
    lastName: client.lastName,
    sex: client.sex
  }
  return await db.add('clients', serializedClient)
}

export const getClientsFromDB = async () => {
  const db = await initDB()
  return db.getAll('clients')
}

export const updateClientInDB = async (code: string, updatedClient: Client) => {
  const db = await initDB()
  await db.put('clients', { ...updatedClient, code })
}

export const deleteClientFromDB = async (code: string) => {
  const db = await initDB()
  await db.delete('clients', code)
}

export const addTaskToDB = async (task: Task) => {
  const db = await initDB()
  // Ensure the task object is serializable
  const serializedTask = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    tags: [...task.tags], // Create a new array to avoid reference issues
    deadline: task.deadline
  }
  return await db.add('planning', serializedTask)
}

export const getTasksFromDB = async () => {
  const db = await initDB()
  return db.getAll('planning')
}

export const updateTaskInDB = async (id: number, updatedTask: Task) => {
  const db = await initDB()
  // Ensure the task object is serializable
  const serializedTask = {
    id,
    title: updatedTask.title,
    description: updatedTask.description,
    status: updatedTask.status,
    priority: updatedTask.priority,
    tags: [...updatedTask.tags], // Create a new array to avoid reference issues
    deadline: updatedTask.deadline
  }
  await db.put('planning', serializedTask)
}

export const deleteTaskFromDB = async (id: number) => {
  const db = await initDB()
  await db.delete('planning', id)
}

// Fonction pour générer un code client unique
export const generateClientCode = async (): Promise<string> => {
  const db = await initDB()
  const clients = await db.getAll('clients')
  const existingCodes = new Set(clients.map(client => client.code))
  
  let code: string
  do {
    // Génère un code de 6 caractères alphanumériques en majuscules
    code = Array.from(
      { length: 6 },
      () => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 36)]
    ).join('')
  } while (existingCodes.has(code))
  
  return code
}

/* --- Orders Functions --- */

// Add order
export const addOrderToDB = async (order: Omit<Order, 'id'>) => {
  const db = await initDB()
  // Ensure the order object is serializable
  const serializedOrder = {
    ...order,
    date: order.date,
    product: {
      id: order.product.id,
      name: order.product.name,
      price: order.product.price,
      quantity: order.product.quantity,
      isService: order.product.isService,
      creationDate: order.product.creationDate
    },
    quantity: order.quantity,
    status: order.status,
    totalPrice: order.totalPrice,
    supplier: order.supplier,
    expectedDeliveryDate: order.expectedDeliveryDate,
    notes: order.notes
  }
  return await db.add('orders', serializedOrder)
}

// Get all orders
export const getOrdersFromDB = async () => {
  const db = await initDB()
  return await db.getAll('orders')
}

// Update order
export const updateOrderInDB = async (id: number, updatedOrder: Order) => {
  const db = await initDB()
  // Ensure the order object is serializable
  const serializedOrder = {
    ...updatedOrder,
    id,
    product: {
      id: updatedOrder.product.id,
      name: updatedOrder.product.name,
      price: updatedOrder.product.price,
      quantity: updatedOrder.product.quantity,
      isService: updatedOrder.product.isService,
      creationDate: updatedOrder.product.creationDate
    }
  }
  await db.put('orders', serializedOrder)
}

// Delete order
export const deleteOrderFromDB = async (id: number) => {
  const db = await initDB()
  await db.delete('orders', id)
}

// Get order by ID
export const getOrderByIdFromDB = async (id: number) => {
  const db = await initDB()
  return await db.get('orders', id)
}

// Get orders by status
export const getOrdersByStatusFromDB = async (status: Order['status']) => {
  const db = await initDB()
  const orders = await db.getAll('orders')
  return orders
    .filter(order => order.status === status)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get recent orders
export const getRecentOrdersFromDB = async (limit = 5) => {
  const db = await initDB()
  const orders = await db.getAll('orders')
  return orders
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

// Get orders by product
export const getOrdersByProductFromDB = async (productId: number) => {
  const db = await initDB()
  const orders = await db.getAll('orders')
  return orders
    .filter(order => order.product.id === productId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get orders by date range
export const getOrdersByDateRangeFromDB = async (startDate: Date, endDate: Date) => {
  const db = await initDB()
  const orders = await db.getAll('orders')
  return orders
    .filter(order => {
      const orderDate = new Date(order.date)
      return orderDate >= startDate && orderDate <= endDate
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get orders statistics
export const getOrdersStatsFromDB = async () => {
  const db = await initDB()
  const orders = await db.getAll('orders')
  
  return {
    total: orders.length,
    pending: orders.filter(order => order.status === 'pending').length,
    confirmed: orders.filter(order => order.status === 'confirmed').length,
    delivered: orders.filter(order => order.status === 'delivered').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
    totalValue: orders.reduce((sum, order) => sum + order.totalPrice, 0)
  }
}
