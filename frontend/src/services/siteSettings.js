import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Default site settings
const defaultSettings = {
  // General
  siteName: "جهزك",
  siteNameEn: "Gehazek",
  tagline: "نهدف لمنحك تجربة تسوّق سهلة ومتعة حقيقية",
  logo: "",
  favicon: "",

  // Contact
  phone: "0672.43.05.32",
  email: "info@gehazek.dz",
  address: "الجزائر",

  // Social Media
  facebook: "",
  instagram: "",
  twitter: "",

  // Topbar
  topbarText: "🚚 توصيل لجميع الولايات — الدفع عند الاستلام",
  topbarPhone: "0672.43.05.32",

  // Hero Slides
  slides: [
    {
      id: 1,
      badge: "✨ مجموعة 2026",
      title: "جهزك.. أفضل\nاختياراتك",
      subtitle: "نهدف لمنحك تجربة تسوّق سهلة ومتعة حقيقية",
      btn1: "تسوّق الآن",
      btn2: "اكتشف المزيد",
      gradient: "linear-gradient(135deg, #453ec1 0%, #1a1460 60%, #0d0b3a 100%)",
    },
    {
      id: 2,
      badge: "🔥 عروض محدودة",
      title: "خصومات تصل\nإلى 25%",
      subtitle: "تسوّق بذوق مع خصومات موسمية رائعة",
      btn1: "العروض الآن",
      btn2: "تواصل معنا",
      gradient: "linear-gradient(135deg, #e24b4a 0%, #8b1e1e 60%, #3a0808 100%)",
    },
    {
      id: 3,
      badge: "🚚 شحن سريع",
      title: "توصيل لجميع\nالولايات",
      subtitle: "شحن سريع والدفع عند الاستلام لجميع الولايات",
      btn1: "اطلب الآن",
      btn2: "معرفة المزيد",
      gradient: "linear-gradient(135deg, #1a9e75 0%, #0a5c45 60%, #042e22 100%)",
    },
  ],

  // Promo Banner
  promo: {
    badge: "✨ عروض هذا الأسبوع",
    title: "تسوّق بذوق — خصومات موسمية",
    subtitle: "شحن سريع لجميع الولايات، والدفع عند الاستلام",
    btn1: "تسوّق الآن",
    btn2: "تواصل معنا",
  },

  // Footer
  footer: {
    description: "نهدف لمنحك تجربة تسوّق سهلة وممتعة مع أفضل المنتجات وأسرع التوصيل لجميع ولايات الجزائر.",
    copyright: "© 2026 جهزك — جميع الحقوق محفوظة",
  },

  // Shipping
  shipping: {
    freeShippingThreshold: 5000,
    shippingCost: 400,
    deliveryDays: "2-5 أيام عمل",
  },

  // Appearance
  primaryColor: "#453ec1",
  fontFamily: "Cairo",

  // Analytics Pixels
  facebookPixelId: "",
  tiktokPixelId: "",
  googleAnalyticsId: "",
};

export async function getSiteSettings() {
  try {
    const docRef = doc(db, "settings", "site");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultSettings, ...docSnap.data() };
    }
    return defaultSettings;
  } catch (err) {
    console.warn("Failed to load settings, using defaults:", err.message);
    return defaultSettings;
  }
}

export async function updateSiteSettings(settings) {
  try {
    const docRef = doc(db, "settings", "site");
    await setDoc(docRef, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Failed to save settings:", err.message);
    throw err;
  }
}

export { defaultSettings };
