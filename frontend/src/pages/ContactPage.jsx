import { useState } from "react";
import { useToast } from "../context/ToastContext";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const showToast = useToast();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      showToast("⚠️ أدخل جميع الحقول");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      showToast("✅ تم إرسال رسالتك! سنتواصل معك قريباً");
      setForm({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

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
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">📩 تواصل معنا</div>
        <div className="section-title">نحن هنا لمساعدتك</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
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
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>الاسم</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="اسمك" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>البريد الإلكتروني</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="example@email.com" style={{ ...inputStyle, direction: "ltr", textAlign: "left" }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>الرسالة</label>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="اكتب رسالتك هنا..." rows={5} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <button className="btn-buy" type="submit" disabled={submitting}>
            {submitting ? "⏳ جاري الإرسال..." : "📤 إرسال الرسالة"}
          </button>
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>معلومات التواصل</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
              <div>📞 0672.43.05.32</div>
              <div>📧 info@gehazek.dz</div>
              <div>📍 الجزائر</div>
            </div>
          </div>

          <div style={{ background: "#eeedfe", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#453ec1" }}>ساعات العمل</h3>
            <div style={{ fontSize: 14, lineHeight: 2, color: "#6b7280" }}>
              <p>الاثنين - السبت: 9:00 - 18:00</p>
              <p>الأحد: مغلق</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
