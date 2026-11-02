import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { createOrder } from "../services/api";
import { wilayas } from "../data/wilayas";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.displayName || "",
    phone: "",
    wilaya: "",
    address: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.wilaya || !form.address) {
      showToast("⚠️ أدخل جميع الحقول المطلوبة");
      return;
    }
    if (items.length === 0) {
      showToast("⚠️ السلة فارغة");
      return;
    }

    setSubmitting(true);
    try {
      const selectedWilaya = wilayas.find((w) => w.code === form.wilaya);
      await createOrder({
        userId: user?.uid || "guest",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        total: totalPrice,
        address: form.address,
        phone: form.phone,
        wilaya: selectedWilaya ? `${selectedWilaya.code} - ${selectedWilaya.name}` : form.wilaya,
        name: form.name,
        notes: form.notes,
      });
      clearCart();
      showToast("✅ تم الطلب بنجاح! سنتواصل معك قريباً");
      navigate("/");
    } catch {
      showToast("❌ فشل في إرسال الطلب. حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>🛒 لا توجد منتجات</h2>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>أضف منتجات أولاً ثم عُد للطلب</p>
        <Link to="/shop" className="btn-primary">تسوّق الآن</Link>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontFamily: "Cairo, sans-serif",
    fontSize: 14,
    outline: "none",
  };

  return (
    <section style={{ padding: "clamp(24px, 4vw, 48px) clamp(12px, 3vw, 24px)", maxWidth: 900, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">📦 إتمام الطلب</div>
        <div className="section-title">أكمل طلبك</div>
      </div>

      <div className="checkout-grid">
        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            borderRadius: 14,
            border: "1.5px solid #e5e7eb",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>معلومات الشحن</h3>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
              الاسم الكامل *
            </label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="محمد أحمد" style={inputStyle} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
              رقم الهاتف *
            </label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="0672.43.05.32" style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
              الولاية *
            </label>
            <select
              name="wilaya"
              value={form.wilaya}
              onChange={handleChange}
              style={{ ...inputStyle, direction: "rtl", cursor: "pointer" }}
            >
              <option value="">— اختر الولاية —</option>
              {wilayas.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
              العنوان الكامل *
            </label>
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="الولاية، البلدية، الشارع..." rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
              ملاحظات (اختياري)
            </label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="أي ملاحظات إضافية..." rows={2} style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <button className="btn-buy" type="submit" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "⏳ جاري الإرسال..." : "✅ تأكيد الطلب"}
          </button>
        </form>

        <div>
          <div
            style={{
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #e5e7eb",
              padding: 24,
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>ملخص الطلب</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ fontWeight: 700, color: "#453ec1" }}>{(item.price * item.qty).toLocaleString("ar-DZ")} د.ج</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 16, paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>المجموع</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#453ec1" }}>{totalPrice.toLocaleString("ar-DZ")} د.ج</span>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: 16, background: "#eeedfe", borderRadius: 10, fontSize: 13, color: "#453ec1", lineHeight: 1.8 }}>
            <p>💳 الدفع عند الاستلام</p>
            <p>🚚 شحن سريع لجميع الولايات</p>
            <p>📞 سنتواصل معك لتأكيد الطلب</p>
          </div>
        </div>
      </div>
    </section>
  );
}
