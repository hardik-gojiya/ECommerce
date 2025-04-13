import { Router } from "express";
import {
  registerUser,
  login,
  logout,
  editUserProfile,
  updateProfilePassword,
} from "../controllers/User.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", AuthMiddleware, logout);
router.put("/edit-user-profile/:id", AuthMiddleware, editUserProfile);
router.post(
  "/update-profile-password/:id",
  AuthMiddleware,
  updateProfilePassword
);

export default router;
