import { Router } from "express";
import { deletePost, getAllPosts, getAllPostsByUserID, getVideoById, publishAPost,  updatePost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()
router.route("/publish-post").post(verifyJWT, upload.fields([
    {
        name:'file',
        maxCount:1
    },
]),publishAPost)

router.route("/get-all-posts").get(getAllPosts)
router.route("/get-post-by-id/:PostId").post(getVideoById)
router.route("/update-post/:PostId").post(verifyJWT, upload.fields([
   { 
    name:'thumbnail',
    maxCount:1
}
]),updatePost)
router.route("/delete-post/:videoId").post(verifyJWT,deletePost)
router.route("/get-user-posts/:channelId").get(getAllPostsByUserID)

export default router;