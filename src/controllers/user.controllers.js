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
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


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

// logOut user 
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
// Controller to handle refreshing the access token using a valid refresh token
// 1. Extracts the refresh token from cookies
// 2. Verifies the token and finds the user
// 3. Checks if the token matches the user's stored refresh token
// 4. Issues a new access token and refresh token, sets them as cookies
const getRefreshAccessToken = asyncHandler(async (req, res) => {
    // Get the refresh token from cookies (typo fix: should be req.cookies)
    const incommingRefreshToken = req.cookies.refreshToken;

    if (!incommingRefreshToken) {
        // No refresh token provided
        throw new ApiError(403, "Unauthorized Request")
    }
    // Verify the refresh token
    const decodedToken = jwt.verify(incommingRefreshToken, process.env.JWT_REFRESH_TOKEN)

    // Find the user by ID from the decoded token
    const user = await User.findById(decodedToken?._id)

    if (!user) {
        // No user found for this token
        throw new ApiError(404, "Invalid Refresh Token")
    }

    if (incommingRefreshToken !== user.refreshToken) {
        // The provided refresh token does not match the one stored for the user
        throw new ApiError(403, "Token not matched")
    }

    const options = {
        httpOnly: true,
        secure: true
    }
    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    // Set new tokens as cookies and respond
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(200, "Access Token refreshed")
        )
})

// changine current password

const changePassword = asyncHandler(async (req, res) => {
    const { newPassword, oldPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(403, "Wrong Old Password")
    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Passwprd changed successfylly")
        )
})

// getting current User

const currentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "Current user fetched")
})

// updating account Details
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new ApiError(405, "Both fields are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        // here we are using mongoDb operator. to manuplate the data.
        {
            $set: {
                fullName: fullName,
                email: email
            }
        }
        , { new: true }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Detail updated"))
})

// updating Avatar

const updateAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file not find... update failed,  try again !!!!!")
    }

    const avatar = await uploadFileCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(402, "Error updating Avatar,  try again !!!!!")
    }

    const user = await User.findByIdAndUpdate(req.file?._id,
        // here we are using mongoDb operator. to manuplate the data.
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Avatar updated"))

})


// updating cover image 
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Avatar file not find... update failed,  try again !!!!!")
    }

    const coverImage = await uploadFileCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(402, "Error updating Cover Image,  try again !!!!!")
    }

    const user = await User.findByIdAndUpdate(req.file?._id,
        // here we are using mongoDb operator. to manuplate the data.
        {
            $set: {
                coverImage: coverImage.url
            }
        }, { new: true }).select("-password")

    return res.status(200).json(new ApiResponse(200, user, "Cover Image updated"))

})


// getting channel info.

const userChannelprofile = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username missing")
    }

    // using mongodb aggregation pipeline
    const channel = await User.aggregate([
        // pipeline is kind of object, and aggregate is kind of array, aggregate may contain multiple pipeline in form of stage, output of previous pipeline is imput for the next pipeline.

        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: {
                    $size: "$subscribers"
                },
                channelSubscribedToCount: {
                    $size: "subscribedTo"
                }, 
                isSubscribed :{
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            },
        },
        {
            $project: {
                email: 1,
                avatar: 1,
                fullName: 1,
                username: 1,
                coverImage: 1,
                isSubscribed: 1,
                subscriberCount: 1,
                channelSubscribedToCount: 1
                
            }
        }
    ])

    if(!channel?.length) {
        throw new ApiError(405, "channer not found")
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched")
    )
})

// watch hisrory

// Controller to get the user's watch history with video and owner details
const getWatchHistory = asyncHandler(async(req, res) => {
    // Aggregate pipeline to fetch the user and populate watchHistory with video and owner info
    const user = await User.aggregate([
        {
            // Match the user by their ObjectId (why: to get only the current user's data)
            $match: {
                _id: new mongoose.Types.ObjectId(req.user_id)
            }
        },
        {
            // Lookup videos in the user's watchHistory array (why: to get full video docs)
            $lookup: {
                from: "videos", // collection name for videos
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        // For each video, lookup the owner user (why: to get owner info for each video)
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    // Only include selected fields from owner (why: to avoid leaking sensitive info)
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        // Flatten the owner array to a single object (why: easier to use in frontend)
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    // Always return user[0] because aggregate returns an array (why: only one user is matched)
    return res 
        .status(200)
        .json(
            new ApiResponse(200, user[0].watchHistory , "Watch history fetched successfully")
        )
})


export {
    registerUser,
    loginUser,
    logOutUser,
    getRefreshAccessToken,
    changePassword,
    currentUser,
    updateAvatar,
    userChannelprofile,
    updateAccountDetails,
    updateCoverImage,
    getWatchHistory
}