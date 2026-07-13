import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useSettings } from "../../context/SettingsContext";

export default function Header({ onMenuToggle, searchQuery, onSearchChange }) {
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast("👋 تم تسجيل الخروج");
    navigate("/");
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <Link to="/" className="logo">
        {settings?.siteName || "جهزك"}
      </Link>

      <div className="search-wrap">
        <input
          type="text"
          placeholder="ابحث عن منتج..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button>🔍</button>
      </div>

      <div className="header-icons">
        <Link to="/wishlist" className="icon-btn" title="المفضلة">
          {wishlistItems.length > 0 ? "❤️" : "🤍"}
          {wishlistItems.length > 0 && (
            <span className="badge-count">{wishlistItems.length}</span>
          )}
        </Link>
        <Link to="/cart" className="icon-btn" title="السلة">
          🛒
          {totalItems > 0 && (
            <span className="badge-count">{totalItems}</span>
          )}
        </Link>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {user.admin && (
              <Link
                to="/admin"
                style={{ fontSize: 12, fontWeight: 700, color: "#453ec1", textDecoration: "none", padding: "4px 10px", background: "#eeedfe", borderRadius: 6 }}
              >
                ⚡ لوحة التحكم
              </Link>
            )}
            <span style={{ fontSize: 13, fontWeight: 600, color: "#453ec1" }}>
              {user.displayName || user.email}
            </span>
            <button
              className="icon-btn"
              title="تسجيل الخروج"
              onClick={handleLogout}
              style={{ fontSize: 16 }}
            >
              🚪
            </button>
          </div>
        ) : (
          <Link to="/login" className="icon-btn" title="حسابي">
            👤
          </Link>
        )}
        <button className="hamburger" onClick={onMenuToggle}>
          ☰
        </button>
      </div>
    </header>
  );
}
