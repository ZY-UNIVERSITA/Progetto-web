import { Router } from "express"
import * as accountController from "../controllers/account-controller"

const router: Router = Router();

router.put("/api/account/information/", accountController.changeInformation)
router.put("/api/account/password/", accountController.changePassword)
router.delete("/api/account/delete/", accountController.deleteAccount)

export default router;