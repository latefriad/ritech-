export default function AdminSettingsPage() {
  return (
    <div>
      <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>⚙️ الإعدادات</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🏪 معلومات المتجر</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>اسم المتجر</label>
              <input
                defaultValue="جهزك"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>رقم الهاتف</label>
              <input
                defaultValue="0672.43.05.32"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", direction: "ltr" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>البريد الإلكتروني</label>
              <input
                defaultValue="info@gehazek.dz"
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", direction: "ltr" }}
              />
            </div>
            <button
              className="btn-buy"
              style={{ width: "auto", padding: "9px 24px", alignSelf: "flex-start" }}
              onClick={() => alert("✅ تم الحفظ")}
            >
              💾 حفظ
            </button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📦 إعدادات الشحن</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>الشحن المجاني (د.ج)</label>
                <input
                  defaultValue="5000"
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", direction: "ltr" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>تكلفة الشحن (د.ج)</label>
                <input
                  defaultValue="400"
                  style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontFamily: "Cairo, sans-serif", fontSize: 13, outline: "none", direction: "ltr" }}
                />
              </div>
            </div>
            <button
              className="btn-buy"
              style={{ width: "auto", padding: "9px 24px", alignSelf: "flex-start" }}
              onClick={() => alert("✅ تم الحفظ")}
            >
              💾 حفظ
            </button>
          </div>
        </div>

        <div style={{ background: "#fef3f3", borderRadius: 14, border: "1px solid #fecaca", padding: 24 }}>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: "#e24b4a" }}>⚠️ منطقة الخطر</h4>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>الإجراءات التالية لا يمكن التراجع عنها</p>
          <button
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "1px solid #e24b4a",
              background: "white",
              color: "#e24b4a",
              fontFamily: "Cairo, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => alert("⚠️ تأكيد الحذف مطلوب")}
          >
            🗑️ حذف جميع المنتجات
          </button>
        </div>
      </div>
    </div>
  );
}
