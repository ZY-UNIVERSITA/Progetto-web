import { Router } from "express"
import * as interactionController from "../controllers/interaction-controller"

const router: Router = Router();

router.post("/api/post/like/add", interactionController.postLikeAdd);
router.post("/api/post/like/remove", interactionController.postLikeRemove);

export default router;