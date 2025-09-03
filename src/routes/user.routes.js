/*
==================== NOTES ====================
File: user.routes.js

Why use this file:
- Defines all user-related API routes in one place.
- Keeps route logic organized and separate from controllers and app setup.
- Makes it easy to add, update, or remove user endpoints.

How it works:
- Creates an Express Router instance.
- Maps the '/register' POST route to the registerUser controller.
- Exports the router for use in app.js.

What if we don't use this file:
- User routes would be mixed with other routes, making code harder to maintain.
- Route definitions would be scattered, increasing risk of errors.
- New endpoints would be harder to add and document.
==============================================
*/
import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields(
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ),
    registerUser
)

export default userRouter