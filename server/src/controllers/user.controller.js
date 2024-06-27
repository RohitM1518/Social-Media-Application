import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        // console.log("User in method",user)
        const accessToken = user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        //we are storing refresh token in database only for logged-in users not for the new registered ones
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }) //validateBeforeSave is set to false because we are not validating the password while saving the refresh token
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if ([email, username, password].some((feild) => feild?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    

    const user = await User.create(
        {
            email,
            password,
            username: username?.toLowerCase()
        }
    )

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //This means we are not sending the password and refreshToken to the frontend
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(createdUser._id)

    const options = {
        httpOnly: true, //This means that the cookie can only be accessed by the server
        secure: false //This means a cookie can only be accessed by the server if the request is being sent over HTTPS
        //TODO: For production set it to true
    }


    return res.status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, {user:createdUser,accessToken,refreshToken},"User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {

    const { username, password } = req.body
    if (!username) {
        throw new ApiError(400, "Email or Username is required")
    }
    const user = await User.findOne({username: username });

    if (!user) {
        throw new ApiError(404, "User Does not Exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user Credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
    // console.log("accessToken", accessToken)
    // console.log("refreshToken", refreshToken)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    //or user.refreshToken = refreshToken

    const options = {
        httpOnly: true, //This means that the cookie can only be accessed by the server
        secure: false //This means a cookie can only be accessed by the server if the request is being sent over HTTPS
        //TODO: For production set it to true
    }
    console.log("Access token",accessToken)

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {user: loggedInUser ,accessToken,refreshToken},
            "User Logged In Successfully"
        ))

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $unset: {
                refreshToken: 1 
            },

        },
        {
            new: true 
        })
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User logged Out"))
})



const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    // console.log("incoming refresh token", incomingRefreshToken)
    console.log("Refresh Token later",req.body.refreshToken)
   // console.log("incoming refresh token", incomingRefreshToken)
    if (!incomingRefreshToken || incomingRefreshToken === "null") {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify( 
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or used")
        }
        const options = {
            httpOnly: true,
            secure: true,
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        return res.status(200).cookie("accessToken", accessToken,options).cookie("refreshToken", refreshToken,options).json(new ApiResponse(200, { user: user,accessToken,refreshToken }, "Access Token Refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)
    // console.log("User ",user)
   // console.log("Old password is:  ",oldPassword,"\nNew Password is : ",newPassword);
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false }) //validateBeforeSave is set to false because we are not validating the password while saving the refresh token

    return res.status(200).json(new ApiResponse(
        200,
        {},
        "Password Updated Successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched Successfully"))
})
const getUserById = asyncHandler(async (req, res) => {
    const {userid}= req.params
    if(!userid){
        throw new ApiError(400,"User Id is required")
    }
    const user = await User.findById(userid)
    if(!user){
        throw new ApiError(400,"No Such user exists")
    }
    return res.status(200).json(new ApiResponse(200, user, "user fetched Successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body
   // console.log("fullname", fullname, "email", email)
    if (!fullname && !email) {
        throw new ApiError(400, "All feilds are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: { fullname, email: email }
    }, { new: true }).select("-password") //This option, when set to true, instructs Mongoose to return the modified document rather than the original one. 

    console.log("Successfull")
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        user,
        "Account Details Updated Successfully"
    ))
})



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    getUserById
}