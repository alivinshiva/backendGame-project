import dotenv from 'dotenv'
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

dotenv.config({
    path: './.env'
})

const connectDB = async () => {
    try {
        const connectionDetail = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB connected !! DB HOST: ${connectionDetail.connection.host}`);
        
    } catch (error) {
        console.log(`MongoDB connection error: ${error}`);
        process.exit(1) // exit if not connected.
    }
}

export default connectDB