import { CurrentUser } from '@/types/CurrentUser'
import { createSlice } from '@reduxjs/toolkit'

export interface CurrentUserState {
  value: null | "guest" | CurrentUser,
}

const initialState: CurrentUserState = {
  value: null,
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setUser:(state,action)=>{
        state.value = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = currentUserSlice.actions

export default currentUserSlice.reducer