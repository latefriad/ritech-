import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast("⚠️ أدخل جميع الحقول المطلوبة");
      return;
    }
    if (password !== confirmPassword) {
      showToast("❌ كلمتا المرور غير متطابقتين");
      return;
    }
    if (password.length < 6) {
      showToast("❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password, name);
      showToast("✅ تم إنشاء الحساب بنجاح");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.code === "auth/email-already-in-use"
          ? "❌ البريد الإلكتروني مستخدم بالفعل"
          : err.code === "auth/weak-password"
          ? "❌ كلمة المرور ضعيفة جداً"
          : err.code === "auth/invalid-email"
          ? "❌ البريد الإلكتروني غير صالح"
          : err.code === "auth/operation-not-allowed"
          ? "❌ تسجيل الدخولByEmail غير مفعّل — فعّله من Firebase Console"
          : `❌ خطأ: ${err.message}`;
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ padding: "48px 24px", maxWidth: 440, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">📝 حساب جديد</div>
        <div className="section-title">أنشئ حسابك</div>
      </div>

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
          <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
            الاسم الكامل
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="محمد أحمد"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontFamily: "Cairo, sans-serif",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
            البريد الإلكتروني
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontFamily: "Cairo, sans-serif",
              fontSize: 14,
              outline: "none",
              direction: "ltr",
              textAlign: "left",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
            كلمة المرور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 أحرف على الأقل"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontFamily: "Cairo, sans-serif",
              fontSize: 14,
              outline: "none",
              direction: "ltr",
              textAlign: "left",
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
            تأكيد كلمة المرور
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="أعد إدخال كلمة المرور"
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 8,
              fontFamily: "Cairo, sans-serif",
              fontSize: 14,
              outline: "none",
              direction: "ltr",
              textAlign: "left",
            }}
          />
        </div>

        <button
          className="btn-buy"
          type="submit"
          disabled={submitting}
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "⏳ جاري الإنشاء..." : "📝 إنشاء الحساب"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" style={{ color: "#453ec1", fontWeight: 600 }}>
            سجّل الدخول
          </Link>
        </p>
      </form>
    </section>
  );
}
