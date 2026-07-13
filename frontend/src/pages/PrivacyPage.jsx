export default function PrivacyPage() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">🔒 الخصوصية</div>
        <div className="section-title">سياسة الخصوصية</div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 32, lineHeight: 2, fontSize: 15 }}>
        <div style={{ color: "#6b7280" }}>
          <p style={{ marginBottom: 16 }}>
            <strong>جمع المعلومات:</strong> نجمع فقط المعلومات الضرورية لمعالجة طلباتك: الاسم، رقم الهاتف، وعنوان الشحن.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>استخدام المعلومات:</strong> نستخدم معلوماتك فقط لتوصيل طلباتك والتواصل معك بخصوص طلبك.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>حماية المعلومات:</strong> نتخذ إجراءات أمنية لحماية معلوماتك الشخصية من الوصول غير المصرح به.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>مشاركة المعلومات:</strong> لا نبيع أو نشارك معلوماتك مع أطراف ثالثة إلا إذا كان ذلك مطلوباً قانونياً.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>ملفات تعريف الارتباط:</strong> نستخدم ملفات تعريف الارتباط لتحسين تجربة التسوّق.
          </p>
          <p>
            <strong>التواصل:</strong> لأي استفسار حول سياسة الخصوصية، تواصل معنا على info@gehazek.dz
          </p>
        </div>
      </div>
    </section>
  );
}
