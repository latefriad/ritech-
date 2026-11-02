import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { syncGoogleSheets } from "../../services/api";

const sidebarLinks = [
  { to: "/admin", icon: "📊", label: "لوحة التحكم", end: true },
  { to: "/admin/stock", icon: "🏬", label: "إدارة المخزون (Stock)" },
  { to: "/admin/products", icon: "📦", label: "المنتجات" },
  { to: "/admin/orders", icon: "🛒", label: "الطلبات" },
  { to: "/admin/customers", icon: "👥", label: "العملاء" },
  { to: "/admin/editor", icon: "🎨", label: "تخصيص الموقع" },
  { to: "/admin/settings", icon: "⚙️", label: "الإعدادات" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem("last_gsheet_sync") || "");
  const { user, logout } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await syncGoogleSheets();
      const timeStr = new Date().toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" });
      setLastSync(timeStr);
      localStorage.setItem("last_gsheet_sync", timeStr);
      showToast(`✅ تمت المزامنة مع Google Sheets بنجاح! (${res.synced?.products || 0} منتج)`);
      window.dispatchEvent(new Event("site_synced"));
    } catch (err) {
      showToast("❌ فشلت المزامنة: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f8" }}>
      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 45,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Responsive Sidebar */}
      <aside
        className={`admin-aside ${sidebarOpen ? "open" : ""}`}
      >
        <div style={{ padding: "20px 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>جهزك للتقنية</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>لوحة الإدارة والمخزون</div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              width: 32,
              height: 32,
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="admin-sidebar-close"
          >
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
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
                color: isActive ? "white" : "rgba(255,255,255,0.7)",
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
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            👤 {user?.email || "مدير المتجر"}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "Cairo, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top Bar */}
        <header
          style={{
            background: "white",
            borderBottom: "1px solid #e5e7eb",
            padding: "10px clamp(12px, 3vw, 24px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 30,
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="admin-hamburger"
              aria-label="القائمة الجانبية"
            >
              ☰
            </button>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "#111827" }}>لوحة التحكم</h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {lastSync && (
              <span className="admin-last-sync" style={{ fontSize: 11, color: "#6b7280" }}>
                🕒 {lastSync}
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={syncing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1.5px solid #16a34a",
                background: syncing ? "#f0fdf4" : "#16a34a",
                color: syncing ? "#16a34a" : "white",
                fontSize: 12,
                fontWeight: 700,
                cursor: syncing ? "not-allowed" : "pointer",
                fontFamily: "Cairo",
                boxShadow: "0 2px 6px rgba(22, 163, 74, 0.2)",
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  animation: syncing ? "spin 1s linear infinite" : "none",
                }}
              >
                🔄
              </span>
              <span>{syncing ? "جاري المزامنة..." : "مزامنة Google Sheets"}</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12,
                color: "#453ec1",
                fontWeight: 700,
                textDecoration: "none",
                padding: "6px 10px",
                background: "#eeedfe",
                borderRadius: 8,
                whiteSpace: "nowrap",
              }}
            >
              🌐 المتجر
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: "clamp(12px, 3vw, 24px)" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (min-width: 1025px) {
          .admin-sidebar-close { display: none !important; }
        }
        @media (max-width: 640px) {
          .admin-last-sync { display: none !important; }
        }
      `}</style>
    </div>
  );
}
