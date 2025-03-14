import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from "../service/Api.ts";

export interface User{
    id: number,
    full_name: string,
    phone_number: number,
    gender: string,
    image: string
}
export interface InitialStateType{
    user: User[],
    loading: boolean,
    error: any
}

const initialState: InitialStateType = {
   user: [],
   loading: false,
   error: null
}
// fetch user
export const fetchUser = createAsyncThunk('user/fetchUser', async (_, {rejectWithValue}) => {
    try{
      const response = await api.get('/verify');
      const data = await response.data.user;
      return data;
    }catch(err: any){
      return rejectWithValue(err.message)
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null
        })
    .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.error = null,
        state.loading = true,
        state.user = action.payload;
    })
    .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false
    })
    }

})

export default userSlice.reducer;