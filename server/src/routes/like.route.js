import { Router } from 'express';
import {
    getLikedPosts,
    togglePostLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(togglePostLike);
router.route("/videos").get(getLikedPosts);

export default router