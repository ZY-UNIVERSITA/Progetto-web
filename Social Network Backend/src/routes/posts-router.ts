import { Router } from "express"
import * as postController from "../controllers/posts-controller"

const router: Router = Router();

router.get("/api/post/:id", postController.postID)
router.get("/api/posts/user/:username", postController.postsUser)
router.get("/api/popularPosts", postController.popularPosts)

export default router;