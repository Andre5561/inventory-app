import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export type Order = {
  id: number
  title: string
  count: number
  date: string
  shortDate: string
  usd: string
  uah: string
}

export type Product = {
  id: number
  title: string
  serial: string
  type: string
  status: 'Свободен' | 'В ремонте'
  orderId: number
}

type AddProductPayload = {
  orderId: number
  title: string
  serial: string
  type: string
}

type InventoryState = {
  orders: Order[]
  products: Product[]
  isLoading: boolean
}

const initialState: InventoryState = {
  orders: [],
  products: [],
  isLoading: false,
}

export const loadInventory = createAsyncThunk(
  'inventory/loadInventory',
  async () => {
    const [ordersResponse, productsResponse] = await Promise.all([
      fetch(`${API_URL}/orders`),
      fetch(`${API_URL}/products`),
    ])

    if (!ordersResponse.ok || !productsResponse.ok) {
      throw new Error('Не удалось загрузить данные')
    }

    const orders = (await ordersResponse.json()) as Order[]
    const products = (await productsResponse.json()) as Product[]

    return { orders, products }
  }
)

export const addOrder = createAsyncThunk(
  'inventory/addOrder',
  async (title: string) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    })

    if (!response.ok) {
      throw new Error('Не удалось добавить приход')
    }

    return (await response.json()) as Order
  }
)

export const deleteOrder = createAsyncThunk(
  'inventory/deleteOrder',
  async (id: number) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Не удалось удалить приход')
    }

    return id
  }
)

export const addProduct = createAsyncThunk(
  'inventory/addProduct',
  async (product: AddProductPayload) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      throw new Error('Не удалось добавить продукт')
    }

    return (await response.json()) as Product
  }
)

export const deleteProduct = createAsyncThunk(
  'inventory/deleteProduct',
  async (id: number) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Не удалось удалить продукт')
    }

    return id
  }
)

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadInventory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadInventory.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.orders
        state.products = action.payload.products
      })
      .addCase(loadInventory.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(addOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.orders.unshift(action.payload)
      })
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<number>) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        )

        state.products = state.products.filter(
          (product) => product.orderId !== action.payload
        )
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload)

        const order = state.orders.find(
          (item) => item.id === action.payload.orderId
        )

        if (order) {
          order.count += 1
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        const product = state.products.find(
          (item) => item.id === action.payload
        )

        state.products = state.products.filter(
          (item) => item.id !== action.payload
        )

        if (product) {
          const order = state.orders.find(
            (item) => item.id === product.orderId
          )

          if (order) {
            order.count -= 1
          }
        }
      })
  },
})

export default inventorySlice.reducer