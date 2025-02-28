import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
    name: 'video',
    initialState: {
        video: null,
        Likes: null,
        comments:null,
        owner: null,
        subscribers:null,
        areYouSubscribed: false,
    },
    reducers: {
        setVideo: (state, action) => {
            state.video = action.payload;
        },
        setComments: (state, action) => {
            state.comments = action.payload;
        },
        setLikes: (state, action) => {
            state.Likes = action.payload
        },
        increaseLikes: (state, action) => {
            state.Likes = state.Likes + 1;
        },
        decreaseLikes: (state, action) => {
            state.Likes = state.Likes - 1;
        },
        setOwner: (state, action) => {
            state.owner = action.payload;
        },
        setSubscribers: (state, action) => {
            state.subscribers = action.payload;
        },
        isSubscribed: (state, action) => {
            state.areYouSubscribed = action.payload;
        }
    }
})

export const { setVideo, setOwner, setSubscribers, isSubscribed , setComments, setLikes, increaseLikes,decreaseLikes} = movieSlice.actions;

export default movieSlice.reducer;