import { Router } from "express";
import { googleSheetsService } from "../services/googleSheets.js";

const router = Router();

// POST /api/sync - Manual instant sync button endpoint
router.post("/", async (req, res) => {
  try {
    const result = await googleSheetsService.syncNow();
    res.json(result);
  } catch (error) {
    console.error("Error syncing with Google Sheets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to sync with Google Sheets: " + error.message,
    });
  }
});

// GET /api/sync/status - Returns last sync time
router.get("/status", async (req, res) => {
  res.json({
    autoSyncInterval: "Every 24 hours (Daily)",
    configured: Boolean(process.env.GOOGLE_SHEET_WEBAPP_URL),
    webAppUrl: process.env.GOOGLE_SHEET_WEBAPP_URL ? "Configured" : "Not configured",
  });
});

export default router;
