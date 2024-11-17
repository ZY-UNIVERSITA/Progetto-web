import { Router } from "express"
import * as postController from "../controllers/posts-controller"

const router: Router = Router();

router.get("/api/post/:id", postController.postID)
router.get("/api/posts/user/:id", postController.postsUser)
router.get("/api/popularPosts", postController.popularPosts)
router.get("/api/popularPosts/loggedUser", postController.popularPostsLogged)

export default router;