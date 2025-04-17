import { Router } from "express";
import {
  addCategory,
  getAllCategories,
} from "../controllers/Category.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addCategory", AuthMiddleware, addCategory);
router.get("/getCategories", getAllCategories);

export default router;
