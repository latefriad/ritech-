import { googleSheetsService } from "../services/googleSheets.js";

// GET /api/products
export async function getProducts(req, res) {
  try {
    const { cat, sort, search, page = 1, limit = 20 } = req.query;
    const result = await googleSheetsService.getProducts({ cat, sort, search, page, limit });
    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// GET /api/products/:id
export async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await googleSheetsService.getProductById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
}

// POST /api/products (stub for manual addition)
export async function createProduct(req, res) {
  try {
    const { name, price, cat } = req.body;
    if (!name || !price || !cat) {
      return res.status(400).json({ error: "Name, price, and cat are required" });
    }
    const newProduct = {
      id: String(Date.now()),
      ...req.body,
      createdAt: new Date(),
    };
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
}

// PUT /api/products/:id
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    res.json({ id, ...req.body, updatedAt: new Date() });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
}

// PATCH /api/products/:id/stock (Update stock level)
export async function updateProductStock(req, res) {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    if (stock === undefined || isNaN(Number(stock))) {
      return res.status(400).json({ error: "Stock quantity is required and must be a number" });
    }
    const result = await googleSheetsService.updateStock(id, Number(stock));
    res.json({ success: true, ...result });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
}

// DELETE /api/products/:id
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    res.json({ success: true, id, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
}
