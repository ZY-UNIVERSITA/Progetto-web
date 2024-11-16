import { Router } from "express"
import * as usersController from "../controllers/users-controller"

const router: Router = Router();

router.get("/api/user/:username", usersController.userProfile)

export default router;