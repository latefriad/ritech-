import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        if (!cancelled) setOrders(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error loading orders:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>🛒 إدارة الطلبات</h3>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>⏳ جاري التحميل...</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>لا توجد طلبات بعد</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f5f5f8" }}>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>رقم الطلب</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>العميل</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>الهاتف</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>العنوان</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>المجموع</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>الحالة</th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700 }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = statusLabels[order.status] || statusLabels.pending;
                  return (
                    <tr key={order.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 11 }}>
                        {order.id.slice(0, 8)}...
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{order.name}</td>
                      <td style={{ padding: "12px 16px", direction: "ltr", textAlign: "right" }}>{order.phone}</td>
                      <td style={{ padding: "12px 16px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.address}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#453ec1", fontWeight: 700 }}>
                        {order.total?.toLocaleString("ar-DZ")} د.ج
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            background: `${status.color}15`,
                            color: status.color,
                            padding: "3px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          style={{
                            padding: "5px 8px",
                            borderRadius: 6,
                            border: "1px solid #e5e7eb",
                            fontFamily: "Cairo, sans-serif",
                            fontSize: 12,
                            cursor: "pointer",
                          }}
                        >
                          <option value="pending">⏳ قيد الانتظار</option>
                          <option value="confirmed">✅ مؤكد</option>
                          <option value="shipped">🚚 قيد الشحن</option>
                          <option value="delivered">📦 تم التوصيل</option>
                          <option value="cancelled">❌ ملغي</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
