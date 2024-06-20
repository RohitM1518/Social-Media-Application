import { Router } from 'express';
import {
    getLikedPosts,
    togglePostLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:postid").post(togglePostLike);
router.route("/").get(getLikedPosts);

export default router