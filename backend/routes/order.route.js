import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

router.post("/createOrder", AuthMiddleware, createOrder);

export default router;
