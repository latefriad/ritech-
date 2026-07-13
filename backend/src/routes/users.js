import { Router } from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/:uid", authenticate, getUser);
router.put("/:uid", authenticate, updateUser);

export default router;
