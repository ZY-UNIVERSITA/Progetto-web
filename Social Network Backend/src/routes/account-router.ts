import { Router } from "express"
import * as accountController from "../controllers/account-controller"
import { authBeforeUpload, upload } from "../utils/upload";

const router: Router = Router();

router.put("/api/account/information/", accountController.changeInformation)
router.put("/api/account/password/", accountController.changePassword)
router.delete("/api/account/delete/", accountController.deleteAccount)
router.post("/api/upload/profile_banner/", authBeforeUpload, upload.fields([
    { name: "profile_picture", maxCount: 1 },
    { name: "banner_picture", maxCount: 1 }
]), accountController.uploadProfileBanner)

export default router;