import { Router } from "express";
import {
  addProduct,
  fetchAllProducts,
  getProductById,
} from "../controllers/Product.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addProduct", AuthMiddleware, addProduct);
router.get("/getProducts", AuthMiddleware, fetchAllProducts);
router.get("/getProductById/:id", AuthMiddleware, getProductById);

export default router;
