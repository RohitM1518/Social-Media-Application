// require('dotenv').config({path:"./env"}) used to make all the env variable once the
import dotenv from "dotenv"
import connectDB from "./db/connectDB.js"
import { app } from "./app.js"

//This will make sure that all the env variable are loaded once the app is started
dotenv.config({
    path:"./.env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log("Server is running at",process.env.PORT)
    })
})
.catch((e)=>{
    console.log("MONGODB connection error",e);
})