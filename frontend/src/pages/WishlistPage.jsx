import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlist();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>❤️ المفضلة فارغة</h2>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          لم تضف أي منتجات للمفضلة بعد
        </p>
        <Link to="/shop" className="btn-primary">
          تسوّق الآن
        </Link>
      </div>
    );
  }

  return (
    <section className="products-section" style={{ minHeight: "60vh" }}>
      <div className="section-header">
        <div className="section-badge">❤️ المفضلة</div>
        <div className="section-title">منتجاتك المفضلة</div>
      </div>
      <div className="products-grid">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
