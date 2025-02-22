import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
        user: null,
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
        },
        updateUser: (state, action) => {
            if (state.isLoggedIn) {
                state.user = action.payload;
            }
        }
    }
})

export const { login, logout , updateUser} = authSlice.actions;

export default authSlice.reducer;