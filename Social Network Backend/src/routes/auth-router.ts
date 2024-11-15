import { Router } from "express"
import * as authControllers from "../controllers/auth-controller"

const router: Router = Router();

router.post("/api/auth/register", authControllers.register)
router.post("/api/auth/login", authControllers.login)
router.post("/api/auth/logout", authControllers.logout)
router.post("/api/auth/profile", authControllers.profile)

export default router;