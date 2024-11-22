import { Router } from "express"
import * as interactionController from "../controllers/interaction-controller"

const router: Router = Router();

router.post("/api/post/like/", interactionController.postLike)

export default router;