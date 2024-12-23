import { Router } from "express"
import * as interactionController from "../controllers/interaction-controller"

const router: Router = Router();

router.post("/api/post/like/add", interactionController.postLikeAdd);
router.post("/api/post/like/remove", interactionController.postLikeRemove);
router.get("/api/post/comments/:id", interactionController.getPostComments);
router.post("/api/post/addComment/", interactionController.postNewComment);
router.get("/api/search/:query", interactionController.search);
router.delete("/api/comment/:id", interactionController.deleteComment)

export default router;