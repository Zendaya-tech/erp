export interface Employee {
  id: number
  name: string
  role: string
  hoursWorked: number
}

export interface Product {
  id: number
  name: string
  quantity: number
  price: number
  isService: boolean
  creationDate: string
}

export interface Sale {
  id?: number
  date: string
  products: SaleItem[]
  totalPrice: number
  client: string |null
}

export interface SaleItem {
  id: number
  name: string
  quantity: number
  totalPrice: number
  price: number
}

export interface Client {
  code: string
  firstName: string
  lastName: string
  sex: 'Homme' | 'Femme'
}

export interface Task {
  id: number
  title: string
  description: string
  status: 'To Do' | 'In Progress' | 'Done'
  priority: 'Low' | 'Medium' | 'High'
  tags: string[]
  deadline: string
}

export interface Order {
  id: number
  date: string
  product: Product
  quantity: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  totalPrice: number
  supplier?: string
  expectedDeliveryDate?: string
  notes?: string
} 