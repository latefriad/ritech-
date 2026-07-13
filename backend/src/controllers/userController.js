import { getDb, getAdmin } from "../config/firebase.js";

// GET /api/users/:uid
export async function getUser(req, res) {
  try {
    const db = getDb();
    const { uid } = req.params;

    if (!db) {
      return res.json({ uid, name: "مستخدم تجريبي", email: "test@example.com" });
    }

    const admin = getAdmin();
    const userRecord = await admin.auth().getUser(uid);
    const doc = await db.collection("users").doc(uid).get();

    res.json({
      uid: userRecord.uid,
      email: userRecord.email,
      name: doc.exists ? doc.data().name : userRecord.displayName || "",
      phone: doc.exists ? doc.data().phone : "",
      address: doc.exists ? doc.data().address : "",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

// PUT /api/users/:uid
export async function updateUser(req, res) {
  try {
    const db = getDb();
    const { uid } = req.params;
    const { name, phone, address } = req.body;

    if (!db) {
      return res.json({ uid, name, phone, address });
    }

    const docRef = db.collection("users").doc(uid);
    await docRef.set({ name, phone, address }, { merge: true });

    res.json({ uid, name, phone, address });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
}
