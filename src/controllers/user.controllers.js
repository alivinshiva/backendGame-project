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


const generateAccessTokenAndRefreshToken = async (userId) => {
    // try {
        const user = await User.findById(userId)
        if (!user) {
        throw new ApiError(404, "User not found for token generation");
}
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        user.accessToken = accessToken
        console.log(refreshToken);
        
        if (!refreshToken) {
            throw new ApiError(500, "canot generate acces and refresh token")
        }

        return { accessToken, refreshToken }
    // } catch (error) {
    //     throw new ApiError(500, "Something went wrong cannot generate generateAccessTokenAndRefreshToken")
    // }
}

// registerUser code
const registerUser = asyncHandler(async (req, res) => {
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

    const { fullName, email, password, username } = req.body
    console.log(`email: ${email}`);
    console.log(`password: ${password}`);

    if (fullName === "") {
        throw new ApiError(400, "full name is required")
    }

    if (password === "") {
        throw new ApiError(400, "Password is required")
    }

    if (email === "") {
        throw new ApiError(400, "Email is required")
    }

    if (username === "") {
        throw new ApiError(400, "username is required")
    }

    const existingUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    )

    if (existingUser) {
        throw new ApiError(409, "Username or email already exist")
    }


    const avatarLocalFilePath = req.files?.avatar[0]?.path
    // const coverImageLocalfilePath = req.files?.coverImage[0]?.path || ""
    let coverImageLocalfilePath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalfilePath = req.files?.coverImage[0]?.path
    }

    if (!avatarLocalFilePath) {
        throw new ApiError(400, "Please upload avatar")
    }

    const avatar = await uploadFileCloudinary(avatarLocalFilePath)
    const coverImage = await uploadFileCloudinary(coverImageLocalfilePath)

    if (!avatar) {
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

//Login user code.

const loginUser = asyncHandler(async (req, res) => {

    // Validate user using email/username
    // search that user in db
    // if find match the stored hash password
    // if correct give token else throw error
    // 
    const { username, password, email } = req.body
    console.log(username);
    console.log(password);
    console.log(email);

    // if (password === "") {
    //     throw new ApiError(400, "Password is required")
    // }

    // if (email === "" || username === "") {
    //     throw new ApiError(400, "Email or Username is required")
    // }
    
    // if (!(!username || !email)) {
    //     throw new ApiError(400, "Email or Username is required")

    // }

    if (!username || !email) {
        throw new ApiError(400, "Email or Username is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isValidPass = await user.isPasswordCorrect(password)
    if (!isValidPass) {
        throw new ApiError(404, "Invalid password")
    }

    const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // cookies
    // this option prevent cookie to modified from client side, can only be modified by server.
    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: accessToken, refreshToken, loggedInUser
                },
                "You logged in !!!!!!!!"
            )
        )


})

/// logOut user 
const logOutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refreshToken: undefined }
        },
        {
            new: true
        }
    )
        const options = {
        httpOnly: true,
        secure: true,
    }
    return res 
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)    
    .json(
        new ApiResponse(200, {}, "user logged Out")
    )
    console.log("logged out !!!! ");
    
})

export { registerUser, loginUser, logOutUser }