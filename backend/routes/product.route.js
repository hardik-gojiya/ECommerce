import { Router } from "express";
import {
  addProduct,
  fetchAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  fetchProductByCategory,
  fetchProductBySubCategory,
} from "../controllers/Product.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post(
  "/addProduct",
  upload.array("image", 5),
  AuthMiddleware,
  addProduct
);
router.get("/getAllProducts", fetchAllProducts);
router.get("/getProductById/:id", getProductById);
router.put(
  "/updateProduct/:id",
  upload.array("image"),
  AuthMiddleware,
  updateProduct
);
router.delete("/deleteProduct/:id", AuthMiddleware, deleteProduct);
router.get("/fetchProductByCategory/:id", fetchProductByCategory);
router.get(
  "/fetchProductBySubCategory/:subCategory",
  fetchProductBySubCategory
);

export default router;
