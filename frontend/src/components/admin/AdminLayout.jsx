import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const sidebarLinks = [
  { to: "/admin", icon: "📊", label: "لوحة التحكم", end: true },
  { to: "/admin/products", icon: "📦", label: "المنتجات" },
  { to: "/admin/orders", icon: "🛒", label: "الطلبات" },
  { to: "/admin/customers", icon: "👥", label: "العملاء" },
  { to: "/admin/editor", icon: "🎨", label: "تخصيص الموقع" },
  { to: "/admin/settings", icon: "⚙️", label: "الإعدادات" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f8" }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "#1a1a2e",
          color: "white",
          position: sidebarOpen ? "fixed" : "relative",
          top: 0,
          right: sidebarOpen ? 0 : "auto",
          height: "100vh",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.3s",
          transform: sidebarOpen ? "translateX(0)" : "translateX(0)",
        }}
      >
        <div style={{ padding: "20px 20px 30px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>جهزك</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>لوحة التحكم</div>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: isActive ? "white" : "rgba(255,255,255,0.6)",
                background: isActive ? "#453ec1" : "transparent",
                textDecoration: "none",
                transition: "all 0.2s",
              })}
            >
              <span style={{ fontSize: 18 }}>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Cairo, sans-serif",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              display: "none",
            }}
            className="admin-hamburger"
          >
            ☰
          </button>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>لوحة التحكم</h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13,
                color: "#453ec1",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              🌐 زيارة المتجر
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 24 }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-hamburger { display: block !important; }
          aside { transform: translateX(100%) !important; }
        }
      `}</style>
    </div>
  );
}
