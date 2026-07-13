import { Link } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  const s = settings || {};

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">{s.siteName || "جهزك"}</div>
          <p className="footer-desc">
            {s.footer?.description || "نهدف لمنحك تجربة تسوّق سهلة وممتعة مع أفضل المنتجات وأسرع التوصيل لجميع ولايات الجزائر."}
          </p>
          <div className="social-links">
            {s.facebook && (
              <a className="social-btn" href={s.facebook} target="_blank" rel="noreferrer">f</a>
            )}
            {s.instagram && (
              <a className="social-btn" href={s.instagram} target="_blank" rel="noreferrer">📷</a>
            )}
            {s.twitter && (
              <a className="social-btn" href={s.twitter} target="_blank" rel="noreferrer">T</a>
            )}
            {!s.facebook && !s.instagram && !s.twitter && (
              <>
                <a className="social-btn" href="#">f</a>
                <a className="social-btn" href="#">📷</a>
                <a className="social-btn" href="#">T</a>
              </>
            )}
          </div>
        </div>

        <div className="footer-col">
          <h4>اتصل بنا</h4>
          <a href={`tel:${s.phone}`}>📞 {s.phone || "0672.43.05.32"}</a>
          <a href={`mailto:${s.email}`}>📧 {s.email || "info@gehazek.dz"}</a>
          <a href="#">❓ الأسئلة المتكررة</a>
        </div>

        <div className="footer-col">
          <h4>الشروط والسياسات</h4>
          <Link to="/terms">شروط الاستخدام</Link>
          <Link to="/privacy">سياسة الخصوصية</Link>
          <Link to="/return-policy">سياسة الاستبدال</Link>
        </div>

        <div className="footer-col">
          <h4>عن المتجر</h4>
          <Link to="/about">عن المتجر</Link>
          <Link to="/payment">طرق الدفع</Link>
          <Link to="/shipping">الشحن والتسليم</Link>
        </div>
      </div>

      <div className="footer-bottom">
        {s.footer?.copyright || "© 2026 جهزك — جميع الحقوق محفوظة"}
      </div>
    </footer>
  );
}
