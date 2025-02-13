import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videos:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    }

},{timestamps:true})




 const Playlist = mongoose.model('Playlist', playlistSchema)
 export default Playlist;