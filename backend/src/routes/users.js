import { Router } from "express";
import { getUser, updateUser } from "../controllers/userController.js";
import { googleSheetsService } from "../services/googleSheets.js";
import { authenticate, optionalAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/users (Customers list)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const customers = await googleSheetsService.getCustomers();
    res.json({ customers, total: customers.length });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

router.get("/:uid", authenticate, getUser);
router.put("/:uid", authenticate, updateUser);

export default router;
