import { createSlice } from '@reduxjs/toolkit'

export interface SignInModalState {
  value: boolean,
}

const initialState: SignInModalState = {
  value: false,
}

export const signInModalSlice = createSlice({
  name: 'signInModal',
  initialState,
  reducers: {
    setSignInModal:(state,action)=>{
        state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSignInModal } = signInModalSlice.actions

export default signInModalSlice.reducer