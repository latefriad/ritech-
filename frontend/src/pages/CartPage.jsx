import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function CartPage() {
  const { items, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const showToast = useToast();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>🛒 السلة فارغة</h2>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>
          لم تضف أي منتجات بعد
        </p>
        <Link to="/shop" className="btn-primary">
          تسوّق الآن
        </Link>
      </div>
    );
  }

  return (
    <section style={{ padding: "clamp(24px, 4vw, 48px) clamp(12px, 3vw, 24px)", maxWidth: 900, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">🛒 السلة</div>
        <div className="section-title">منتجاتك</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} className="cart-item-card">
            <div
              style={{
                width: 70,
                height: 70,
                background: "#f8f8fb",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                "📦"
              )}
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>{item.name}</div>
              <div style={{ color: "#453ec1", fontWeight: 800, fontSize: 15, marginTop: 4 }}>
                {item.price.toLocaleString("ar-DZ")} د.ج
              </div>
            </div>
            <div className="cart-item-stepper" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                -
              </button>
              <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                {item.qty}
              </span>
              <button
                onClick={() => updateQty(item.id, item.qty + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>
            <button
              className="cart-item-delete"
              onClick={() => {
                removeFromCart(item.id);
                showToast("🗑️ تمت الإزالة من السلة");
              }}
              style={{
                background: "#fee2e2",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 14,
                color: "#e24b4a",
              }}
              title="حذف"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary-box">
        <div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>المجموع</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#453ec1" }}>
            {totalPrice.toLocaleString("ar-DZ")} د.ج
          </div>
        </div>
        <div className="cart-summary-btns">
          <button
            className="filter-btn"
            onClick={() => {
              clearCart();
              showToast("🗑️ تم تفريغ السلة");
            }}
          >
            تفريغ السلة
          </button>
          <Link to="/checkout" className="btn-buy" style={{ width: "auto", padding: "10px 28px", textAlign: "center", textDecoration: "none" }}>
            إتمام الشراء
          </Link>
        </div>
      </div>
    </section>
  );
}
