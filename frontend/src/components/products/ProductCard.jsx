import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useToast } from "../../context/ToastContext";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const showToast = useToast();
  const wished = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showToast(`✅ تمت الإضافة: ${product.name}`);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(wished ? "💔 تمت الإزالة من المفضلة" : "❤️ تمت الإضافة للمفضلة");
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {product.discount && (
        <span className="badge-discount">{product.discount}</span>
      )}

      <button
        className={`wishlist-btn ${wished ? "active" : ""}`}
        onClick={handleToggleWishlist}
        title="أضف للمفضلة"
      >
        {wished ? "❤️" : "🤍"}
      </button>

      <div className="product-img" style={{ position: "relative" }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <ProductImage />
        )}
        {product.stock === 0 && (
          <span
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "#e24b4a",
              color: "white",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            نفد المخزون
          </span>
        )}
      </div>

      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-prices">
          <span className="price-new">
            {product.price.toLocaleString("ar-DZ")} د.ج
          </span>
          {product.oldPrice && (
            <span className="price-old">
              {product.oldPrice.toLocaleString("ar-DZ")} د.ج
            </span>
          )}
        </div>
        <button className="btn-buy" onClick={handleAddToCart}>
          🛒 اشتري الآن
        </button>
      </div>
    </Link>
  );
}
