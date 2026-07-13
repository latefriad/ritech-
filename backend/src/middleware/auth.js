import { getDb, getAdmin } from "../config/firebase.js";

export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const db = getDb();
    const admin = getAdmin();

    if (!db) {
      // Mock auth for development
      req.user = { uid: "mock-user", email: "dev@example.com" };
      return next();
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const db = getDb();
    const admin = getAdmin();

    if (!db) {
      req.user = { uid: "mock-user", email: "dev@example.com" };
      return next();
    }

    admin
      .auth()
      .verifyIdToken(token)
      .then((decodedToken) => {
        req.user = decodedToken;
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
}
