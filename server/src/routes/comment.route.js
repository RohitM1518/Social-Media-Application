import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getPostComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:postid").get(getPostComments).post(addComment);
router.route("/:commentid").delete(deleteComment).patch(updateComment);

export default router