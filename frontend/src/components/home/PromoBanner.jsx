import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

export default function PromoBanner() {
  const { settings } = useSettings();
  const promo = settings?.promo || {};

  return (
    <section
      className="promo"
      style={{
        backgroundImage: promo.image ? `url(${promo.image}) center/cover` : undefined,
        position: "relative",
      }}
    >
      {promo.image && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(26, 20, 96, 0.75)",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="promo-badge">{promo.badge || "✨ عروض هذا الأسبوع"}</div>
        <h2 className="promo-title">{promo.title || "تسوّق بذوق — خصومات موسمية"}</h2>
        <p className="promo-sub">
          {promo.subtitle || "شحن سريع لجميع الولايات، والدفع عند الاستلام"}
        </p>
        <div className="promo-btns">
          <Link to="/shop" className="promo-btn-white">
            {promo.btn1 || "تسوّق الآن"}
          </Link>
          <Link to="/contact" className="promo-btn-border">
            {promo.btn2 || "تواصل معنا"}
          </Link>
        </div>
        <div className="promo-features">
          <div className="promo-feature">🎧 دعم 24/7</div>
          <div className="promo-feature">💳 دفع آمن</div>
          <div className="promo-feature">🚚 توصيل سريع</div>
          <div className="promo-feature">✅ منتجات أصلية</div>
        </div>
      </div>
    </section>
  );
}
