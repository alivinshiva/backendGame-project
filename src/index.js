/*
==================== NOTES ====================
File: index.js

Why we use this file:
- This is the main entry point for the backend application.
- It initializes the database connection and starts the Express server.
- Centralizes app startup logic for maintainability and clarity.

How it is structured:
- Imports the Express app and database connection logic.
- Connects to MongoDB using connectDB().
- Handles server startup and error events.
- Contains fallback code for alternative server initialization (commented).

What happens if we don't use this file:
- The server won't start, and no requests will be handled.
- Database connection logic would be scattered, making maintenance harder.
- Application entry would be unclear, causing confusion for new developers.
==============================================
*/
// require('dotenv').config()
// import dotenv from 'dotenv'
import { app } from "./app.js";
import connectDB from "./db/index.js";

// dotenv.config({
//     path: './env'
// })

connectDB()
.then(() => {
    app.on("err", (err) => {
        console.log(`Connection error: ${err}`);
        throw err
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running PORT: ${process.env.PORT}`);
    })
    
})
.catch((err) => {
    console.log(`MongoDB connection Failed!! ${err}`);
    
})













/*
import express from 'express'
const app = express()

    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on("error", (error) => {
                console.log("Error: ", error);
                throw error
            })

            app.listen(process.env.PORT, () => {
                console.log("Connected to Port: ", process.env.PORT);
                
            })
        } catch (error) {
            console.error("Error: ", error)
            throw error
        }
    })()
*/