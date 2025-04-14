import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import {
  createOrderForCart,
  createOrderForOneProduct,
  getAllOrderOfUser,
  cancleOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/createOrderforCart", AuthMiddleware, createOrderForCart);
router.post(
  "/createOrderforOneProduct/:id",
  AuthMiddleware,
  createOrderForOneProduct
);
router.get("/getAllOrderOfUser/:id", AuthMiddleware, getAllOrderOfUser);
router.post("/cancleOrder/:id", AuthMiddleware, cancleOrder);

export default router;
