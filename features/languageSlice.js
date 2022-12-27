import {createSlice} from '@reduxjs/toolkit'
import ind from '@/lang/ind'
import en from '@/lang/en'

const initialState = {
    lang : 'idn',
    dictionary: ind
} 

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLang: (state, action) => {
            state.lang = action.payload
            state.dictionary = action.payload == 'idn' ? ind : en
        }
    }
})

export const {setLang} = languageSlice.actions
export default languageSlice.reducer