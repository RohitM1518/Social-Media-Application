import { Router } from "express";
import { deletePost, getAllPosts,getPostById, getAllPostsByUserID, publishAPost,  updatePost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middelware.js";

const router = Router()
router.route("/").post(verifyJWT, upload.fields([
    {
        name:'PostFile',
        maxCount:1
    },
]),publishAPost)

router.route("/").get(getAllPosts)
router.route("/:postid").get(getPostById).patch(verifyJWT, upload.fields([
   { 
    name:'PostFile',
    maxCount:1
}
]),updatePost).delete(verifyJWT,deletePost)
router.route("/user/:userId").get(getAllPostsByUserID)

export default router;