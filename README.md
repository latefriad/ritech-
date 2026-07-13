# جهزك — متجر إلكتروني

متجر إلكتروني عربي RTL مبني بـ React + Express + Firebase

## التقنيات

**Frontend:** React 19, Vite 8, Tailwind CSS 4, React Router 7  
**Backend:** Node.js, Express 5, Firebase Admin SDK  
**Database:** Firebase Firestore  
**Auth:** Firebase Authentication

---

## إعداد Firebase

### 1. إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروع جديد باسم `nesrine-collection`
3. أضف تطبيق Web جديد

### 2. تفعيل الخدمات

- **Firestore:** أنشئ قاعدة بيانات Firestore (ابدأوضع التجربة)
- **Authentication:** فعّل تسجيل الدخول بالبريد/كلمة المرور

### 3. نسخ البيانات

From Firebase Console → Project Settings → General → Your apps → Web app:

```
apiKey: "..."
authDomain: "..."
projectId: "..."
storageBucket: "..."
messagingSenderId: "..."
appId: "..."
```

### 4. إعداد Frontend

عدّل `frontend/.env`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000/api
```

### 5. إعداد Backend

1. من Firebase Console → Service Accounts → Generate new private key
2. احفظ الملف كـ `backend/serviceAccountKey.json`
3. عدّل `backend/.env`:

```
PORT=5000
NODE_ENV=development
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
CORS_ORIGIN=http://localhost:5173
```

### 6. ت Seed البيانات

```bash
cd backend
npm run seed
```

هذا يُنشئ المنتجات والتصنيفات في Firestore.

---

## التشغيل المحلي

### Backend

```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## هيكل المشروع

```
saas ecoomerce/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/        (HeroSlider, CategoriesSection, PromoBanner)
│   │   │   ├── layout/      (Header, Footer, Navbar, MobileMenu, Layout, ScrollToTop)
│   │   │   ├── products/    (ProductCard, FiltersBar, Pagination, ProductImage)
│   │   │   └── ui/          (LoadingSkeleton)
│   │   ├── context/         (Cart, Wishlist, Toast, Auth)
│   │   ├── hooks/           (useProducts)
│   │   ├── pages/           (Home, Shop, ProductPage, Cart, Wishlist, Checkout, Login, Register, Shipping, Payment, About, Contact, Terms, Privacy, ReturnPolicy, NotFound)
│   │   ├── services/        (api.js, firebase.js)
│   │   └── data/            (products.js)
│   └── .env
├── backend/
│   ├── src/
│   │   ├── config/          (firebase.js)
│   │   ├── controllers/     (product, order, user)
│   │   ├── middleware/       (auth.js)
│   │   └── routes/          (products, orders, users)
│   ├── scripts/seed.js
│   ├── serviceAccountKey.json  (NOT in git)
│   └── .env
```

---

## الصفحات

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | Slider + تصنيفات + منتجات مميزة + بانر |
| المتجر | `/shop` | جميع المنتجات مع فلترة وترتيب |
| منتج | `/product/:id` | تفاصيل المنتج |
| السلة | `/cart` | إدارة السلة |
| المفضلة | `/wishlist` | المنتجات المفضلة |
| الدفع | `/checkout` | إتمام الطلب |
| تسجيل الدخول | `/login` | تسجيل الدخول |
| إنشاء حساب | `/register` | تسجيل حساب جديد |
| الشحن | `/shipping` | معلومات الشحن |
| الدفع | `/payment` | طرق الدفع |
| عن المتجر | `/about` | معلومات المتجر |
| تواصل معنا | `/contact` | نموذج تواصل |
| الشروط | `/terms` | شروط الاستخدام |
| الخصوصية | `/privacy` | سياسة الخصوصية |
| الاستبدال | `/return-policy` | سياسة الاستبدال |

---

## نشر التطبيق

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend → Render

```bash
cd backend
# Render auto-detects Node.js
# Set environment variables in Render dashboard
```

---

## ملاحظات

- السلة والمفضلة تُحفظ في localStorage
- الـ API يتحدث مع Express backend مع Firebase Firestore
- إذا لم يعمل الـ API، يستخدم بيانات ثابتة كـ fallback
- جميع الأسعار بالدينار الجزائري (د.ج)
