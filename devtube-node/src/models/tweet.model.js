import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    }
},{timestamps:true})

const Tweet = mongoose.model("Tweet", tweetSchema)

export default Tweet;