import { configureStore } from '@reduxjs/toolkit'
import { financesSlice } from './slices/financesSlice'
import modalSlice from './slices/modalSlice'

export const store = configureStore({
	reducer: {
		finances: financesSlice.reducer,
		modal: modalSlice,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
