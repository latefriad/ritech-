import admin from "firebase-admin";
import { readFileSync } from "fs";

let db;

export function initializeFirebase() {
  try {
    const serviceAccount = JSON.parse(
      readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccountKey.json", "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log("✅ Firebase Admin initialized");
  } catch (error) {
    console.warn("⚠️ Firebase not configured. Using mock data.");
    db = null;
  }
}

export function getDb() {
  return db;
}

export function getAdmin() {
  return admin;
}
