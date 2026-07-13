import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase";

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(ordersData);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Extract unique customers from orders
  const customers = [];
  const seen = new Set();
  for (const order of orders) {
    const key = order.phone || order.name;
    if (!seen.has(key)) {
      seen.add(key);
      customers.push({
        name: order.name,
        phone: order.phone,
        address: order.address,
        orders: 1,
        total: order.total || 0,
      });
    } else {
      const existing = customers.find((c) => c.phone === order.phone);
      if (existing) {
        existing.orders++;
        existing.total += order.total || 0;
      }
    }
  }

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>👥 العملاء</h3>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>⏳ جاري التحميل...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>لا يوجد عملاء بعد</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f5f5f8" }}>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>الاسم</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>الهاتف</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>العنوان</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>عدد الطلبات</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, i) => (
                <tr key={i} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{customer.name}</td>
                  <td style={{ padding: "12px 16px", direction: "ltr", textAlign: "right" }}>{customer.phone}</td>
                  <td style={{ padding: "12px 16px" }}>{customer.address}</td>
                  <td style={{ padding: "12px 16px" }}>{customer.orders}</td>
                  <td style={{ padding: "12px 16px", color: "#453ec1", fontWeight: 700 }}>
                    {customer.total.toLocaleString("ar-DZ")} د.ج
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
