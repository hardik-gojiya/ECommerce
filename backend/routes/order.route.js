import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import {
  createOrderForCart,
  createOrderForOneProduct,
  getAllOrderOfOneUser,
  cancleOrder,
  getAllOrderforAdmin,
  changeStatusofOrderByAdmin,
  getOneOrderById,
} from "../controllers/order.controller.js";

const router = Router();

router.post("/createOrderforCart", AuthMiddleware, createOrderForCart);
router.post(
  "/createOrderforOneProduct/:id",
  AuthMiddleware,
  createOrderForOneProduct
);
router.get("/getAllOrderforAdmin", AuthMiddleware, getAllOrderforAdmin);
router.get("/getAllOrderOfUser/:id", AuthMiddleware, getAllOrderOfOneUser);
router.delete("/cancleOrder/:id", AuthMiddleware, cancleOrder);
router.get("/getorderbyid/:id", AuthMiddleware, getOneOrderById);
router.put(
  "/changeStatusofOrderByAdmin",
  AuthMiddleware,
  changeStatusofOrderByAdmin
);

export default router;
