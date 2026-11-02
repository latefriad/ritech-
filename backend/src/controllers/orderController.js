import { googleSheetsService } from "../services/googleSheets.js";

// GET /api/orders
export async function getOrders(req, res) {
  try {
    const orders = await googleSheetsService.getOrders();
    res.json({ orders, total: orders.length });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// GET /api/orders/:id
export async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const orders = await googleSheetsService.getOrders();
    const order = orders.find((o) => String(o.id) === String(id) || String(o.orderId) === String(id));
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
}

// POST /api/orders
export async function createOrder(req, res) {
  try {
    const { items, total, address, phone, name, wilaya, notes } = req.body;

    if (!items || !items.length || !phone || !name) {
      return res.status(400).json({ error: "Items, phone, and name are required" });
    }

    const order = await googleSheetsService.createOrder({
      items,
      total: Number(total),
      address: address || "",
      phone,
      name,
      wilaya: wilaya || "",
      notes: notes || "",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
}

// PUT /api/orders/:id/status
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await googleSheetsService.updateOrderStatus(id, status);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
}
