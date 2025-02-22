import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        currentUser: null,
        contnet: null,
        userVideo: null,
        userPlaylist: null,
        userTweets: null,
        userLikedVideos: null,
    },
    reducers: {
        addComment: (state, action) => {
            state.userComment = action.payload;
        },
        addUser: (state, action) => {
            state.user = action.payload;
        },
        addVideo: (state, action) => {
            state.userVideo = action.payload;
        },
        addUserPlaylist: (state, action) => {
            state.userPlaylist = action.payload;
        },
        addUserTweets: (state, action) => {
            state.userTweets = action.payload;
        },
        addCurrentUser: (state, action) => {
            state.currentUser = action.payload;
        },
        addLikedVideos: (state, action) => {
            state.userLikedVideos = action.payload;
        }
    }
})

export const { 
    addComment , 
    addUser, 
    addVideo, 
    addUserPlaylist, 
    addUserTweets,
    addCurrentUser,
    addLikedVideos,
} = userSlice.actions;

export default userSlice.reducer;