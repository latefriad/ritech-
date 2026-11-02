# جهزك للتقنية — متجر الهواتف والحواسيب وإكسسواراتها 📱💻

متجر إلكتروني عربي متكامل بنظام RTL، مخصص لبيع الهواتف الذكية، الحواسيب المحمولة والمكتبية، وإكسسوارات الأجهزة، مع ربط كامل بقاعدة بيانات **Google Sheets** لاستقبال الطلبات وإدارة المنتجات.

---

## 🚀 التقنيات المستخدمة

- **Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7
- **Backend:** Node.js (ESM), Express 5, Google Sheets Service
- **Database:** Google Sheets (Apps Script Web App / CSV) + حفظ محلي احتياطي
- **Currency & Localization:** الدينار الجزائري (د.ج) + 58 ولاية جزائرية

---

## 📊 ربط قاعدة البيانات بـ Google Sheets

المتجر يدعم Google Sheets كقاعدة بيانات حية (قراءة المنتجات + تسجيل الطلبات فورياً):

1. **إنشاء جدول Google Sheets:**
   - قم بإنشاء جدول جديد وأضف ورقتين:
     - `Products`: العناوين `id`, `name`, `price`, `oldPrice`, `discount`, `cat`, `image`, `description`
     - `Orders`: العناوين `orderId`, `date`, `customerName`, `phone`, `wilaya`, `address`, `items`, `total`, `notes`, `status`
2. **إضافة كود Apps Script:**
   - انسخ الكود الموجود في [`backend/google-apps-script.js`](./backend/google-apps-script.js).
   - في Google Sheets، توجه إلى **Extensions ➔ Apps Script** والصق الكود.
   - اضغط **Deploy ➔ New deployment ➔ Web app**.
   - اختر **Execute as: Me** و **Who has access: Anyone**.
3. **وضع الرابط في المتجر:**
   - افتح `backend/.env` وضع الرابط:
     ```env
     GOOGLE_SHEET_WEBAPP_URL=https://script.google.com/macros/s/.../exec
     ```
   - دليل تفصيلي كامل متوفر في [`backend/GOOGLE_SHEETS_SETUP.md`](./backend/GOOGLE_SHEETS_SETUP.md).

> **ملاحظة:** إذا لم تقم بإدخال الرابط بعد، سيعمل المتجر تلقائياً بالكتالوج التقني الافتراضي الغني، وستُحفظ جميع الطلبات محلياً في `backend/data/orders.json` دون أي انقطاع.

---

## 🔐 لوحة التحكم (Admin Dashboard)

لإدارة المنتجات والمخزون والطلبات، توجه إلى المسار `/admin`. يتم تسجيل الدخول بحساب المدير المسؤول عن المتجر.

---

## 🏷️ أقسام وتصنيفات المتجر

| التصنيف | الكود (`cat`) | أمثلة للمنتجات |
|---|---|---|
| **هواتف ذكية** | `phones` | iPhone 16 Pro Max, Samsung Galaxy S24 Ultra, Xiaomi 14 Ultra |
| **إكسسوارات الهواتف** | `phone-accessories` | سماعات AirPods Pro 2, شواحن سريعة 20W, باور بانك Anker, كفرات MagSafe |
| **حواسيب ولابتوب** | `computers` | MacBook Pro M3, ASUS ROG Zephyrus G16, ThinkPad X1 Carbon |
| **ملحقات الكمبيوتر** | `pc-accessories` | كيبورد ميكانيكي Keychron, ماوس MX Master 3S, شاشات OLED, أقراص NVMe SSD |

---

## 💻 التشغيل المحلي

### 1. تشغيل Backend
```bash
cd backend
npm install
npm run dev
# الخادم يعمل على http://localhost:5000
```

### 2. تشغيل Frontend
```bash
cd frontend
npm install
npm run dev
# الموقع يعمل على http://localhost:5173
```

---

## 📱 الصفحات المدعومة

- `/`: الصفحة الرئيسية (سلايدر تقني + أقسام الهواتف والحواسيب + عروض خاصة + منتجات مميزة)
- `/shop`: المتجر مع فلترة حسب الأجهزة (هواتف، حواسيب، ملحقات)، البحث، والترتيب
- `/product/:id`: تفاصيل الجهاز مع المواصفات وزر طلب مباشر
- `/cart` & `/wishlist`: السلة والمفضلة (تُحفظ في المتصفح تلقائياً)
- `/checkout`: إتمام الطلب مع اختيار ولايات الجزائر، وتأكيد فوري يرسل البيانات إلى Google Sheets
- `/admin/orders`: لوحة تحكم إدارة الطلبات ومتابعة الحالات وتحديثها
