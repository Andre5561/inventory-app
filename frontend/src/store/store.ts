import { configureStore } from '@reduxjs/toolkit'
import inventoryReducer from './inventorySlice'
import uiReducer from './uiSlice'

export const makeStore = () =>
  configureStore({
    reducer: {
      inventory: inventoryReducer,
      ui: uiReducer,
    },
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']