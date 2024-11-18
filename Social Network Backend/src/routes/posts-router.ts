import { Router } from "express"
import * as postController from "../controllers/posts-controller"

const router: Router = Router();

router.post("/api/post/:id", postController.postID)
router.get("/api/posts/user/:id", postController.postsUser)
router.get("/api/popularPosts", postController.popularPosts)

export default router;