import { useState, useEffect } from "react";
import { getProducts, updateStock as apiUpdateStock } from "../../services/api";
import { allProducts } from "../../data/products";
import { useToast } from "../../context/ToastContext";

export default function AdminStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all, instock, low, out
  const [updatingId, setUpdatingId] = useState(null);
  const showToast = useToast();

  const loadStock = async () => {
    setLoading(true);
    try {
      const data = await getProducts({ limit: 100 });
      const list = data.products && data.products.length > 0 ? data.products : allProducts;
      setProducts(list);
    } catch (err) {
      console.warn("Using fallback products for stock:", err.message);
      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
    const handleSyncEvent = () => loadStock();
    window.addEventListener("site_synced", handleSyncEvent);
    return () => window.removeEventListener("site_synced", handleSyncEvent);
  }, []);

  const handleStockChange = async (product, newQty) => {
    const qty = Math.max(0, Number(newQty) || 0);
    setUpdatingId(product.id);

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (String(p.id) === String(product.id) ? { ...p, stock: qty } : p))
    );

    try {
      await apiUpdateStock(product.id, qty);
      showToast(`✅ تم تحديث مخزون: ${product.name} إلى ${qty} قطعة`);
    } catch (err) {
      showToast("❌ خطأ في حفظ المخزون: " + err.message);
      loadStock(); // revert on failure
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculations
  const totalUnits = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce(
    (acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0),
    0
  );
  const lowStockCount = products.filter(
    (p) => (Number(p.stock) || 0) > 0 && (Number(p.stock) || 0) <= (p.minStock || 5)
  ).length;
  const outOfStockCount = products.filter((p) => (Number(p.stock) || 0) === 0).length;

  // Filter products
  const filteredProducts = products.filter((p) => {
    const stock = Number(p.stock) || 0;
    const minStock = p.minStock || 5;

    // Search
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.cat && p.cat.toLowerCase().includes(q));

    // Category
    const matchesCat = selectedCat === "all" || p.cat === selectedCat;

    // Status
    let matchesStatus = true;
    if (statusFilter === "instock") matchesStatus = stock > minStock;
    else if (statusFilter === "low") matchesStatus = stock > 0 && stock <= minStock;
    else if (statusFilter === "out") matchesStatus = stock === 0;

    return matchesSearch && matchesCat && matchesStatus;
  });

  const getStatusBadge = (stock, minStock = 5) => {
    if (stock === 0) {
      return {
        label: "❌ نفد المخزون",
        sub: "Rupture de Stock",
        color: "#e24b4a",
        bg: "#fee2e2",
      };
    }
    if (stock <= minStock) {
      return {
        label: `⚠️ مخزون منخفض (${stock})`,
        sub: "Stock Faible",
        color: "#d97706",
        bg: "#fef3c7",
      };
    }
    return {
      label: `🟢 متوفر (${stock})`,
      sub: "En Stock",
      color: "#16a34a",
      bg: "#dcfce7",
    };
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: "#111827" }}>
            🏬 إدارة المخزون (Gestion de Stock)
          </h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13 }}>
            تتبع كميات الهواتف والحواسيب، مراقبة التنبيهات، وتحديث الكميات المتوفرة فورياً
          </p>
        </div>
        <button
          onClick={loadStock}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 18px",
            background: "#453ec1",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
            boxShadow: "0 2px 8px rgba(69, 62, 193, 0.25)",
          }}
        >
          🔄 تحديث المخزون
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 20vw, 220px), 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {/* Total Units */}
        <div
          style={{
            background: "white",
            padding: 18,
            borderRadius: 12,
            border: "1.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#eeedfe",
              color: "#453ec1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            📦
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>إجمالي القطع المتوفرة</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>
              {totalUnits} <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>قطعة</span>
            </div>
          </div>
        </div>

        {/* Total Value */}
        <div
          style={{
            background: "white",
            padding: 18,
            borderRadius: 12,
            border: "1.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#dcfce7",
              color: "#16a34a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            💰
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>القيمة الإجمالية للمخزون</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#16a34a" }}>
              {totalValue.toLocaleString("ar-DZ")}{" "}
              <span style={{ fontSize: 12, fontWeight: 600 }}>د.ج</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div
          style={{
            background: "white",
            padding: 18,
            borderRadius: 12,
            border: lowStockCount > 0 ? "1.5px solid #fde68a" : "1.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#fef3c7",
              color: "#d97706",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ⚠️
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>تنبيهات نقص المخزون</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#d97706" }}>
              {lowStockCount} <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>منتج بحاجة للطلب</span>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div
          style={{
            background: "white",
            padding: 18,
            borderRadius: 12,
            border: outOfStockCount > 0 ? "1.5px solid #fca5a5" : "1.5px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#fee2e2",
              color: "#e24b4a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ❌
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>منتجات نفدت بالكامل</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#e24b4a" }}>
              {outOfStockCount} <span style={{ fontSize: 13, fontWeight: 500, color: "#6b7280" }}>منتج نفد</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "white",
          padding: 16,
          borderRadius: 12,
          border: "1.5px solid #e5e7eb",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Search input */}
        <div style={{ display: "flex", gap: 10, flex: "1 1 280px" }}>
          <input
            type="text"
            placeholder="🔍 ابحث باسم المنتج أو رمز الـ SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "9px 14px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              fontFamily: "Cairo",
              outline: "none",
            }}
          />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              fontSize: 13,
              fontFamily: "Cairo",
              outline: "none",
              background: "white",
            }}
          >
            <option value="all">جميع الأقسام</option>
            <option value="phones">📱 هواتف ذكية</option>
            <option value="phone-accessories">🎧 إكسسوارات الهواتف</option>
            <option value="computers">💻 حواسيب ولابتوب</option>
            <option value="pc-accessories">⌨️ ملحقات الكمبيوتر</option>
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[
            { id: "all", label: `الكل (${products.length})` },
            { id: "instock", label: `متوفر (${products.filter((p) => (Number(p.stock) || 0) > (p.minStock || 5)).length})` },
            { id: "low", label: `⚠️ منخفض (${lowStockCount})` },
            { id: "out", label: `❌ نفد (${outOfStockCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: statusFilter === tab.id ? "#453ec1" : "#e5e7eb",
                background: statusFilter === tab.id ? "#eeedfe" : "white",
                color: statusFilter === tab.id ? "#453ec1" : "#4b5563",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Cairo",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Management Table */}
      <div className="admin-table-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb", fontSize: 12, color: "#6b7280", flexWrap: "wrap", gap: 6 }}>
          <span>📦 المنتجات: <strong>{filteredProducts.length}</strong></span>
          <span style={{ color: "#453ec1", fontWeight: 600 }}>👈 اسحب أفقياً لتعديل المخزون على الهاتف</span>
        </div>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            ⏳ جاري تحميل بيانات المخزون...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
            لا توجد منتجات تطابق شروط البحث والفلترة
          </div>
        ) : (
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", minWidth: 680, borderCollapse: "collapse", fontSize: 13, textAlign: "right" }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb" }}>
                  <th style={{ padding: "14px 16px" }}>المنتج</th>
                  <th style={{ padding: "14px 16px" }}>القسم</th>
                  <th style={{ padding: "14px 16px" }}>سعر القطعة</th>
                  <th style={{ padding: "14px 16px" }}>حالة المخزون</th>
                  <th style={{ padding: "14px 16px", minWidth: 210 }}>الكمية والتحكم السريع</th>
                  <th style={{ padding: "14px 16px" }}>إجمالي القيمة</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const stock = Number(p.stock) || 0;
                  const price = Number(p.price) || 0;
                  const badge = getStatusBadge(stock, p.minStock);
                  const isUpdating = updatingId === p.id;

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        background: stock === 0 ? "#fffbfb" : "white",
                        transition: "background 0.2s",
                      }}
                    >
                      {/* Product Image & Info */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                background: "#f3f4f6",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 18,
                              }}
                            >
                              📦
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: "#111827", lineHeight: 1.4 }}>{p.name}</div>
                            <small style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: 11 }}>
                              {p.sku || `SKU-${String(p.id).padStart(3, "0")}`}
                            </small>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "#f1f5f9",
                            color: "#475569",
                          }}
                        >
                          {p.cat === "phones"
                            ? "📱 هواتف"
                            : p.cat === "phone-accessories"
                            ? "🎧 إكسسوارات هواتف"
                            : p.cat === "computers"
                            ? "💻 حواسيب"
                            : p.cat === "pc-accessories"
                            ? "⌨️ ملحقات PC"
                            : p.cat}
                        </span>
                      </td>

                      {/* Unit Price */}
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827" }}>
                        {price.toLocaleString("ar-DZ")} د.ج
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 10px",
                            borderRadius: 20,
                            background: badge.bg,
                            color: badge.color,
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          <span>{badge.label}</span>
                        </div>
                      </td>

                      {/* Stock Stepper Controls */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {/* Minus Button */}
                          <button
                            onClick={() => handleStockChange(p, stock - 1)}
                            disabled={stock <= 0 || isUpdating}
                            title="إنقاص قطعة واحدة"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 6,
                              border: "1.5px solid #d1d5db",
                              background: stock <= 0 ? "#f3f4f6" : "white",
                              cursor: stock <= 0 ? "not-allowed" : "pointer",
                              fontWeight: 800,
                              fontSize: 16,
                              color: "#374151",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            -
                          </button>

                          {/* Editable Stock Input */}
                          <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => handleStockChange(p, e.target.value)}
                            disabled={isUpdating}
                            style={{
                              width: 58,
                              height: 30,
                              textAlign: "center",
                              borderRadius: 6,
                              border: stock <= (p.minStock || 5) ? "1.5px solid #f59e0b" : "1.5px solid #d1d5db",
                              fontSize: 14,
                              fontWeight: 800,
                              fontFamily: "Cairo",
                              outline: "none",
                              color: stock === 0 ? "#dc2626" : "#111827",
                            }}
                          />

                          {/* Plus Button */}
                          <button
                            onClick={() => handleStockChange(p, stock + 1)}
                            disabled={isUpdating}
                            title="زيادة قطعة واحدة"
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: 6,
                              border: "1.5px solid #d1d5db",
                              background: "white",
                              cursor: "pointer",
                              fontWeight: 800,
                              fontSize: 16,
                              color: "#374151",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            +
                          </button>

                          {/* Quick Restock Pills */}
                          <button
                            onClick={() => handleStockChange(p, stock + 5)}
                            disabled={isUpdating}
                            title="إضافة 5 قطع للمخزون"
                            style={{
                              padding: "4px 8px",
                              borderRadius: 6,
                              border: "1px solid #c7d2fe",
                              background: "#eef2ff",
                              color: "#4338ca",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleStockChange(p, stock + 10)}
                            disabled={isUpdating}
                            title="إضافة 10 قطع للمخزون"
                            style={{
                              padding: "4px 8px",
                              borderRadius: 6,
                              border: "1px solid #c7d2fe",
                              background: "#eef2ff",
                              color: "#4338ca",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      {/* Total Value for Product */}
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#453ec1" }}>
                        {(price * stock).toLocaleString("ar-DZ")} د.ج
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
