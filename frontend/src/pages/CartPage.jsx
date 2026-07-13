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
    <section style={{ padding: "48px 24px", maxWidth: 900, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">🛒 السلة</div>
        <div className="section-title">منتجاتك</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "white",
              borderRadius: 12,
              border: "1.5px solid #e5e7eb",
              padding: 14,
            }}
          >
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
              }}
            >
              📦
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
              <div style={{ color: "#453ec1", fontWeight: 800, fontSize: 15 }}>
                {item.price.toLocaleString("ar-DZ")} د.ج
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => updateQty(item.id, item.qty - 1)}
                style={{
                  width: 30,
                  height: 30,
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
                  width: 30,
                  height: 30,
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
              onClick={() => {
                removeFromCart(item.id);
                showToast("🗑️ تمت الإزالة من السلة");
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: "#e24b4a",
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 20,
          background: "white",
          borderRadius: 12,
          border: "1.5px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>المجموع</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#453ec1" }}>
            {totalPrice.toLocaleString("ar-DZ")} د.ج
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
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
