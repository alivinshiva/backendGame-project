/*
==================== NOTES ====================
File: app.js

Why use this file:
- Sets up the Express application and configures global middleware.
- Centralizes CORS, JSON parsing, static file serving, and cookie parsing logic.
- Imports and declares all route modules for the app.

How it works:
- Creates an Express app instance.
- Applies middleware for CORS, JSON parsing, URL encoding, static files, and cookies.
- Imports user routes and mounts them at '/users'.
- Exports the configured app for use in the main entry file.

What if we don't use this file:
- Middleware and routes would be scattered, making the app harder to maintain.
- No central place to configure global app behavior.
- New developers would struggle to find where the app is set up.
==============================================
*/
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static("public"))
app.use(cookieParser())



// Routes import

import userRouter from './routes/user.routes.js'


// Routes decleration
app.use("/users" , userRouter)

export { app }