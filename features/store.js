import { configureStore } from '@reduxjs/toolkit'
import languageSlice from './languageSlice'

export const store = configureStore({
    reducer: {
        languageReducer: languageSlice
    }
})