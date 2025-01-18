import { Router } from "express"
import * as usersController from "../controllers/users-controller"

const router: Router = Router();

router.get("/api/user/:username", usersController.userProfile)
router.get("/api/friend/search/:username", usersController.isFriend)
router.get("/api/friends", usersController.getFriendsList)


export default router;