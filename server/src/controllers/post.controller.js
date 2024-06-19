import mongoose, { isValidObjectId } from "mongoose"
import { Post } from "../models/post.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"



const getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortType = "asc" } = req.query
    let pipeline = [
        {
            $match: {
                isPublished: true
            }
        },
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
                as: "users",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                            avatar: 1,
                            coverImage: 1,
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
    if (!content) throw new ApiError(400, "Content is required ")
    const PostfileLocalpath = req.files?.PostFile[0]?.path
    if (!PostfileLocalpath && !thumbnailLocalpath) throw new ApiError(422, 'No file uploaded')

    const PostfileURL = await uploadOnCloudinary(PostfileLocalpath)
    //console.log("Post File URL",PostfileURL)

    if (!PostfileURL) {
        throw new ApiError(503, 'Post could not be uploaded at the moment')
    }
    const publishedPost = await Post.create({
        file: PostfileURL?.url,
        owner: req.user._id,
        content: content
    }
    )

    if (!publishedPost) {
        throw new ApiError(500, 'Failed to save Post in database')
    }

    return res.status(200).json(new ApiResponse(200, { publishedPost }, 'Post has been published'))

})

const getPostById = asyncHandler(async (req, res) => {
    const { PostId } = req.params
    console.log("Post ID", PostId)
    if (!PostId) throw new ApiError(400, "Post id is required")
    if (!mongoose.isValidObjectId(PostId)) {
        throw new ApiError(400, "Invalid Post id")
    }
    const Post = await Post.findOne({ _id: new mongoose.Types.ObjectId(PostId)}).populate('owner', 'username email avatar')
    // console.log("Post", Post)

    if (!Post) {
        throw new ApiError(404, "Post not found")
    }
    await Post.save()
    return res
        .status(200)
        .json(new ApiResponse(200, { Post }, "Post found successfully"))

})

const updatePost = asyncHandler(async (req, res) => {
    const { PostId } = req.params
    const { content } = req.body
    //console.log("Post ID", PostId,"title",title,"description",description)
    if (!content) throw new ApiError(400, "Content is required ")
    if (!PostId) throw new ApiError(400, "Post id is required")
    if (!mongoose.isValidObjectId(PostId)) {
        throw new ApiError(400, "Invalid Post id")
    }

    const postLocalpath = req.files?.thumbnail[0]?.path
    if (!postLocalpath) throw new ApiError(400, "Thumbnail is required")

    const post = await uploadOnCloudinary(thumbnailLocalpath);
    if (!post) throw new ApiError(503, "Failed to upload thumbnail")

    const updatedPost = await Post.findOneAndUpdate({ _id: PostId, owner: req.user._id }, {
        title,
        description,
        file: post?.url
    }, { new: true }).populate('owner', 'username email')
    //console.log("Updated Post", updatedPost)

    if (!updatedPost) {
        throw new ApiError(404, "Post is not found or not updated")
    }

    res.status(200).json(new ApiResponse(200, { data: updatedPost }, "Post updated successfully"))

})

const deletePost = asyncHandler(async (req, res) => {
    const { PostId } = req.params
    if (!PostId) throw new ApiError(400, "Post id is required")
    if (!mongoose.isValidObjectId(PostId)) {
        throw new ApiError(400, "Invalid Post id")
    }
    const Post = await Post.findOneAndDelete({ _id: PostId, owner: req.user._id })

    res.status(200).json(new ApiResponse(200, { data: Post }, "Post deleted successfully"))
})


const getAllpostsByUserID = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!userId) throw new ApiError(400, "User id is required")
    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    const posts = await Post.find({ owner: userId }).populate('owner', 'username email avatar')

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
    getAllpostsByUserID,
    getAllPosts
}