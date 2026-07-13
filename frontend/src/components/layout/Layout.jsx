import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Header from "./Header";
import Navbar from "./Navbar";
import MobileMenu from "./MobileMenu";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";
import PixelLoader from "./PixelLoader";

export default function Layout({ searchQuery, onSearchChange }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      <PixelLoader />
      <Topbar />
      <Header
        onMenuToggle={() => setMenuOpen((v) => !v)}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navbar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
