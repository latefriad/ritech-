import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "100px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
        404
      </h1>
      <p style={{ color: "#6b7280", marginBottom: 24 }}>
        الصفحة التي تبحث عنها غير موجودة
      </p>
      <Link to="/" className="btn-primary">
        العودة للرئيسية
      </Link>
    </div>
  );
}
