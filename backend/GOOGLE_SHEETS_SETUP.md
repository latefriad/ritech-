# 📊 دليل إنشاء وربط قاعدة بيانات Google Sheets الكاملة (All Site Data)

جدول Google Sheets هو **قاعدة البيانات المركزية الوحيدة** لمتجر "جهزك للتقنية":
1. **المنتجات والمخزون (`Products`)**
2. **الطلبات وحالاتها (`Orders`)**
3. **العملاء وإحصائياتهم (`Customers`)**
4. **إعدادات الموقع والشحن (`Settings`)**

---

## 📑 هيكل الأوراق الأربعة في Google Sheets

أنشئ جدولاً جديداً في [Google Sheets](https://sheets.google.com) باسم `Gehazek Tech Database` وضع به الأوراق التالية:

### 1. ورقة `Products` (المنتجات والمخزون)
العناوين في الصف الأول:
```text
id	sku	name	price	oldPrice	discount	stock	minStock	cat	image	description
```
* **stock:** رصيد المخزون الفعلي (ينقص تلقائياً عند شراء العملاء، ويمكن تعديله من لوحة التحكم).
* **cat:** التصنيف (`phones`, `phone-accessories`, `computers`, `pc-accessories`).

---

### 2. ورقة `Orders` (طلبات الزبائن)
العناوين في الصف الأول:
```text
orderId	date	customerName	phone	wilaya	address	items	total	notes	status
```
*(يقوم المتجر بملء هذه الورقة فورياً عند إتمام أي طلب).*

---

### 3. ورقة `Customers` (دليل العملاء)
العناوين في الصف الأول:
```text
name	phone	wilaya	address	ordersCount	totalSpent	lastOrderDate
```
*(يتم تحديث هذه الورقة تلقائياً عند كل طلب لحساب مجموع مشتريات كل عميل).*

---

### 4. ورقة `Settings` (إعدادات الموقع والشحن)
العناوين في الصف الأول:
```text
key	value
```
القيم الافتراضية المقترحة:
```text
siteName	جهزك للتقنية
phone	0672.43.05.32
email	contact@gehazek-tech.dz
topbarText	⚡ هواتف وحواسيب أصلية مع الضمان — توصيل سريع والدفع عند الاستلام
shippingCost	400
freeShippingThreshold	50000
promoTitle	تجهيزات احترافية — هواتف، حواسيب وإكسسوارات
```

---

## ⚡ خطوتان للتفعيل:

1. من القائمة العلوية للجدول: **Extensions ➔ Apps Script**.
2. انسخ الكود من [`backend/google-apps-script.js`](./google-apps-script.js) والصقه.
3. اضغط **Deploy ➔ New deployment ➔ Web app**:
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. انسخ الرابط وضعْه في `backend/.env`:
   ```env
   GOOGLE_SHEET_WEBAPP_URL=https://script.google.com/macros/s/.../exec
   ```
