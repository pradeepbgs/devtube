import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`)
       console.log(`\n mongoDB connected !! DB HOST: ${connectionInstance}`);
    } catch (error) {
        console.log("MONGODB connection Failed : ",error);
        process.exit(1);
    }
}

export default connectDB;
