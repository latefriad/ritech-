import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, getOrders } from "../../services/api";
import { allProducts } from "../../data/products";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 4,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalStockUnits: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let productsList = [];
        try {
          const res = await getProducts({ limit: 100 });
          productsList = res.products && res.products.length > 0 ? res.products : allProducts;
        } catch {
          productsList = allProducts;
        }

        const totalStockUnits = productsList.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
        const totalStockValue = productsList.reduce(
          (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0),
          0
        );
        const lowStockCount = productsList.filter(
          (p) => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= (p.minStock || 5)
        ).length;
        const outOfStockCount = productsList.filter((p) => (Number(p.stock) || 0) === 0).length;

        // Load orders
        let ordersList = [];
        let totalRevenue = 0;
        let todayRevenue = 0;
        let todayOrders = 0;

        try {
          const res = await getOrders();
          ordersList = Array.isArray(res) ? res : res.orders || [];
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          ordersList.forEach((ord) => {
            const ordTotal = Number(ord.total) || 0;
            totalRevenue += ordTotal;
            const createdAt = new Date(ord.date || ord.createdAt || 0);
            if (createdAt >= today) {
              todayOrders++;
              todayRevenue += ordTotal;
            }
          });
        } catch (err) {
          console.warn("Orders load failed:", err.message);
        }

        if (!cancelled) {
          setStats({
            totalProducts: productsList.length,
            totalCategories: 4,
            totalOrders: ordersList.length,
            todayOrders,
            totalRevenue,
            todayRevenue,
            totalStockUnits,
            totalStockValue,
            lowStockCount,
            outOfStockCount,
          });
          setRecentOrders(ordersList.slice(0, 5));
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    const handleSyncEvent = () => load();
    window.addEventListener("site_synced", handleSyncEvent);
    return () => {
      cancelled = true;
      window.removeEventListener("site_synced", handleSyncEvent);
    };
  }, []);

  const statCards = [
    { icon: "📦", label: "عدد المنتجات", value: stats.totalProducts, color: "#453ec1" },
    { icon: "🏬", label: "وحدات المخزون المتوفرة", value: `${stats.totalStockUnits} قطعة`, color: "#16a34a" },
    { icon: "💰", label: "قيمة المخزون الإجمالية", value: `${stats.totalStockValue.toLocaleString("ar-DZ")} د.ج`, color: "#453ec1" },
    { icon: "🛒", label: "إجمالي الطلبات", value: stats.totalOrders, color: "#0284c7" },
    { icon: "💵", label: "إجمالي المبيعات", value: `${stats.totalRevenue.toLocaleString("ar-DZ")} د.ج`, color: "#16a34a" },
    { icon: "📅", label: "طلبات اليوم", value: stats.todayOrders, color: "#f5a623" },
  ];

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>⏳ جاري تحميل لوحة التحكم...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#111827" }}>
            مرحباً بك في لوحة تحكم جهزك للتقنية
          </h3>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
            نظرة عامة على المبيعات، المخزون، والطلبات الواردة
          </p>
        </div>
        <Link
          to="/admin/stock"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            background: "#453ec1",
            color: "white",
            textDecoration: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          🏬 فتح إدارة المخزون
        </Link>
      </div>

      {/* Stock Alert Banner */}
      {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <div
          style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 800, color: "#92400e", fontSize: 14 }}>
                تنبيه حالة المخزون (Gestion de Stock)
              </div>
              <div style={{ color: "#b45309", fontSize: 13, marginTop: 2 }}>
                يوجد <strong>{stats.lowStockCount}</strong> منتج بمخزون منخفض، و <strong>{stats.outOfStockCount}</strong> منتج نفد بالكامل بحاجة إلى إعادة تزويد.
              </div>
            </div>
          </div>
          <Link
            to="/admin/stock"
            style={{
              padding: "7px 14px",
              background: "#d97706",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            تعديل وتزويد المخزون الآن ➔
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #e5e7eb",
              padding: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `${card.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{card.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: card.color }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Orders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Quick Actions */}
        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚡ إجراءات سريعة</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              to="/admin/stock"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 14px",
                borderRadius: 8,
                background: "#eeedfe",
                fontSize: 14,
                fontWeight: 700,
                color: "#453ec1",
                textDecoration: "none",
              }}
            >
              <span>🏬 إدارة المخزون (Gestion de Stock)</span>
              <span style={{ fontSize: 12, background: "#453ec1", color: "white", padding: "2px 8px", borderRadius: 10 }}>
                {stats.totalStockUnits} قطعة
              </span>
            </Link>
            <Link
              to="/admin/products"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#f5f5f8",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a2e",
                textDecoration: "none",
              }}
            >
              📦 قائمة المنتجات والتسعير
            </Link>
            <Link
              to="/admin/orders"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#f5f5f8",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a2e",
                textDecoration: "none",
              }}
            >
              🛒 إدارة الطلبات ومتابعة التوصيل
            </Link>
            <Link
              to="/admin/editor"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#f5f5f8",
                fontSize: 14,
                fontWeight: 600,
                color: "#1a1a2e",
                textDecoration: "none",
              }}
            >
              🎨 تخصيص الموقع والشعارات
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                background: "#f0fdf4",
                fontSize: 14,
                fontWeight: 600,
                color: "#16a34a",
                textDecoration: "none",
              }}
            >
              🌐 معاينة المتجر المباشر
            </a>
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h4 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>📋 آخر الطلبات الواردة</h4>
            <Link to="/admin/orders" style={{ fontSize: 12, color: "#453ec1", textDecoration: "none", fontWeight: 700 }}>
              عرض الكل ➔
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontSize: 14 }}>
              لا توجد طلبات بعد
            </div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id || order.orderId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: "#111827" }}>
                    #{order.id || order.orderId} — {order.name || order.customerName || "عميل"}
                  </div>
                  <div style={{ color: "#6b7280", fontSize: 11 }}>
                    {order.wilaya || ""} {order.phone ? `(${order.phone})` : ""}
                  </div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 800, color: "#453ec1" }}>
                    {Number(order.total || 0).toLocaleString()} د.ج
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 10,
                      background: order.status === "confirmed" ? "#dcfce7" : "#fef3c7",
                      color: order.status === "confirmed" ? "#16a34a" : "#d97706",
                      fontWeight: 600,
                    }}
                  >
                    {order.status || "pending"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
