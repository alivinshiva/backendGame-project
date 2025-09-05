// verifying for logged in user, so that we can target that user for logged Out. 

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, res, next) => {
   try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
    if (!token) {
     throw new ApiError(401, "Token not found")
    }
 
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user){
     throw new ApiError(401, "invalid access Token")
    }
 
    req.user = user
    next()
   } catch (error) {
    throw new ApiError(401, error?.message || "invalid access Token")
   }

})