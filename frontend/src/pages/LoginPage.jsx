import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("⚠️ أدخل البريد الإلكتروني وكلمة المرور");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      showToast("✅ تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"
          ? "❌ المستخدم غير موجود"
          : err.code === "auth/wrong-password"
          ? "❌ كلمة المرور غير صحيحة"
          : "❌ خطأ في تسجيل الدخول";
      showToast(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ padding: "48px 24px", maxWidth: 440, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">👤 تسجيل الدخول</div>
        <div className="section-title">مرحباً بعودتك</div>
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
            placeholder="••••••••"
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
          {submitting ? "⏳ جاري الدخول..." : "🚀 تسجيل الدخول"}
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280" }}>
          ليس لديك حساب؟{" "}
          <Link to="/register" style={{ color: "#453ec1", fontWeight: 600 }}>
            أنشئ حساباً جديداً
          </Link>
        </p>
      </form>
    </section>
  );
}
