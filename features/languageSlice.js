import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    lang : 'idn'
} 

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLang: (state, action) => {
            state.lang = action.payload
        }
    }
})

export const {setLang} = languageSlice.actions
export default languageSlice.reducer