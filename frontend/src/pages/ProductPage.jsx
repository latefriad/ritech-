import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { getProductById, createOrder } from "../services/api";
import { allProducts } from "../data/products";
import { wilayas } from "../data/wilayas";
import ProductImage from "../components/products/ProductImage";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const showToast = useToast();

  // Order form state
  const [qty, setQty] = useState(1);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", wilaya: "", address: "", notes: "" });
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        if (!cancelled) setProduct(data);
      } catch {
        const fallback = allProducts.find(
          (p) => String(p.id) === String(id) || p.id === Number(id)
        );
        if (!cancelled) {
          if (fallback) setProduct(fallback);
          else setError("المنتج غير موجود");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.name || !orderForm.phone || !orderForm.wilaya || !orderForm.address) {
      showToast("⚠️ أدخل الاسم والهاتف والولاية والعنوان");
      return;
    }
    setSubmitting(true);
    try {
      const selectedWilaya = wilayas.find((w) => w.code === orderForm.wilaya);
      await createOrder({
        items: [{ id: product.id, name: product.name, price: product.price, qty }],
        total: product.price * qty,
        name: orderForm.name,
        phone: orderForm.phone,
        wilaya: selectedWilaya ? `${selectedWilaya.code} - ${selectedWilaya.name}` : orderForm.wilaya,
        address: orderForm.address,
        notes: orderForm.notes,
      });
      setOrderSuccess(true);
      showToast("✅ تم الطلب بنجاح! سنتواصل معك قريباً");
    } catch (err) {
      showToast("❌ خطأ في الطلب: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <div style={{ fontSize: 16, color: "#6b7280" }}>جاري تحميل المنتج...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
        <h2 style={{ fontSize: 22, marginBottom: 12 }}>المنتج غير موجود</h2>
        <p style={{ color: "#6b7280", marginBottom: 20 }}>لم نتمكن من العثور على هذا المنتج</p>
        <Link to="/shop" className="btn-primary">العودة للمتجر</Link>
      </div>
    );
  }

  // Order success screen
  if (orderSuccess) {
    return (
      <section style={{ padding: "80px 24px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 80, marginBottom: 20 }}>✅</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12, color: "#1a9e75" }}>
          تم الطلب بنجاح!
        </h2>
        <p style={{ fontSize: 16, color: "#6b7280", marginBottom: 8 }}>
          شكراً لك {orderForm.name}
        </p>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.8 }}>
          سنتواصل معك على رقم <strong style={{ color: "#453ec1" }}>{orderForm.phone}</strong> لتأكيد الطلب
          <br />
          الولاية: <strong style={{ color: "#453ec1" }}>{wilayas.find((w) => w.code === orderForm.wilaya)?.name || orderForm.wilaya}</strong>
        </p>
        <div style={{ padding: 20, background: "#f5f5f8", borderRadius: 12, marginBottom: 24, textAlign: "right" }}>
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>المنتج</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{product.name} × {qty}</div>
          <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>المجموع</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#453ec1" }}>
            {(product.price * qty).toLocaleString("ar-DZ")} د.ج
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/shop" className="btn-primary">العودة للمتجر</Link>
          <Link to="/" className="btn-outline" style={{ color: "#453ec1", borderColor: "#453ec1" }}>الرئيسية</Link>
        </div>
      </section>
    );
  }

  const wished = isWishlisted(product.id);
  const totalPrice = product.price * qty;
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontFamily: "Cairo, sans-serif",
    fontSize: 14,
    outline: "none",
  };

  return (
    <section style={{ padding: "clamp(20px, 4vw, 48px) clamp(12px, 3vw, 24px)", maxWidth: 1000, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, fontSize: 13, color: "#6b7280", overflowX: "auto", whiteSpace: "nowrap", paddingBottom: 4 }}>
        <Link to="/" style={{ color: "#6b7280", textDecoration: "none" }}>الرئيسية</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link to="/shop" style={{ color: "#6b7280", textDecoration: "none" }}>المتجر</Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#453ec1", fontWeight: 600 }}>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        {/* Product Image */}
        <div className="product-detail-sticky">
          <div
            style={{
              background: "white",
              borderRadius: 14,
              border: "1.5px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                background: "#f8f8fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: 1,
              }}
            >
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ProductImage />
              )}
            </div>
          </div>

          {/* Features below image */}
          <div style={{ marginTop: 16, padding: 16, background: "white", borderRadius: 12, border: "1.5px solid #e5e7eb" }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>✨ مميزات المنتج</h4>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 2 }}>
              <p>🚚 شحن سريع لجميع الولايات</p>
              <p>💳 الدفع عند الاستلام</p>
              <p>✅ منتج أصلي 100%</p>
              <p>🔄 استبدال خلال 7 أيام</p>
              <p>📦 تغليف آمن ومضمون</p>
            </div>
          </div>
        </div>

        {/* Right Side: Product Info + Order Form */}
        <div>
          {/* Product Info */}
          <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24, marginBottom: 16 }}>
            {product.discount && (
              <span style={{ background: "#e24b4a", color: "white", padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 12 }}>
                خصم {product.discount}
              </span>
            )}
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>{product.name}</h1>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#453ec1" }}>
                {product.price.toLocaleString("ar-DZ")} د.ج
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 16, color: "#6b7280", textDecoration: "line-through" }}>
                  {product.oldPrice.toLocaleString("ar-DZ")} د.ج
                </span>
              )}
              {hasDiscount && (
                <span style={{ fontSize: 13, color: "#1a9e75", fontWeight: 700 }}>
                  وفر {(product.oldPrice - product.price).toLocaleString("ar-DZ")} د.ج
                </span>
              )}
            </div>

            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
              التصنيف: <span style={{ fontWeight: 600 }}>{product.cat}</span>
            </div>

            {/* Stock Availability Badge */}
            <div style={{ marginBottom: 12 }}>
              {product.stock === 0 ? (
                <span style={{ padding: "4px 12px", borderRadius: 6, background: "#fee2e2", color: "#e24b4a", fontWeight: 800, fontSize: 12, display: "inline-block" }}>
                  ❌ نفد من المخزون حالياً (Rupture de Stock)
                </span>
              ) : product.stock !== undefined && product.stock <= (product.minStock || 5) ? (
                <span style={{ padding: "4px 12px", borderRadius: 6, background: "#fef3c7", color: "#b45309", fontWeight: 800, fontSize: 12, display: "inline-block" }}>
                  ⚠️ سارع بالطلب! متبقي {product.stock} قطع فقط في المخزون
                </span>
              ) : (
                <span style={{ padding: "4px 12px", borderRadius: 6, background: "#dcfce7", color: "#15803d", fontWeight: 800, fontSize: 12, display: "inline-block" }}>
                  ✅ متوفر في المخزون ({product.stock !== undefined ? product.stock : 10} قطعة جاهزة للشحن)
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#6b7280" }}>التقييم:</span>
              <span style={{ color: "#f5a623" }}>★★★★★</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>(4.8)</span>
            </div>
          </div>

          {/* Order Form - YallaOrders Style */}
          <div style={{ background: "white", borderRadius: 14, border: "2px solid #453ec1", overflow: "hidden" }}>
            {/* Order Header */}
            <div style={{ background: "linear-gradient(135deg, #453ec1, #3630a0)", padding: "16px 24px", color: "white" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>📦 اطلب الآن</h3>
              <p style={{ fontSize: 13, opacity: 0.8 }}>سنتواصل معك لتأكيد الطلب</p>
            </div>

            <form onSubmit={handleOrder} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Quantity */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                  الكمية
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", fontSize: 18, fontWeight: 700, cursor: "pointer" }}
                  >
                    −
                  </button>
                  <span style={{ fontSize: 18, fontWeight: 800, minWidth: 30, textAlign: "center" }}>{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", fontSize: 18, fontWeight: 700, cursor: "pointer" }}
                  >
                    +
                  </button>
                  <span style={{ fontSize: 14, color: "#6b7280" }}>
                    المجموع: <strong style={{ color: "#453ec1" }}>{totalPrice.toLocaleString("ar-DZ")} د.ج</strong>
                  </span>
                </div>
              </div>

              {/* Name */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                  الاسم الكامل *
                </label>
                <input
                  style={inputStyle}
                  placeholder="أدخل اسمك الكامل"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                  رقم الهاتف *
                </label>
                <input
                  style={{ ...inputStyle, direction: "ltr", textAlign: "left" }}
                  placeholder="0672.43.05.32"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                />
              </div>

              {/* Wilaya */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                  الولاية *
                </label>
                <select
                  value={orderForm.wilaya}
                  onChange={(e) => setOrderForm({ ...orderForm, wilaya: e.target.value })}
                  style={{ ...inputStyle, direction: "rtl", cursor: "pointer" }}
                >
                  <option value="">— اختر الولاية —</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                  العنوان الكامل *
                </label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: 70 }}
                  placeholder="الولاية، البلدية، الشارع، رقم المنزل..."
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
                  ملاحظات (اختياري)
                </label>
                <input
                  style={inputStyle}
                  placeholder="ملاحظات إضافية..."
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                />
              </div>

              {/* Summary */}
              <div style={{ padding: 16, background: "#f5f5f8", borderRadius: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span>المنتج</span>
                  <span style={{ fontWeight: 600 }}>{product.name}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span>الكمية</span>
                  <span style={{ fontWeight: 600 }}>{qty}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 14 }}>
                  <span>السعر</span>
                  <span style={{ fontWeight: 600 }}>{product.price.toLocaleString("ar-DZ")} د.ج</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid #e5e7eb", fontSize: 18, fontWeight: 800 }}>
                  <span>المجموع</span>
                  <span style={{ color: "#453ec1" }}>{totalPrice.toLocaleString("ar-DZ")} د.ج</span>
                </div>
              </div>

              {/* Landing Page */}
          {(product.landingPage || product.landingPageImage) && (
            <div style={{ marginTop: 8 }}>
              {product.landingPageImage && (
                <div style={{ marginBottom: 12, borderRadius: 10, overflow: "hidden", border: "1.5px solid #e5e7eb" }}>
                  <img
                    src={product.landingPageImage}
                    alt="صفحة الهبوط"
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                  />
                </div>
              )}
              {product.landingPage && (
                <a
                  href={product.landingPage}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 20px",
                    borderRadius: 8,
                    border: "2px solid #1a9e75",
                    background: "#f0fdf4",
                    color: "#1a9e75",
                    fontFamily: "Cairo, sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                >
                  🌐 عرض صفحة الهبوط
                </a>
              )}
            </div>
          )}

          {/* Payment Info */}
              <div style={{ padding: 12, background: "#eeedfe", borderRadius: 8, fontSize: 13, color: "#453ec1", textAlign: "center" }}>
                💳 الدفع عند الاستلام — لا حاجة لبطاقة بنكية
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-buy"
                disabled={submitting}
                style={{
                  fontSize: 16,
                  padding: "14px",
                  opacity: submitting ? 0.7 : 1,
                  background: submitting ? "#6b7280" : undefined,
                }}
              >
                {submitting ? "⏳ جاري إرسال الطلب..." : `🛒 اطلب الآن — ${totalPrice.toLocaleString("ar-DZ")} د.ج`}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                className={`wishlist-btn ${wished ? "active" : ""}`}
                style={{ position: "static", width: "100%", height: 42, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14, fontWeight: 600 }}
                onClick={() => {
                  toggleWishlist(product);
                  showToast(wished ? "💔 تمت الإزالة من المفضلة" : "❤️ تمت الإضافة للمفضلة");
                }}
              >
                {wished ? "❤️" : "🤍"} {wished ? "في المفضلة" : "أضف للمفضلة"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
