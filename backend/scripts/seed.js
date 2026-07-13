import "dotenv/config";
import admin from "firebase-admin";
import { readFileSync } from "fs";

const products = [
  { name: "تيشيرت Patient Jude", price: 2300, oldPrice: null, discount: null, cat: "clothing", image: null },
  { name: "هودي Patient Ninja", price: 2900, oldPrice: 3800, discount: "-25%", cat: "hoodie", image: null },
  { name: "بوستر Flying Ninja", price: 2800, oldPrice: 3400, discount: "-18%", cat: "poster", image: null },
  { name: "تيشيرت Woo Ninja", price: 3900, oldPrice: 4600, discount: "-15%", cat: "clothing", image: null },
  { name: "تيشيرت Woo Logo", price: 1900, oldPrice: 2500, discount: "-24%", cat: "clothing", image: null },
  { name: "ألبوم موسيقي #1", price: 2700, oldPrice: 3000, discount: "-10%", cat: "music", image: null },
  { name: "سينغل موسيقي #2", price: 2900, oldPrice: 3500, discount: "-17%", cat: "music", image: null },
  { name: "بوستر Woo Logo", price: 1800, oldPrice: 2200, discount: "-18%", cat: "poster", image: null },
  { name: "هودي كلاسيك", price: 3200, oldPrice: null, discount: null, cat: "hoodie", image: null },
];

const categories = [
  { id: "clothing", name: "ملابس", icon: "👕", count: 12 },
  { id: "hoodie", name: "هوديات", icon: "🧥", count: 5 },
  { id: "poster", name: "بوسترات", icon: "🖼️", count: 8 },
  { id: "music", name: "موسيقى", icon: "🎵", count: 10 },
  { id: "accessories", name: "إكسسوارات", icon: "💎", count: 6 },
  { id: "offers", name: "عروض خاصة", icon: "🔥", count: 4 },
];

async function seed() {
  try {
    const serviceAccount = JSON.parse(
      readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS || "./serviceAccountKey.json", "utf8")
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    const db = admin.firestore();

    console.log("🌱 Seeding categories...");
    for (const cat of categories) {
      await db.collection("categories").doc(cat.id).set(cat);
      console.log(`  ✅ ${cat.name}`);
    }

    console.log("🌱 Seeding products...");
    for (const product of products) {
      await db.collection("products").add({
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ ${product.name}`);
    }

    console.log("🎉 Seed completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
}

seed();
