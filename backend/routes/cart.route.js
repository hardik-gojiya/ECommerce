import { Router } from "express";
import {
  addToCart,
  getCart,
  removeItemFromCart,
  decreseQunatityOfProductbyOne,
  emptyCart,
} from "../controllers/Cart.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/addToCart", AuthMiddleware, addToCart);
router.get("/getCart/:userId", AuthMiddleware, getCart);
router.delete("/removeItemFromCart/:id", AuthMiddleware, removeItemFromCart);
router.delete(
  "/decreseQunatityOfProductbyOne/:id",
  AuthMiddleware,
  decreseQunatityOfProductbyOne
);
router.delete("/emptyCart/:userId", AuthMiddleware, emptyCart);

export default router;
