import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuLinks = [
  { to: "/", label: "🏠 الرئيسية" },
  { to: "/shop", label: "🛍️ جميع المنتجات" },
  { to: "/shop?cat=phones", label: "📱 هواتف ذكية" },
  { to: "/shop?cat=phone-accessories", label: "🎧 إكسسوارات الهواتف" },
  { to: "/shop?cat=computers", label: "💻 حواسيب ولابتوب" },
  { to: "/shop?cat=pc-accessories", label: "⌨️ ملحقات الكمبيوتر" },
  { to: "/cart", label: "🛒 سلة المشتريات" },
  { to: "/wishlist", label: "❤️ المفضلة" },
  { to: "/shipping", label: "🚚 الشحن والتسليم" },
  { to: "/about", label: "ℹ️ عن المتجر" },
  { to: "/contact", label: "📞 تواصل معنا" },
];

export default function MobileMenu({ open, onClose }) {
  const { user } = useAuth();

  return (
    <div className={`mobile-menu ${open ? "open" : ""}`}>
      {user?.admin && (
        <Link
          to="/admin"
          onClick={onClose}
          style={{
            background: "#eeedfe",
            color: "#453ec1",
            fontWeight: 800,
            borderRight: "4px solid #453ec1",
          }}
        >
          ⚡ لوحة التحكم وإدارة المخزون
        </Link>
      )}
      {menuLinks.map((link) => (
        <Link key={link.to} to={link.to} onClick={onClose}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
