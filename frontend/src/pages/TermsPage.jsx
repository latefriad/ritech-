export default function TermsPage() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">📜 الشروط</div>
        <div className="section-title">شروط الاستخدام</div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 32, lineHeight: 2, fontSize: 15 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12, color: "#453ec1" }}>الشروط والأحكام العامة</h3>

        <div style={{ color: "#6b7280" }}>
          <p style={{ marginBottom: 16 }}>
            <strong>1. القبول:</strong> باستخدامك لمتجر جهزك، أنت توافق على جميع الشروط والأحكام الواردة في هذه الصفحة.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>2. المنتجات:</strong> جميع المنتجات المعروضة أصلية وذات جودة عالية. الصagrams قد تختلف قليلاً عن الواقع.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>3. الأسعار:</strong> جميع الأسعار بالدينار الجزائري (د.ج) وتشمل الرسم على القيمة المضافة.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>4. الطلبات:</strong> يحق للمتجر رفض أو إلغاء أي طلب في حال وجود مشكلة في الدفع أو توفر المنتج.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>5. المسؤولية:</strong> جهزك غير مسؤول عن أي أضرار غير مباشرة ت result من استخدام المنتجات.
          </p>
        </div>
      </div>
    </section>
  );
}
