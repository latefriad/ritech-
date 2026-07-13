export default function PaymentPage() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">💳 طرق الدفع</div>
        <div className="section-title">كيف تدفع؟</div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 32, lineHeight: 2, fontSize: 15 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ padding: 20, background: "#eeedfe", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>💵</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#453ec1", marginBottom: 8 }}>الدفع عند الاستلام</h3>
            <p style={{ color: "#6b7280", fontSize: 14 }}>الطريقة الأكثر شيوعاً — ادفع نقداً عند استلام طلبك</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏦</div>
              <h4 style={{ fontWeight: 700, marginBottom: 4 }}>تحويل بنكي</h4>
              <p style={{ color: "#6b7280", fontSize: 13 }}>قريباً إن شاء الله</p>
            </div>
            <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📱</div>
              <h4 style={{ fontWeight: 700, marginBottom: 4 }}>الدفع الإلكتروني</h4>
              <p style={{ color: "#6b7280", fontSize: 13 }}>قريباً إن شاء الله</p>
            </div>
          </div>

          <div style={{ padding: 16, background: "#fef3f3", borderRadius: 10, border: "1px solid #fecaca" }}>
            <p style={{ color: "#e24b4a", fontSize: 14, fontWeight: 600 }}>
              ⚠️ جميع الأسعار بالدينار الجزائري (د.ج). لا نقبل عملة أخرى.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
