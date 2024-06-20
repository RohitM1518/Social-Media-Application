import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Post } from "../models/post.model.js"

const getPostComments = asyncHandler(async (req, res) => {
    const { postid } = req.params
    const { page = 1, limit = 10 } = req.query

    if(!postid || !mongoose.isValidObjectId(postid)) throw new ApiError(400, "Invalid request to get comments")
    if(page < 1) throw new ApiError(400, "Invalid page number")
    if(limit < 1) throw new ApiError(400, "Invalid limit")
    const skip = (page - 1) * limit

    const pipeline = [{
        $match: {
            post: new mongoose.Types.ObjectId(postid)
        }
    },{
        $sort: {
            createdAt: -1
        }
    },{
        $skip: skip
    },{
        $limit: limit
    },{
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    },{
        $unwind: "$owner"
    },{
        $project: {
            _id: 1,
            content: 1,
            createdAt: 1,
            owner: {
                _id: 1,
                username: 1,
                email: 1
            }
        }
    
    }]
    const comments = await Comment.aggregate(pipeline)
    if(!comments) throw new ApiError(500, "Something went wrong while fetching comments")
    res.status(200).json(new ApiResponse(200, comments, "Comments are fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    const {postid}= req.params
    console.log(postid)
    if(!postid) throw new ApiError(400, "Invalid request to add comment")
    const { content } = req.body
    if(!content || typeof content !== 'string') throw new ApiError(400, "Content is required to add a comment")

    const video = await Post.findById(postid)

    if(!video) throw new ApiError(404, "Video not found")

    const comment = await Comment.create({
        content,
        post: postid,
        owner: req.user._id
    })
    if(!comment) throw new ApiError(500, "Something went wrong while adding the comment")
    return res.status(201).json(new ApiResponse(201, comment, "Comment is added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentid } = req.params
    if(!commentid) throw new ApiError(400, "Invalid request to update a comment")
    const { content } = req.body
    if(!content || typeof content !== 'string') throw new ApiError(400, "Content is required to add a comment")
    const updatedComment = await Comment.findByIdAndUpdate(commentid,{
        content
    },{new:true}).populate('owner','username email').populate('post','content')
    if(!updatedComment) throw new ApiError(500, "Something went wrong while adding the comment")
    return res.status(201).json(new ApiResponse(201, updatedComment, "Comment is updated successfully"))

})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentid } = req.params
    if(!commentid) throw new ApiError(400, "Invalid request to delete a comment")
    const deletedComment = await Comment.findByIdAndDelete(commentid)
    if(!deletedComment) throw new ApiError(500, "Something went wrong while deleting the comment")
    return res.status(200).json(new ApiResponse(200, deletedComment, "Comment is deleted successfully"))
})

export {
    getPostComments,
    addComment,
    updateComment,
    deleteComment
}