import mongoose from "mongoose";

const connectDB = async () => {
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}`)
       console.log(`\n mongoDB connected !! DB HOST: ${connectionInstance}`);
       return connectionInstance
    } catch (error) {
        console.log("MONGODB connection Failed : ",error);
        process.exit(1);
    }
}

export default connectDB;
