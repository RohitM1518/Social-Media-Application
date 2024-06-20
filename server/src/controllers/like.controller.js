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
    const pipeline=[
        {
            $match:{
                likedBy:req.user._id
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $lookup:{
                from:"posts",
                localField:"post",
                foreignField:"_id",
                as:"post",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        fullname:1,
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $unwind:"$post"
        },
        {
            $project:{
                _id:0,
                post:{
                    _id:1,
                    content:1,
                    file:1,
                    createdAt:1,
                    likedBy:1
                }
            }
        }
]

const likedposts = await Like.aggregate(pipeline)
if(!likedposts) throw new ApiError(500, "Something went wrong while fetching liked posts")

res.status(200).json(new ApiResponse(200, likedposts, "Liked posts are fetched successfully"))
})

export {
    togglePostLike,
    getLikedPosts
}