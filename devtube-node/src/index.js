import connectDB from "./db/index.js";
import app from './app.js'


await connectDB()
.then(() =>(
    app.listen(process.env.PORT || 3000, () =>{
        console.log(`app is running on http://localhost:${process.env.PORT}`)
    })
))
.catch((err) => (
    console.log('mongoDB error on index,js::', err)
))
app.on("error", (error) =>{
    console.log("Error: ",error);
    throw error;
})







/*
 const app = express()
 ;(async () =>{
    try {
         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
         app.on("error", (error) =>{
             console.log("Error: ",error);
             throw error;
         })

         app.listen(process.env.PORT, () =>{
            console.log(`http://localhost:${process.env.PORT}`)
         })
    } catch (error) {
        console.log("Error: ",error);
    }
 })()
 */
