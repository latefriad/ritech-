export default function ShippingPage() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">🚚 الشحن والتسليم</div>
        <div className="section-title">معلومات الشحن</div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 32, lineHeight: 2, fontSize: 15 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#453ec1" }}>سياسة الشحن</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>📦 الشحن السريع</h4>
            <p style={{ color: "#6b7280", fontSize: 14 }}>نقدم شحن سريع لجميع ولايات الجزائر. يتم توصيل الطلبات خلال 2-5 أيام عمل حسب ubicación.</p>
          </div>

          <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>💵 الدفع عند الاستلام</h4>
            <p style={{ color: "#6b7280", fontSize: 14 }}>يمكنك الدفع نقداً عند استلام طلبك. لا حاجة لبطاقة بنكية.</p>
          </div>

          <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>💰 تكلفة الشحن</h4>
            <p style={{ color: "#6b7280", fontSize: 14 }}>الشحن مجاني للطلبات فوق 5000 د.ج. للطلبات الأقل، تكلفة الشحن 400 د.ج.</p>
          </div>

          <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10 }}>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>📞 التواصل</h4>
            <p style={{ color: "#6b7280", fontSize: 14 }}>لأي استفسار حول الشحن، تواصل معنا على 0672.43.05.32</p>
          </div>
        </div>
      </div>
    </section>
  );
}
