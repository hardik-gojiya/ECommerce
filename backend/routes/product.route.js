import { Router } from "express";
import {
  addProduct,
  fetchAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/Product.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addProduct", AuthMiddleware, addProduct);
router.get("/getAllProducts", AuthMiddleware, fetchAllProducts);
router.get("/getProductById/:id", AuthMiddleware, getProductById);
router.put("/updateProduct/:id", AuthMiddleware, updateProduct);

export default router;
