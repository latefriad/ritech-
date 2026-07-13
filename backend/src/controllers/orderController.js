import { getDb } from "../config/firebase.js";

const mockOrders = [];

// GET /api/orders
export async function getOrders(req, res) {
  try {
    const db = getDb();

    if (!db) {
      return res.json({ orders: mockOrders, total: mockOrders.length });
    }

    const snapshot = await db.collection("orders").orderBy("createdAt", "desc").get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ orders, total: orders.length });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// GET /api/orders/:id
export async function getOrderById(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;

    if (!db) {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      return res.json(order);
    }

    const doc = await db.collection("orders").doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Order not found" });

    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

// POST /api/orders
export async function createOrder(req, res) {
  try {
    const db = getDb();
    const { items, total, address, phone, name, notes } = req.body;

    if (!items || !items.length || !address || !phone || !name) {
      return res.status(400).json({ error: "Items, address, phone, and name are required" });
    }

    const order = {
      items,
      total: Number(total),
      address,
      phone,
      name,
      notes: notes || "",
      status: "pending",
      createdAt: new Date(),
    };

    if (!db) {
      const newOrder = { id: String(mockOrders.length + 1), ...order };
      mockOrders.push(newOrder);
      return res.status(201).json(newOrder);
    }

    const docRef = await db.collection("orders").add(order);
    res.status(201).json({ id: docRef.id, ...order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

// PUT /api/orders/:id/status
export async function updateOrderStatus(req, res) {
  try {
    const db = getDb();
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    if (!db) {
      const order = mockOrders.find((o) => o.id === id);
      if (!order) return res.status(404).json({ error: "Order not found" });
      order.status = status;
      return res.json(order);
    }

    const docRef = db.collection("orders").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Order not found" });

    await docRef.update({ status });
    res.json({ id, ...doc.data(), status });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
}
