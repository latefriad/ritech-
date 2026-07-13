import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const products = [
  { name: "تيشيرت Patient Jude", price: 2300, oldPrice: null, discount: null, cat: "clothing", image: null, landingPage: "" },
  { name: "هودي Patient Ninja", price: 2900, oldPrice: 3800, discount: "-25%", cat: "hoodie", image: null, landingPage: "" },
  { name: "بوستر Flying Ninja", price: 2800, oldPrice: 3400, discount: "-18%", cat: "poster", image: null, landingPage: "" },
  { name: "تيشيرت Woo Ninja", price: 3900, oldPrice: 4600, discount: "-15%", cat: "clothing", image: null, landingPage: "" },
  { name: "تيشيرت Woo Logo", price: 1900, oldPrice: 2500, discount: "-24%", cat: "clothing", image: null, landingPage: "" },
  { name: "ألبوم موسيقي #1", price: 2700, oldPrice: 3000, discount: "-10%", cat: "music", image: null, landingPage: "" },
  { name: "سينغل موسيقي #2", price: 2900, oldPrice: 3500, discount: "-17%", cat: "music", image: null, landingPage: "" },
  { name: "بوستر Woo Logo", price: 1800, oldPrice: 2200, discount: "-18%", cat: "poster", image: null, landingPage: "" },
  { name: "هودي كلاسيك", price: 3200, oldPrice: null, discount: null, cat: "hoodie", image: null, landingPage: "" },
];

const categories = [
  { id: "clothing", name: "ملابس", icon: "👕", count: 12 },
  { id: "hoodie", name: "هوديات", icon: "🧥", count: 5 },
  { id: "poster", name: "بوسترات", icon: "🖼️", count: 8 },
  { id: "music", name: "موسيقى", icon: "🎵", count: 10 },
  { id: "accessories", name: "إكسسوارات", icon: "💎", count: 6 },
  { id: "offers", name: "عروض خاصة", icon: "🔥", count: 4 },
];

export async function seedDatabase() {
  // Check if products already exist
  const productsSnap = await getDocs(collection(db, "products"));
  if (!productsSnap.empty) {
    return { message: "البيانات موجودة بالفعل", created: false };
  }

  // Seed categories
  for (const cat of categories) {
    await setDoc(doc(db, "categories", cat.id), cat);
  }

  // Seed products
  for (const product of products) {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
    });
  }

  return { message: "تم إنشاء المنتجات والتصنيفات بنجاح!", created: true };
}
