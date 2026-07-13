import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// ============================================
// PRODUCTS
// ============================================

export async function fetchProducts({ cat, sort, search, page = 1, limit: perPage = 20 } = {}) {
  const productsRef = collection(db, "products");
  let constraints = [];

  if (cat && cat !== "all") {
    constraints.push(where("cat", "==", cat));
  }

  constraints.push(orderBy("createdAt", "desc"));

  const q = query(productsRef, ...constraints);
  const snapshot = await getDocs(q);

  let products = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  // Client-side search (Firestore doesn't support full-text search)
  if (search) {
    const q2 = search.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(q2));
  }

  // Client-side sort
  if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
  else if (sort === "sale")
    products.sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));

  const total = products.length;
  const offset = (page - 1) * perPage;
  const paginated = products.slice(offset, offset + perPage);

  return { products: paginated, total, page, limit: perPage };
}

export async function fetchProductById(id) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Product not found");
  }

  return { id: docSnap.id, ...docSnap.data() };
}

export async function createProduct(data) {
  const productsRef = collection(db, "products");
  const docRef = await addDoc(productsRef, {
    ...data,
    price: Number(data.price),
    oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...data };
}

export async function updateProduct(id, data) {
  const docRef = doc(db, "products", id);
  await updateDoc(docRef, data);
  return { id, ...data };
}

export async function deleteProduct(id) {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
}

// ============================================
// CATEGORIES
// ============================================

export async function fetchCategories() {
  const catRef = collection(db, "categories");
  const snapshot = await getDocs(catRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================
// ORDERS
// ============================================

export async function createOrder(orderData) {
  const ordersRef = collection(db, "orders");
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    total: Number(orderData.total),
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...orderData };
}

export async function fetchOrders(userId) {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ============================================
// USERS
// ============================================

export async function getUserProfile(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { uid: docSnap.id, ...docSnap.data() };
}

export async function updateUserProfile(uid, data) {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, data);
  return { uid, ...data };
}
