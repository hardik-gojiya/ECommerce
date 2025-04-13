import { Router } from "express";
import {
  addToCart,
  getCart,
  removeItemFromCart,
  decreseQunatityOfProductbyOne,
} from "../controllers/Cart.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addToCart", AuthMiddleware, addToCart);
router.get("/getCart/:id", AuthMiddleware, getCart);
router.delete("/removeItemFromCart", AuthMiddleware, removeItemFromCart);
router.delete(
  "/decreseQunatityOfProductbyOne/:id",
  AuthMiddleware,
  decreseQunatityOfProductbyOne
);

export default router;
