import { Router } from "express";
import { registerUser, login, logout } from "../controllers/User.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", AuthMiddleware, logout);

export default router;
