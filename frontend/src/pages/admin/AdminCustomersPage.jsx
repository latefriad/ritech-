import { useState, useEffect } from "react";
import { getOrders } from "../../services/api";

export default function AdminCustomersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      const list = Array.isArray(data) ? data : data.orders || [];
      setOrders(list);
    } catch (err) {
      console.warn("Could not load orders for customers:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Extract unique customers from Google Sheets orders
  const customers = [];
  const seen = new Set();
  for (const order of orders) {
    const key = order.phone || order.name || order.id;
    if (!seen.has(key)) {
      seen.add(key);
      customers.push({
        name: order.name || order.customerName || "عميل",
        phone: order.phone || "-",
        wilaya: order.wilaya || "",
        address: order.address || "",
        orders: 1,
        total: Number(order.total) || 0,
        lastOrder: order.date || order.createdAt || "",
      });
    } else {
      const existing = customers.find((c) => (order.phone && c.phone === order.phone) || c.name === order.name);
      if (existing) {
        existing.orders++;
        existing.total += Number(order.total) || 0;
      }
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>👥 قاعدة بيانات العملاء (Google Sheets)</h3>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
            العملاء المسجلين والطلبات المسجلة من جدول Google Sheets
          </p>
        </div>
        <button
          onClick={loadCustomers}
          style={{
            padding: "8px 16px",
            background: "#453ec1",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          🔄 تحديث
        </button>
      </div>

      <div className="admin-table-wrapper">
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>⏳ جاري التحميل...</div>
        ) : customers.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>لا يوجد عملاء بعد</div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse", fontSize: 13, textAlign: "right" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
                <th style={{ padding: "12px 16px" }}>اسم العميل</th>
                <th style={{ padding: "12px 16px" }}>رقم الهاتف</th>
                <th style={{ padding: "12px 16px" }}>الولاية والعنوان</th>
                <th style={{ padding: "12px 16px" }}>عدد الطلبات</th>
                <th style={{ padding: "12px 16px" }}>إجمالي المشتريات</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px" }} dir="ltr">{c.phone}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div>{c.wilaya}</div>
                    <small style={{ color: "#6b7280" }}>{c.address}</small>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "2px 8px", background: "#eeedfe", color: "#453ec1", borderRadius: 10, fontWeight: 700 }}>
                      {c.orders} طلب
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 800, color: "#16a34a" }}>
                    {c.total.toLocaleString("ar-DZ")} د.ج
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
