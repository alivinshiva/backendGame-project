/*
==================== NOTES ====================
File: user.controllers.js

Why use this file:
- Contains controller logic for user-related API endpoints.
- Keeps business logic separate from route definitions and app setup.
- Makes it easy to test, update, or expand user features.

How it works:
- Imports asyncHandler to handle errors in async functions.
- Defines registerUser controller for user registration endpoint.
- Exports controllers for use in route files.

What if we don't use this file:
- Business logic would be mixed with route definitions, making code harder to maintain.
- Error handling would be inconsistent and repetitive.
- Adding new user features would be more difficult.
==============================================
*/
import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler( async (req , res) => {
    res.status(200).json({
        message: "All Ok!!!!"
    })
})


export {registerUser}