import { Router } from "express";
import { googleSheetsService } from "../services/googleSheets.js";

const router = Router();

// GET /api/settings
router.get("/", async (req, res) => {
  try {
    const settings = await googleSheetsService.getSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// PUT /api/settings
router.put("/", async (req, res) => {
  try {
    const updated = await googleSheetsService.updateSettings(req.body);
    res.json(updated);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;
