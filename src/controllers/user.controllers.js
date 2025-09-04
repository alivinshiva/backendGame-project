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
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadFileCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req , res) => {
   /*  requirement for user register
    1> check for existing user by checking email and username in DB_NAME
    2> check for user enter valid password
    3> check for user has selected avatar and cover Image
    4> upload image avatar and cover to Cloudinary.
    5>  create a user in db 
    6> remove passoward and token from response, so that it cant be avilable in frontend.Cloudinary 
    7> check user created or not.
    8> return response to frontend.
    */

    const {fullName, email, password, username  } = req.body
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);

        if(fullName === "") {
            throw new ApiError(400, "full name is required")
        }
    
        if(password === "") {
            throw new ApiError(400, "Password is required")
        }
    
        if(email === "") {
            throw new ApiError(400, "Email is required")
        }
    
        if(username === "") {
            throw new ApiError(400, "username is required")
        }

        const existingUser = await User.findOne(
            {
                $or: [{username}, {email}]
            }
        )

        if(existingUser) {
            throw new ApiError(409, "Username or email already exist")
        }
    

        const avatarLocalFilePath = req.files?.avatar[0]?.path
        const coverImageLocalfilePath = req.files?.coverImage[0]?.path

        if(!avatarLocalFilePath) {
            throw new ApiError(400, "Please upload avatar")
        }

        const avatar = await uploadFileCloudinary(avatarLocalFilePath)
        const coverImage = await uploadFileCloudinary(coverImageLocalfilePath)

        if(!avatar) {
            throw new ApiError(400, "Please upload avatar")
        }

        const user = await User.create({
            email,
            password,
            fullName,
            avatar: avatar,
            username: username.toLowerCase(),
            coverImage: coverImage || "",
        })

        const userCreated = await User.findById(user._id).select(
            "-password -refreshToken"
        )

        if (!userCreated) {
            throw new ApiError(500, "Something went wrong! Try again.")
        }

        return res.status(201).json(
            new ApiResponse(200, "User created Successfully", userCreated)
        )
})


export {registerUser}