import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, getUserById } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/register").post(registerUser)

router.route("/login").post(loginUser)
//secured routes
router.route("/").delete(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/").patch(verifyJWT, changeCurrentPassword)
router.route("/").get(verifyJWT, getCurrentUser)
router.route("/:userid").get(verifyJWT,getUserById)
export default router