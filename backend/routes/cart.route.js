import { Router } from "express";
import { addToCart, getCart } from "../controllers/Cart.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addToCart", AuthMiddleware, addToCart);
router.get("/getCart/:id", AuthMiddleware, getCart);

export default router;
