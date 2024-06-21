import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Post } from "../models/post.model.js"

const togglePostLike = asyncHandler(async (req, res) => {
    const {postid} = req.params
    if(!postid || !isValidObjectId(postid)){
        throw new ApiError(400,"Invalid request to like post")
    }
    
    const post = await Post.findById(postid)
    if(!post) throw new ApiError(404, "post not found")

    const like = await Like.findOne({likedBy:req.user._id, post:postid})
    console.log("Like  is ",like);
    if(like){
        await Like.findByIdAndDelete(like._id)
        return res.status(200).json(new ApiResponse(200, null, "post is unliked successfully"))
    }
    else{
        await Like.create({likedBy:req.user._id, post:postid})
        return res.status(201).json(new ApiResponse(201, null, "post is liked successfully"))
    }
})


const getLikedPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    if(page < 1) throw new ApiError(400, "Invalid page number")
    if(limit < 1) throw new ApiError(400, "Invalid limit")

    const skip = (page - 1) * limit
    const pipeline = [
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        },
        {
            $lookup: {
                from: "posts",
                localField: "post",
                foreignField: "_id",
                as: "post",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        email: 1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$post"
        },
        {
            $unwind: "$post.owner"
        },
        {
            $sort: {
                'post.createdAt': -1
            }
        },
        {
            $project: {
                _id: 0,
                _id: "$post._id",
                content: "$post.content",
                file: "$post.file",
                format: "$post.format",
                createdAt: "$post.createdAt",
                likedBy: "$post.likedBy",
                owner: {
                    username: "$post.owner.username",
                    email: "$post.owner.email"
                }
            }
        }
    ];
    
    
    
    
    
    

const likedposts = await Like.aggregate(pipeline)
if(!likedposts) throw new ApiError(500, "Something went wrong while fetching liked posts")

res.status(200).json(new ApiResponse(200, likedposts, "Liked posts are fetched successfully"))
})

const isPostLiked = asyncHandler(async(req,res)=>{
    const {postid} = req.params
    if(!postid || !isValidObjectId(postid)){
        throw new ApiError(400,"Invalid request to get like status")
    }
    const like = await Like.findOne({likedBy:req.user._id, post:new mongoose.Types.ObjectId(postid)})
    if(like){
        return res.status(200).json(new ApiResponse(200, true, "Post is liked by user"))
    }
    else{
        return res.status(200).json(new ApiResponse(200, false, "Post is not liked by user"))
    }
})

export {
    togglePostLike,
    getLikedPosts,
    isPostLiked
}