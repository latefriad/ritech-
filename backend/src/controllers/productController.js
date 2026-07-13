import { getDb } from "../config/firebase.js";

// Mock data when Firebase is not configured
const mockProducts = [
  { id: "1", name: "تيشيرت Patient Jude", price: 2300, oldPrice: null, discount: null, cat: "clothing", image: null, landingPage: "", createdAt: new Date() },
  { id: "2", name: "هودي Patient Ninja", price: 2900, oldPrice: 3800, discount: "-25%", cat: "hoodie", image: null, landingPage: "", createdAt: new Date() },
  { id: "3", name: "بوستر Flying Ninja", price: 2800, oldPrice: 3400, discount: "-18%", cat: "poster", image: null, landingPage: "", createdAt: new Date() },
  { id: "4", name: "تيشيرت Woo Ninja", price: 3900, oldPrice: 4600, discount: "-15%", cat: "clothing", image: null, landingPage: "", createdAt: new Date() },
  { id: "5", name: "تيشيرت Woo Logo", price: 1900, oldPrice: 2500, discount: "-24%", cat: "clothing", image: null, landingPage: "", createdAt: new Date() },
  { id: "6", name: "ألبوم موسيقي #1", price: 2700, oldPrice: 3000, discount: "-10%", cat: "music", image: null, landingPage: "", createdAt: new Date() },
  { id: "7", name: "سينغل موسيقي #2", price: 2900, oldPrice: 3500, discount: "-17%", cat: "music", image: null, landingPage: "", createdAt: new Date() },
  { id: "8", name: "بوستر Woo Logo", price: 1800, oldPrice: 2200, discount: "-18%", cat: "poster", image: null, landingPage: "", createdAt: new Date() },
  { id: "9", name: "هودي كلاسيك", price: 3200, oldPrice: null, discount: null, cat: "hoodie", image: null, landingPage: "", createdAt: new Date() },
];

// GET /api/products
export async function getProducts(req, res) {
  try {
    const db = getDb();

    if (!db) {
      let products = [...mockProducts];
      const { cat, sort, search, page = 1, limit = 20 } = req.query;

      if (cat && cat !== "all") {
        products = products.filter((p) => p.cat === cat);
      }
      if (search) {
        const q = search.toLowerCase();
        products = products.filter((p) => p.name.toLowerCase().includes(q));
      }
      if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
      else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
      else if (sort === "sale") products.sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));

      const total = products.length;
      const offset = (page - 1) * limit;
      products = products.slice(offset, offset + Number(limit));

      return res.json({ products, total, page: Number(page), limit: Number(limit) });
    }

    const { cat, sort, search, page = 1, limit = 20 } = req.query;
    let query = db.collection("products").orderBy("createdAt", "desc");

    if (cat && cat !== "all") {
      query = query.where("cat", "==", cat);
    }

    const snapshot = await query.get();
    let products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const q = search.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
    else if (sort === "sale") products.sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));

    const total = products.length;
    const offset = (page - 1) * limit;
    products = products.slice(offset, offset + Number(limit));

    res.json({ products, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// GET /api/products/:id
export async function getProductById(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!db) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.json(product);
    }

    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Product not found" });

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

// POST /api/products (admin only)
export async function createProduct(req, res) {
  try {
    const db = getDb();
    const { name, price, oldPrice, discount, cat, image } = req.body;

    if (!name || !price || !cat) {
      return res.status(400).json({ error: "Name, price, and category are required" });
    }

    const product = {
      name,
      price: Number(price),
      oldPrice: oldPrice ? Number(oldPrice) : null,
      discount: discount || null,
      cat,
      image: image || null,
      createdAt: new Date(),
    };

    if (!db) {
      return res.status(201).json({ id: String(mockProducts.length + 1), ...product });
    }

    const docRef = await db.collection("products").add(product);
    res.status(201).json({ id: docRef.id, ...product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// PUT /api/products/:id
export async function updateProduct(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const updates = req.body;

    if (!db) {
      const product = mockProducts.find((p) => p.id === id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.json({ id, ...product, ...updates });
    }

    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Product not found" });

    await docRef.update(updates);
    res.json({ id, ...doc.data(), ...updates });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!db) {
      return res.json({ message: "Product deleted" });
    }

    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Product not found" });

    await docRef.delete();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
