import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, getOrders);
router.get("/:id", optionalAuth, getOrderById);
router.post("/", createOrder);
router.put("/:id/status", optionalAuth, updateOrderStatus);

export default router;
