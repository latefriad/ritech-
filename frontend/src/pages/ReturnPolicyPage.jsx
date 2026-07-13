export default function ReturnPolicyPage() {
  return (
    <section style={{ padding: "48px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div className="section-header">
        <div className="section-badge">🔄 الاستبدال</div>
        <div className="section-title">سياسة الاستبدال والاسترجاع</div>
      </div>

      <div style={{ background: "white", borderRadius: 14, border: "1.5px solid #e5e7eb", padding: 32, lineHeight: 2, fontSize: 15 }}>
        <div style={{ color: "#6b7280" }}>
          <p style={{ marginBottom: 16 }}>
            <strong>مدة الاستبدال:</strong> يمكنك طلب استبدال المنتج خلال 7 أيام من تاريخ الاستلام.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>الشروط:</strong> يجب أن يكون المنتج في حالته الأصلية، غير مستخدم، مع جميع الملحقات والتغليف.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>المنتجات غير القابلة للاستبدال:</strong> المنتجات التالفة نتيجة سوء الاستخدام لا يمكن استبدالها.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>عملية الاستبدال:</strong> تواصل معنا عبر الهاتف أو البريد الإلكتروني مع إرفاق صورة للمنتج.
          </p>
          <p style={{ marginBottom: 16 }}>
            <strong>الاسترجاع:</strong> في حالة الاسترجاع، يتم رد المبلغ خلال 7 أيام عمل عبر التحويل البنكي أو الدفع نقداً.
          </p>
          <p>
            <strong>التكلفة:</strong> تكلفة الشحن للإرجاع على العميل إلا في حالة وجود عيب في المنتج.
          </p>
        </div>
      </div>
    </section>
  );
}
