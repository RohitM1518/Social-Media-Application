import mongoose, { isValidObjectId } from "mongoose"
import { Post } from "../models/post.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"



const getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "desc" } = req.query
    let pipeline = [
        {
            $sort: {
                [sortBy]: sortType === 'desc' ? -1 : 1
            }
        },
        {
            $skip: (page - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        },
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
                            email: 1,
                        }
                    }
                ]
            }
        },
    ]
    const posts = await Post.aggregate(pipeline)

    if (!posts) {
        throw new ApiError(500, "No posts found")
    }

    return res.status(200).json(new ApiResponse(200, { posts }, "posts fetched Successfully"))
})

const publishAPost = asyncHandler(async (req, res) => {
    const { content } = req.body
    let PostfileLocalpath;
    const PostFile= req.files?.PostFile
    if(PostFile){
        PostfileLocalpath = req.files?.PostFile[0]?.path
    }
    if (!PostfileLocalpath && !content) throw new ApiError(422, 'File or content is required to post')
    
    const PostfileURL = await uploadOnCloudinary(PostfileLocalpath)
    //console.log("Post File URL",PostfileURL)
    console.log("hello",PostfileURL)
    if (!PostfileURL && PostfileLocalpath) {
        throw new ApiError(503, 'Post could not be uploaded at the moment')
    }
    const publishedPost = await Post.create({
        file: PostfileURL?.url || '',
        owner: req.user._id,
        content: content,
        format: PostfileURL?.format || ''
    }
    )

    if (!publishedPost) {
        throw new ApiError(500, 'Failed to save Post in database')
    }

    return res.status(200).json(new ApiResponse(200, { publishedPost }, 'Post has been published'))

})

const getPostById = asyncHandler(async (req, res) => {
    const { postid } = req.params
    // console.log("Post ID", postid)
    if (!postid) throw new ApiError(400, "Post id is required")
    if (!mongoose.isValidObjectId(postid)) {
        throw new ApiError(400, "Invalid Post id")
    }
    const post = await Post.findOne({ _id: new mongoose.Types.ObjectId(postid) }).populate('owner', 'username email avatar')
    // console.log("Post", Post)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }
    await post.save()
    return res
        .status(200)
        .json(new ApiResponse(200, { post }, "Post found successfully"))

})

const updatePost = asyncHandler(async (req, res) => {
    const { postid } = req.params
    const { content } = req.body
    //console.log("Post ID", postid,"title",title,"description",description)
    if (!postid) throw new ApiError(400, "Post id is required")
    if (!mongoose.isValidObjectId(postid)) {
        throw new ApiError(400, "Invalid Post id")
    }
    console.log("HI")
    let post;
    const PostFile =req.files?.PostFile
    let postLocalpath;
    if(PostFile){
        postLocalpath = req.files?.PostFile[0]?.path
    }
    if (!postLocalpath && !content) throw new ApiError(400, "Post File or content is required")
    // console.log("HI")
    if (postLocalpath) {
         post = await uploadOnCloudinary(postLocalpath);
        if (!post) throw new ApiError(503, "Failed to upload thumbnail")
    }
    const updatedPost = await Post.findOneAndUpdate({ _id: postid, owner: req.user._id }, {
        content,
        file: post?.url
    }, { new: true }).populate('owner', 'username email')
    //console.log("Updated Post", updatedPost)

    if (!updatedPost) {
        throw new ApiError(404, "Post is not found or not updated")
    }

    res.status(200).json(new ApiResponse(200, { data: updatedPost }, "Post updated successfully"))

})


const deletePost = asyncHandler(async (req, res) => {
    const { postid } = req.params
    if (!postid) throw new ApiError(400, "Post id is required")
    if (!mongoose.isValidObjectId(postid)) {
        throw new ApiError(400, "Invalid Post id")
    }
    const post = await Post.findOneAndDelete({ _id: postid, owner: req.user._id })

    res.status(200).json(new ApiResponse(200, { data: post }, "Post deleted successfully"))
})


const getAllPostsByUserID = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) throw new ApiError(400, "User id is required")
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const posts = await Post.find({ owner: new mongoose.Types.ObjectId(userId) }).populate('owner', 'username email').sort({ createdAt: -1 });

    if (!posts) {
        throw new ApiError(500, "No posts found")
    }

    res.status(200).json(new ApiResponse(200, { posts }, "posts fetched Successfully"))
})

export {
    publishAPost,
    getPostById,
    updatePost,
    deletePost,
    getAllPostsByUserID,
    getAllPosts
}