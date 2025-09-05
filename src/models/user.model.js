/*
==================== NOTES ====================
File: user.model.js

Why use this file:
- Defines the User schema and model for MongoDB using Mongoose.
- Centralizes user data structure, validation, and authentication logic.
- Handles password hashing and token generation for security.

How it works:
- Sets up a schema with fields for username, email, password, avatar, etc.
- Uses Mongoose middleware to hash passwords before saving.
- Adds methods for password comparison and JWT token generation.
- Exports the User model for use in controllers and routes.

What if we don't use this file:
- User data would be scattered and inconsistent across the project.
- Passwords might be stored insecurely without hashing.
- Authentication and user management would be harder to maintain and extend.
==============================================
*/
import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";


const userSchema = new Schema(

    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowerCase: true

        },
        fullName: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        avatar: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        password: {
            type: String,
            required: [true, "Password is required"]
       

        },
        refreshToken: {
            type: String,
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]

    },
    { timestamps: true })

// incryption happening here just before saving the passwod to the DB.
userSchema.pre("save", async function (next) {
    // checking if password is modified or not, if not then we need not to run this code, we are keeping next outside of the if becasue it will run in all case.
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
// Hash the password before saving the user document
    }
    next()
})
    // Hash the password with bcrypt (salt rounds: 10)


// comparing the password before sending using bcrypt, 
// bcrypt give  us compare method to check password. which take 2 params, 1> user written password 2> encrypted password by bcrypt.
// it compasre and then return boolean.
userSchema.methods.isPasswordCorrect = async function (password) {
// Method to compare a plain password with the hashed password
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
// Method to generate JWT access token for authentication
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            username: this.username
        },
        process.env.JWT_ACCESS_TOKEN,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
// Method to generate JWT refresh token for session renewal
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_REFRESH_TOKEN,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPRY
        }
    )


}

export const User = mongoose.model("User", userSchema)
// Export the User model for use in other modules