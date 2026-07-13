import { Router } from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.post("/", createOrder);
router.put("/:id/status", authenticate, updateOrderStatus);

export default router;
