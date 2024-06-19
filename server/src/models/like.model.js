import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    likedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

},{timestamps:true})

export const Like = mongoose.model("Like",likeSchema) 