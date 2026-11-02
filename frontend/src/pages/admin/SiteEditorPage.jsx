import { useState, useEffect } from "react";
import { getSiteSettings, updateSiteSettings } from "../../services/siteSettings";
import { useToast } from "../../context/ToastContext";
import ImageUpload from "../../components/ui/ImageUpload";

const tabs = [
  { key: "general", label: "🏪 عام", icon: "🏪" },
  { key: "hero", label: "🎯 الصفحة الرئيسية", icon: "🎯" },
  { key: "promo", label: "📢 البانر الترويجي", icon: "📢" },
  { key: "footer", label: "📄 الفوتر", icon: "📄" },
  { key: "shipping", label: "🚚 الشحن", icon: "🚚" },
  { key: "social", label: "📱 التواصل الاجتماعي", icon: "📱" },
  { key: "pixels", label: "📊 التتبع والإعلانات", icon: "📊" },
];

export default function SiteEditorPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const showToast = useToast();

  useEffect(() => {
    (async () => {
      const data = await getSiteSettings();
      setSettings(data);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteSettings(settings);
      showToast("✅ تم حفظ الإعدادات بنجاح");
    } catch {
      showToast("❌ خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateNested = (parent, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [key]: value },
    }));
  };

  const updateSlide = (index, key, value) => {
    setSettings((prev) => {
      const newSlides = [...prev.slides];
      newSlides[index] = { ...newSlides[index], [key]: value };
      return { ...prev, slides: newSlides };
    });
  };

  const addSlide = () => {
    setSettings((prev) => ({
      ...prev,
      slides: [
        ...prev.slides,
        {
          id: Date.now(),
          badge: "✨ عرض جديد",
          title: "عنوان جديد",
          subtitle: "وصف جديد",
          btn1: "تسوّق الآن",
          btn2: "المزيد",
          gradient: "linear-gradient(135deg, #453ec1 0%, #1a1460 100%)",
        },
      ],
    }));
  };

  const removeSlide = (index) => {
    setSettings((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>⏳ جاري التحميل...</div>;
  }

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 8,
    fontFamily: "Cairo, sans-serif",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle = {
    fontSize: 12,
    fontWeight: 600,
    color: "#6b7280",
    display: "block",
    marginBottom: 4,
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800 }}>🎨 تخصيص الموقع</h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-buy"
          style={{ width: "auto", padding: "9px 24px", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "⏳ جاري الحفظ..." : "💾 حفظ كل التغييرات"}
        </button>
      </div>

      <div className="site-editor-layout">
        {/* Sidebar Tabs */}
        <div className="site-editor-tabs">
          <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", overflow: "hidden" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  borderBottom: "1px solid #f0f0f0",
                  background: activeTab === tab.key ? "#eeedfe" : "white",
                  color: activeTab === tab.key ? "#453ec1" : "#6b7280",
                  fontFamily: "Cairo, sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
            {/* General Tab */}
            {activeTab === "general" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🏪 الإعدادات العامة</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>اسم المتجر (عربي)</label>
                      <input style={inputStyle} value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>اسم المتجر (إنجليزي)</label>
                      <input style={inputStyle} value={settings.siteNameEn} onChange={(e) => update("siteNameEn", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>الشعار (Tagline)</label>
                    <input style={inputStyle} value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>رابط الشعار (Logo URL)</label>
                    <input style={inputStyle} value={settings.logo} onChange={(e) => update("logo", e.target.value)} placeholder="https://..." />
                  </div>
                  <div>
                    <label style={labelStyle}>اللون الرئيسي</label>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <input type="color" value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} style={{ width: 40, height: 36, border: "none", cursor: "pointer" }} />
                      <input style={{ ...inputStyle, width: 120 }} value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Slides Tab */}
            {activeTab === "hero" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>🎯 السلايدر الرئيسي</h4>
                  <button onClick={addSlide} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #453ec1", background: "#eeedfe", color: "#453ec1", fontFamily: "Cairo, sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    + إضافة سلايد
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {settings.slides.map((slide, i) => (
                    <div key={slide.id} style={{ padding: 16, background: "#f5f5f8", borderRadius: 10, position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>سلايد #{i + 1}</span>
                        {settings.slides.length > 1 && (
                          <button onClick={() => removeSlide(i)} style={{ background: "none", border: "none", color: "#e24b4a", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                            🗑️ حذف
                          </button>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label style={labelStyle}>الشارة (Badge)</label>
                          <input style={inputStyle} value={slide.badge} onChange={(e) => updateSlide(i, "badge", e.target.value)} />
                        </div>
                        <div>
                          <label style={labelStyle}>العنوان</label>
                          <input style={inputStyle} value={slide.title} onChange={(e) => updateSlide(i, "title", e.target.value)} />
                        </div>
                        <div>
                          <label style={labelStyle}>الوصف</label>
                          <input style={inputStyle} value={slide.subtitle} onChange={(e) => updateSlide(i, "subtitle", e.target.value)} />
                        </div>
                        <div>
                          <label style={labelStyle}>الزر 1</label>
                          <input style={inputStyle} value={slide.btn1} onChange={(e) => updateSlide(i, "btn1", e.target.value)} />
                        </div>
                        <div>
                          <label style={labelStyle}>الزر 2</label>
                          <input style={inputStyle} value={slide.btn2} onChange={(e) => updateSlide(i, "btn2", e.target.value)} />
                        </div>
                        <div>
                          <label style={labelStyle}>التدرج اللوني</label>
                          <input style={inputStyle} value={slide.gradient} onChange={(e) => updateSlide(i, "gradient", e.target.value)} placeholder="linear-gradient(...)" />
                        </div>
                      </div>
                      {/* Image Upload */}
                      <div style={{ marginTop: 12 }}>
                        <ImageUpload
                          value={slide.image}
                          onChange={(url) => updateSlide(i, "image", url)}
                          label="صورة السلايد (اختياري)"
                        />
                      </div>
                      {/* Preview */}
                      <div style={{ marginTop: 12, padding: "16px 20px", borderRadius: 8, background: slide.image ? `url(${slide.image}) center/cover` : slide.gradient, color: "white", minHeight: 80, position: "relative" }}>
                        {slide.image && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", borderRadius: 8 }} />}
                        <div style={{ position: "relative", zIndex: 1 }}>
                          <div style={{ fontSize: 11, background: "rgba(255,255,255,0.15)", display: "inline-block", padding: "2px 10px", borderRadius: 20, marginBottom: 8 }}>{slide.badge}</div>
                          <div style={{ fontSize: 16, fontWeight: 800 }}>{slide.title.replace("\n", " ")}</div>
                          <div style={{ fontSize: 12, opacity: 0.8 }}>{slide.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Promo Tab */}
            {activeTab === "promo" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📢 البانر الترويجي</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <ImageUpload
                    value={settings.promo.image}
                    onChange={(url) => updateNested("promo", "image", url)}
                    label="صورة البانر (اختياري)"
                  />
                  <div>
                    <label style={labelStyle}>الشارة</label>
                    <input style={inputStyle} value={settings.promo.badge} onChange={(e) => updateNested("promo", "badge", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>العنوان</label>
                    <input style={inputStyle} value={settings.promo.title} onChange={(e) => updateNested("promo", "title", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>الوصف</label>
                    <input style={inputStyle} value={settings.promo.subtitle} onChange={(e) => updateNested("promo", "subtitle", e.target.value)} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>الزر 1</label>
                      <input style={inputStyle} value={settings.promo.btn1} onChange={(e) => updateNested("promo", "btn1", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>الزر 2</label>
                      <input style={inputStyle} value={settings.promo.btn2} onChange={(e) => updateNested("promo", "btn2", e.target.value)} />
                    </div>
                  </div>
                  {/* Preview */}
                  <div style={{
                    padding: 20,
                    borderRadius: 10,
                    background: settings.promo.image
                      ? `url(${settings.promo.image}) center/cover`
                      : "linear-gradient(135deg, #1a1460 0%, #453ec1 100%)",
                    color: "white",
                    textAlign: "center",
                    position: "relative",
                    minHeight: 120,
                  }}>
                    {settings.promo.image && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", borderRadius: 10 }} />
                    )}
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div style={{ fontSize: 12, background: "rgba(255,255,255,0.15)", display: "inline-block", padding: "4px 14px", borderRadius: 20, marginBottom: 10 }}>{settings.promo.badge}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{settings.promo.title}</div>
                      <div style={{ fontSize: 13, opacity: 0.8 }}>{settings.promo.subtitle}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Tab */}
            {activeTab === "footer" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📄 الفوتر</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>النص التوضيحي</label>
                    <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={settings.footer.description} onChange={(e) => updateNested("footer", "description", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>حقوق النشر</label>
                    <input style={inputStyle} value={settings.footer.copyright} onChange={(e) => updateNested("footer", "copyright", e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>الشريط العلوي</label>
                    <input style={inputStyle} value={settings.topbarText} onChange={(e) => update("topbarText", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Tab */}
            {activeTab === "shipping" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>🚚 إعدادات الشحن</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>الشحن المجاني من (د.ج)</label>
                      <input type="number" style={inputStyle} value={settings.shipping.freeShippingThreshold} onChange={(e) => updateNested("shipping", "freeShippingThreshold", Number(e.target.value))} />
                    </div>
                    <div>
                      <label style={labelStyle}>تكلفة الشحن (د.ج)</label>
                      <input type="number" style={inputStyle} value={settings.shipping.shippingCost} onChange={(e) => updateNested("shipping", "shippingCost", Number(e.target.value))} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>مدة التوصيل</label>
                    <input style={inputStyle} value={settings.shipping.deliveryDays} onChange={(e) => updateNested("shipping", "deliveryDays", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📱 التواصل الاجتماعي</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>فيسبوك</label>
                    <input style={inputStyle} value={settings.facebook} onChange={(e) => update("facebook", e.target.value)} placeholder="https://facebook.com/..." />
                  </div>
                  <div>
                    <label style={labelStyle}>إنستغرام</label>
                    <input style={inputStyle} value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="https://instagram.com/..." />
                  </div>
                  <div>
                    <label style={labelStyle}>تويتر</label>
                    <input style={inputStyle} value={settings.twitter} onChange={(e) => update("twitter", e.target.value)} placeholder="https://twitter.com/..." />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>الهاتف</label>
                      <input style={inputStyle} value={settings.phone} onChange={(e) => update("phone", e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>البريد الإلكتروني</label>
                      <input style={inputStyle} value={settings.email} onChange={(e) => update("email", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>العنوان</label>
                    <input style={inputStyle} value={settings.address} onChange={(e) => update("address", e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {/* Pixels Tab */}
            {activeTab === "pixels" && (
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>📊 التتبع والإعلانات</h4>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
                  أضف أكواد التتبع لقياس التحويلات وإدارة إعلاناتك
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {/* Facebook Pixel */}
                  <div style={{ padding: 20, background: "#f5f5f8", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16 }}>f</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>Facebook Pixel</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>تتبع التحويلات من إعلانات فيسبوك</div>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Pixel ID</label>
                      <input
                        style={inputStyle}
                        value={settings.facebookPixelId}
                        onChange={(e) => update("facebookPixelId", e.target.value)}
                        placeholder="123456789012345"
                      />
                    </div>
                    <div style={{ marginTop: 10, padding: 10, background: "white", borderRadius: 6, fontSize: 12, color: "#6b7280" }}>
                      💡 أوجد الـ ID في: Facebook Events Manager → Your Pixel → Settings → Pixel ID
                    </div>
                  </div>

                  {/* TikTok Pixel */}
                  <div style={{ padding: 20, background: "#f5f5f8", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#000000", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14 }}>TT</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>TikTok Pixel</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>تتبع التحويلات من إعلانات تيك توك</div>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Pixel ID</label>
                      <input
                        style={inputStyle}
                        value={settings.tiktokPixelId}
                        onChange={(e) => update("tiktokPixelId", e.target.value)}
                        placeholder="Cxxxxxxxxxxxxxxxx"
                      />
                    </div>
                    <div style={{ marginTop: 10, padding: 10, background: "white", borderRadius: 6, fontSize: 12, color: "#6b7280" }}>
                      💡 أوجد الـ ID في: TikTok Ads Manager → Assets → Events → Web Events → Pixel ID
                    </div>
                  </div>

                  {/* Google Analytics */}
                  <div style={{ padding: 20, background: "#f5f5f8", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "#EA4335", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 14 }}>G</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>Google Analytics (GA4)</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>تحليل حركة الزوار</div>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Measurement ID</label>
                      <input
                        style={inputStyle}
                        value={settings.googleAnalyticsId}
                        onChange={(e) => update("googleAnalyticsId", e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div style={{ marginTop: 10, padding: 10, background: "white", borderRadius: 6, fontSize: 12, color: "#6b7280" }}>
                      💡 أوجد الـ ID في: Google Analytics → Admin → Data Streams → Web → Measurement ID
                    </div>
                  </div>

                  {/* Active Pixels Status */}
                  <div style={{ padding: 16, background: "#eeedfe", borderRadius: 10 }}>
                    <h5 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📊 الأكواد النشطة</h5>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: settings.facebookPixelId ? "#dcfce7" : "#fee2e2", color: settings.facebookPixelId ? "#166534" : "#991b1b" }}>
                        Facebook {settings.facebookPixelId ? "✅" : "❌"}
                      </span>
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: settings.tiktokPixelId ? "#dcfce7" : "#fee2e2", color: settings.tiktokPixelId ? "#166534" : "#991b1b" }}>
                        TikTok {settings.tiktokPixelId ? "✅" : "❌"}
                      </span>
                      <span style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: settings.googleAnalyticsId ? "#dcfce7" : "#fee2e2", color: settings.googleAnalyticsId ? "#166534" : "#991b1b" }}>
                        GA4 {settings.googleAnalyticsId ? "✅" : "❌"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
