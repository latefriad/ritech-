import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ReturnPolicyPage from "./pages/ReturnPolicyPage";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import SiteEditorPage from "./pages/admin/SiteEditorPage";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ textAlign: "center", color: "#6b7280" }}>⏳ جاري التحميل...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.admin) {
    return (
      <div style={{ textAlign: "center", padding: "100px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>غير مصرح</h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>ليس لديك صلاحية للوصول لهذه الصفحة</p>
        <a href="/" className="btn-primary">العودة للرئيسية</a>
      </div>
    );
  }

  return children;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <WishlistProvider>
              <Routes>
                {/* Public Routes */}
                <Route
                  element={
                    <Layout
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                    />
                  }
                >
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop searchQuery={searchQuery} />} />
                  <Route path="/product/:id" element={<ProductPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/shipping" element={<ShippingPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/return-policy" element={<ReturnPolicyPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminLayout />
                    </AdminRoute>
                  }
                >
                  <Route index element={<DashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="editor" element={<SiteEditorPage />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </ToastProvider>
  </BrowserRouter>
  );
}
