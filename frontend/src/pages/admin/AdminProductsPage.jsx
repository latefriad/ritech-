import { useState, useEffect } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../services/firestore";
import { allProducts } from "../../data/products";
import ImageUpload from "../../components/ui/ImageUpload";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", oldPrice: "", discount: "", cat: "clothing", image: "", landingPage: "", landingPageImage: "" });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts({ limit: 100 });
      setProducts(data.products);
    } catch {
      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchProducts({ limit: 100 });
        if (!cancelled) setProducts(data.products);
      } catch {
        if (!cancelled) setProducts(allProducts);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const resetForm = () => {
    setForm({ name: "", price: "", oldPrice: "", discount: "", cat: "clothing", image: "", landingPage: "", landingPageImage: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    try {
      if (editing) {
        await updateProduct(editing, form);
      } else {
        await createProduct(form);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice || "",
      discount: product.discount || "",
      cat: product.cat,
      image: product.image || "",
      landingPage: product.landingPage || "",
      landingPageImage: product.landingPageImage || "",
    });
    setEditing(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      alert("خطأ: " + err.message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontFamily: "Cairo, sans-serif",
    fontSize: 13,
    outline: "none",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800 }}>📦 إدارة المنتجات</h3>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            border: "none",
            background: "#453ec1",
            color: "white",
            fontFamily: "Cairo, sans-serif",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + إضافة منتج
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) resetForm(); }}
        >
          <div
            style={{
              background: "white",
              borderRadius: 14,
              padding: 28,
              width: "90%",
              maxWidth: 500,
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>
              {editing ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
            </h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>اسم المنتج *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="تيشيرت..." />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>السعر *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} style={inputStyle} placeholder="2300" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>السعر القديم</label>
                  <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} style={inputStyle} placeholder="3000" />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>الخصم</label>
                  <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} style={inputStyle} placeholder="-25%" />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>التصنيف</label>
                  <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} style={{ ...inputStyle, direction: "rtl" }}>
                    <option value="clothing">ملابس</option>
                    <option value="hoodie">هوديات</option>
                    <option value="poster">بوسترات</option>
                    <option value="music">موسيقى</option>
                    <option value="accessories">إكسسوارات</option>
                  </select>
                </div>
              </div>
              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                label="صورة المنتج"
              />
              <ImageUpload
                value={form.landingPageImage}
                onChange={(url) => setForm({ ...form, landingPageImage: url })}
                label="صورة صفحة الهبوط (Canva)"
              />
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>🔗 رابط صفحة الهبوط (Canva)</label>
                <input value={form.landingPage} onChange={(e) => setForm({ ...form, landingPage: e.target.value })} style={inputStyle} placeholder="https://www.canva.com/..." />
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                  💡 أنشئ صفحة هبوط في Canva وألصق الرابط هنا — الصورة تظهر كمعاينة
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="submit" className="btn-buy" style={{ flex: 1 }}>
                  {editing ? "💾 حفظ التعديلات" : "➕ إضافة"}
                </button>
                <button type="button" onClick={resetForm} style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", fontFamily: "Cairo, sans-serif", fontSize: 13, cursor: "pointer" }}>
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>⏳ جاري التحميل...</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#6b7280" }}>لا توجد منتجات</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f5f5f8" }}>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>المنتج</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>السعر</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>الخصم</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700 }}>التصنيف</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 700 }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{product.name}</td>
                  <td style={{ padding: "12px 16px", color: "#453ec1", fontWeight: 700 }}>
                    {product.price?.toLocaleString("ar-DZ")} د.ج
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {product.discount ? (
                      <span style={{ background: "#e24b4a", color: "white", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>
                        {product.discount}
                      </span>
                    ) : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{product.cat}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEdit(product)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, marginLeft: 8 }}
                      title="تعديل"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}
                      title="حذف"
                    >
                      🗑️
                    </button>
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
