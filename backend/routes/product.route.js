import { Router } from "express";
import {
  addProduct,
  fetchAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  fetchProductByCategory,
} from "../controllers/Product.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/addProduct", upload.single("image"), AuthMiddleware, addProduct);
router.get("/getAllProducts", AuthMiddleware, fetchAllProducts);
router.get("/getProductById/:id", AuthMiddleware, getProductById);
router.put(
  "/updateProduct/:id",
  upload.single("image"),
  AuthMiddleware,
  updateProduct
);
router.delete("/deleteProduct/:id", AuthMiddleware, deleteProduct);
router.get("/fetchProductByCategory/:id", AuthMiddleware, fetchProductByCategory);

export default router;
