import { createSlice } from "@reduxjs/toolkit";


const toggleSlice = createSlice({
    name: "toggle",
    initialState: {
        isMenuOpen: true,
        description: false,
        userIcon: false,
        uploadPage: false
    },
    reducers: {
        toggleMenu: (state) => {   
            state.isMenuOpen = !state.isMenuOpen;
        },
        toggleMenuFalse: (state) => {
            state.isMenuOpen = false;
        },
        toggleMenuTrue: (state) => {
            state.isMenuOpen = true
        },
        showDescription: (state, action) => {
            state.description = !state.description;
        },
        showUserIcon: (state) => {
            state.userIcon = !state.userIcon
        },
        showUserIconFalse: (state) => {
            state.userIcon = false;
        },
        showUploadPage: (state, action) => {
            state.uploadPage = action.payload;
        }
    }

})

export const { 
    toggleMenu, 
    showDescription, 
    toggleMenuFalse, 
    toggleMenuTrue ,
    showUserIcon,
    showUploadPage,
    showUserIconFalse
} = toggleSlice.actions;
export default toggleSlice.reducer;