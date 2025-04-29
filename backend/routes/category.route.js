import { Router } from "express";
import {
  addCategory,
  addSubCategory,
  fetchOneCategory,
  getAllCategories,
  getSubCategory,
  getSubCategoryByName,
} from "../controllers/Category.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/addCategory",
  upload.single("categoryImg"),
  AuthMiddleware,
  addCategory
);
router.get("/getCategories", getAllCategories);
router.get("/getOneCategories/:id", fetchOneCategory);
router.post("/addSubCategories", AuthMiddleware, addSubCategory);
router.get("/getSubCategories/:id", getSubCategory);
router.get("/getSubCategoriesbyname/:category", getSubCategoryByName);

export default router;
