import { Router } from "express"
import * as postController from "../controllers/posts-controller"
import { authBeforeUpload, upload } from "../utils/upload";
import { getUser } from "../utils/auth";

const router: Router = Router();

router.get("/api/posts/user/:username", postController.postsUser)
router.get("/api/popularPosts", postController.popularPosts)
router.get("/api/post/images/", postController.postImages)
router.get("/api/post/:id", postController.postID)
router.post("/api/newPost", authBeforeUpload, upload.array('image', 10), postController.newPost)

export default router;