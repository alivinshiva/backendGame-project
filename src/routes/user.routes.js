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

// Import Express Router to define modular route handlers
import { Router } from "express";

// Import user-related controller functions
import { loginUser, logOutUser, registerUser, getRefreshAccessToken, changePassword, currentUser, updateAccountDetails, updateAvatar, updateCoverImage, userChannelprofile, getWatchHistory } from "../controllers/user.controllers.js";

// Import Multer middleware for handling file uploads (avatar, coverImage)
import { upload } from "../middlewares/multer.middleware.js";

// Import JWT verification middleware to protect secure routes
import { verifyJWT } from "../middlewares/auth.middleware.js";


// Create a new router instance for user-related routes
const userRouter = Router()


// User registration route
// Uses Multer middleware to handle file uploads for 'avatar' and 'coverImage' fields
// Passes control to registerUser controller after files are processed
userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)


// User login route
// Accepts username/email and password, returns JWT tokens on success
userRouter.route("/login").post(loginUser)


// Logout route (secured)
// Uses verifyJWT middleware to ensure only authenticated users can log out
userRouter.route("/logout").post(verifyJWT, logOutUser)

// userRouter.route("/logout").post(verifyJWT, logOutUser)

// Route to refresh access token using a valid refresh token
userRouter.route("/refresh-token").post(getRefreshAccessToken)

userRouter.route("/change-password").post(verifyJWT, changePassword)

userRouter.route("/current-user").get(verifyJWT, currentUser)

userRouter.route("/update-details").patch(verifyJWT, updateAccountDetails)

userRouter.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)

userRouter.route("/update-cover").patch(verifyJWT, upload.single("coverImage"),updateCoverImage)

userRouter.route("/c/:username").get(verifyJWT, userChannelprofile)

userRouter.route("/watch-history").get(verifyJWT, getWatchHistory)




// Export the userRouter for use in the main app
export default userRouter