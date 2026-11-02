import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus as apiUpdateStatus } from "../../services/api";

const statusLabels = {
  pending: { label: "⏳ قيد الانتظار", color: "#f5a623" },
  confirmed: { label: "✅ مؤكد", color: "#1a9e75" },
  shipped: { label: "🚚 قيد الشحن", color: "#453ec1" },
  delivered: { label: "📦 تم التوصيل", color: "#27ae60" },
  cancelled: { label: "❌ ملغي", color: "#e24b4a" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      const list = Array.isArray(data) ? data : data.orders || [];
      setOrders(list);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await apiUpdateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId || o.orderId === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("خطأ في تحديث الحالة: " + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800 }}>🛒 إدارة الطلبات (Google Sheets & Local)</h3>
        <button
          onClick={loadOrders}
          style={{
            padding: "8px 16px",
            background: "#453ec1",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🔄 تحديث الطلبات
        </button>
      </div>

      <div className="admin-table-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb", fontSize: 12, color: "#6b7280", flexWrap: "wrap", gap: 6 }}>
          <span>🛒 الطلبات المسجلة: <strong>{orders.length}</strong></span>
          <span style={{ color: "#453ec1", fontWeight: 600 }}>👈 اسحب أفقياً لعرض كامل تفاصيل الطلبات</span>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>⏳ جاري تحميل الطلبات...</div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>لا توجد طلبات بعد</div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse", fontSize: 13, textAlign: "right" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
                  <th style={{ padding: "12px 16px" }}>رقم الطلب</th>
                  <th style={{ padding: "12px 16px" }}>العميل</th>
                  <th style={{ padding: "12px 16px" }}>الهاتف</th>
                  <th style={{ padding: "12px 16px" }}>الولاية / العنوان</th>
                  <th style={{ padding: "12px 16px" }}>المنتجات</th>
                  <th style={{ padding: "12px 16px" }}>المجموع</th>
                  <th style={{ padding: "12px 16px" }}>الحالة</th>
                  <th style={{ padding: "12px 16px" }}>تغيير الحالة</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id || o.orderId} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>#{o.id || o.orderId}</td>
                    <td style={{ padding: "12px 16px" }}>{o.name || o.customerName || "-"}</td>
                    <td style={{ padding: "12px 16px" }} dir="ltr">{o.phone || "-"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div>{o.wilaya || ""}</div>
                      <small style={{ color: "#6b7280" }}>{o.address || ""}</small>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {Array.isArray(o.items) ? (
                        o.items.map((it, idx) => (
                          <div key={idx} style={{ fontSize: 12 }}>
                            {it.name} <span style={{ color: "#6b7280" }}>(x{it.qty})</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: 12 }}>{String(o.items || "-")}</div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, color: "#453ec1" }}>
                      {Number(o.total || 0).toLocaleString()} د.ج
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: `${statusLabels[o.status]?.color || "#999"}15`,
                          color: statusLabels[o.status]?.color || "#999",
                        }}
                      >
                        {statusLabels[o.status]?.label || o.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <select
                        value={o.status || "pending"}
                        onChange={(e) => updateStatus(o.id || o.orderId, e.target.value)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          border: "1px solid #e5e7eb",
                          fontSize: 12,
                          fontFamily: "Cairo",
                          outline: "none",
                        }}
                      >
                        {Object.entries(statusLabels).map(([val, { label }]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
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
