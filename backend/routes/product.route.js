import { Router } from "express";
import { addProduct } from "../controllers/Product.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addProduct", AuthMiddleware, addProduct);

export default router;
