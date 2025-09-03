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
        this.password = bcrypt.hash(this.password, 10)
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
    jwt.sign(
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
    jwt.sign(
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