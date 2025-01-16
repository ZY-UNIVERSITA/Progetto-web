import { Router } from "express"
import * as messagesController from "../controllers/messages-controller"

const router: Router = Router();

router.get("/api/messages/", messagesController.getAllMessages);

export default router;