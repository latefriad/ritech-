import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
} from "../controllers/productController.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, getProducts);
router.get("/:id", optionalAuth, getProductById);
router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.patch("/:id/stock", optionalAuth, updateProductStock);
router.delete("/:id", authenticate, deleteProduct);

export default router;
