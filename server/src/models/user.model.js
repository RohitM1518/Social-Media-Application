import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            unique:true,
            lowercase:true,
            trim:true,
            index:true //Index helps to search in database and dont make all the fields as index because it will slow down the search
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        password:{
            type:String, //In database the password is stored as encrypted using bycryptjs package(npm install bcryptjs)
        },
        refreshToken:{
            type:String,
        },
    },{timestamps:true})

    userSchema.pre("save",async function (next){ 
    if(!this.isModified("password")) return next(); 
    this.password = await bcrypt.hash(this.password,10) 
    next()
    
}) 

userSchema.methods.isPasswordCorrect = async function(password){ 
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.addToWatchHistory = async function(videoId) {
    if (!this.watchHistory.includes(videoId)) {
        this.watchHistory.push(videoId);
        await this.save();
    }
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username:this.username,
        },
        process.env.ACCESS_TOKEN_SECRET, 
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User",userSchema) 