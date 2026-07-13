import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { seedDatabase } from "../../services/seed";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let productsCount = 0;
        let categoriesCount = 0;

        try {
          const { fetchProducts, fetchCategories } = await import("../../services/firestore");
          const products = await fetchProducts({ limit: 1000 });
          productsCount = products.total;
          const categories = await fetchCategories();
          categoriesCount = categories.length;
        } catch {
          try {
            const { allProducts } = await import("../../data/products");
            productsCount = allProducts.length;
          } catch { productsCount = 0; }
          categoriesCount = 6;
        }

        let totalOrders = 0;
        let todayOrders = 0;
        let totalRevenue = 0;
        let todayRevenue = 0;
        let recentOrdersList = [];

        try {
          const ordersSnap = await getDocs(collection(db, "orders"));
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          ordersSnap.forEach((d) => {
            const order = d.data();
            totalOrders++;
            totalRevenue += order.total || 0;

            const createdAt = order.createdAt?.toDate?.() || new Date(order.createdAt);
            if (createdAt >= today) {
              todayOrders++;
              todayRevenue += order.total || 0;
            }
            recentOrdersList.push({ id: d.id, ...order });
          });

          recentOrdersList.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          });
          recentOrdersList = recentOrdersList.slice(0, 5);
        } catch (err) {
          console.warn("Orders fetch failed:", err.message);
        }

        if (!cancelled) {
          setStats({ totalProducts: productsCount, totalCategories: categoriesCount, totalOrders, todayOrders, totalRevenue, todayRevenue });
          setRecentOrders(recentOrdersList);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteAllProducts = async () => {
    if (!confirm("⚠️ هل أنت متأكد من حذف جميع المنتجات؟ لا يمكن التراجع!")) return;
    if (!confirm("🔥تأكيد أخير: حذف جميع المنتجات نهائياً؟")) return;

    try {
      const productsSnap = await getDocs(collection(db, "products"));
      const batch = [];
      productsSnap.forEach((d) => {
        batch.push(deleteDoc(doc(db, "products", d.id)));
      });
      await Promise.all(batch);
      setStats((prev) => ({ ...prev, totalProducts: 0 }));
      alert("✅ تم حذف جميع المنتجات");
    } catch (err) {
      alert("❌ خطأ: " + err.message);
    }
  };

  const statCards = [
    { icon: "📦", label: "المنتجات", value: stats.totalProducts, color: "#453ec1" },
    { icon: "🏷️", label: "التصنيفات", value: stats.totalCategories, color: "#1a9e75" },
    { icon: "🛒", label: "إجمالي الطلبات", value: stats.totalOrders, color: "#e24b4a" },
    { icon: "📅", label: "طلبات اليوم", value: stats.todayOrders, color: "#f5a623" },
    { icon: "💰", label: "إجمالي الإيرادات", value: `${stats.totalRevenue.toLocaleString("ar-DZ")} د.ج`, color: "#453ec1" },
    { icon: "💵", label: "إيرادات اليوم", value: `${stats.todayRevenue.toLocaleString("ar-DZ")} د.ج`, color: "#1a9e75" },
  ];

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>⏳ جاري التحميل...</div>;
  }

  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>مرحباً بك في لوحة التحكم</h3>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: card.color }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Seed Database */}
      {stats.totalProducts === 0 && (
        <div style={{ background: "#eeedfe", borderRadius: 14, border: "2px dashed #453ec1", padding: 24, marginBottom: 32, textAlign: "center" }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#453ec1" }}>🌱 لم تتم إضافة المنتجات بعد</h4>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>اضغط الزر لإنشاء 9 منتجات و 6 تصنيفات في Firestore</p>
          <button
            onClick={async () => {
              setSeeding(true);
              setSeedMsg("");
              try {
                const result = await seedDatabase();
                setSeedMsg(result.message);
                if (result.created) window.location.reload();
              } catch (err) {
                setSeedMsg("❌ خطأ: " + err.message);
              } finally {
                setSeeding(false);
              }
            }}
            disabled={seeding}
            className="btn-buy"
            style={{ opacity: seeding ? 0.7 : 1 }}
          >
            {seeding ? "⏳ جاري الإنشاء..." : "🌱 إنشاء المنتجات والتصنيفات"}
          </button>
          {seedMsg && <p style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: "#453ec1" }}>{seedMsg}</p>}
        </div>
      )}

      {/* Quick Actions + Recent Orders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>⚡ إجراءات سريعة</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <a href="/admin/products" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#f5f5f8", fontSize: 14, fontWeight: 600, color: "#1a1a2e", textDecoration: "none" }}>📦 إدارة المنتجات</a>
            <a href="/admin/orders" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#f5f5f8", fontSize: 14, fontWeight: 600, color: "#1a1a2e", textDecoration: "none" }}>🛒 عرض الطلبات</a>
            <a href="/admin/editor" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#f5f5f8", fontSize: 14, fontWeight: 600, color: "#1a1a2e", textDecoration: "none" }}>🎨 تخصيص الموقع</a>
            <a href="/" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#eeedfe", fontSize: 14, fontWeight: 600, color: "#453ec1", textDecoration: "none" }}>🌐 زيارة المتجر</a>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📋 آخر الطلبات</h4>
          {recentOrders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#6b7280", fontSize: 14 }}>لا توجد طلبات بعد</div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{order.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{order.wilaya || order.address}</div>
                </div>
                <span style={{ color: "#453ec1", fontWeight: 700 }}>{(order.total || 0).toLocaleString("ar-DZ")} د.ج</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ marginTop: 24, background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
        <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#e24b4a" }}>⚠️ منطقة الخطر</h4>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>حذف جميع المنتجات نهائياً — لا يمكن التراجع</p>
        <button
          onClick={handleDeleteAllProducts}
          style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #e24b4a", background: "white", color: "#e24b4a", fontFamily: "Cairo, sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          🗑️ حذف جميع المنتجات
        </button>
      </div>
    </div>
  );
}
