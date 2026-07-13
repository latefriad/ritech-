export default function AboutPage() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">💎 عن المتجر</div>
        <div className="section-title">جهزك</div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 32, lineHeight: 2, fontSize: 15 }}>
        <p style={{ fontSize: 17, marginBottom: 20 }}>
          مرحباً بكم في <strong style={{ color: "#453ec1" }}>جهزك</strong> — متجركم المفضل للمنتجات الأصلية والtractات العصرية.
        </p>

        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          نهدف لمنحك تجربة تسوّق سهلة وممتعة مع أفضل المنتجات وأسرع التوصيل لجميع ولايات الجزائر. نحرص على توفير منتجات أصلية بجودة عالية وأسعار مناسبة للجميع.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <div style={{ padding: 20, background: "#eeedfe", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>رؤيتنا</h4>
            <p style={{ color: "#6b7280", fontSize: 13 }}>أن نكون الخيار الأول للتسوّق عبر الإنترنت في الجزائر</p>
          </div>
          <div style={{ padding: 20, background: "#eeedfe", borderRadius: 12, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>💎</div>
            <h4 style={{ fontWeight: 700, marginBottom: 4 }}>قيمنا</h4>
            <p style={{ color: "#6b7280", fontSize: 13 }}>الجودة، الأمانة، ورضا العميل هو أولويتنا القصوى</p>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 20, background: "#f5f5f8", borderRadius: 10 }}>
          <h4 style={{ fontWeight: 700, marginBottom: 8 }}>📞 تواصل معنا</h4>
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            هاتف: 0672.43.05.32<br />
            بريد إلكتروني: info@gehazek.dz
          </p>
        </div>
      </div>
    </section>
  );
}
