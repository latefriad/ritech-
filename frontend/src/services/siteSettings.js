import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Default site settings
const defaultSettings = {
  // General
  siteName: "جهزك للتقنية",
  siteNameEn: "Gehazek Tech",
  tagline: "وجهتك الأولى للهواتف الذكية، الحواسيب وإكسسواراتها الأصلية",
  logo: "",
  favicon: "",

  // Contact
  phone: "0672.43.05.32",
  email: "contact@gehazek-tech.dz",
  address: "الجزائر العاصمة، الجزائر",

  // Social Media
  facebook: "",
  instagram: "",
  twitter: "",

  // Topbar
  topbarText: "⚡ هواتف وحواسيب أصلية مع الضمان — توصيل سريع والدفع عند الاستلام",
  topbarPhone: "0672.43.05.32",

  // Hero Slides
  slides: [
    {
      id: 1,
      badge: "⚡ أحدث أجهزة 2026",
      title: "أقوى الهواتف والحواسيب\nبأفضل الأسعار",
      subtitle: "أجهزة أصلية مع ضمان شامل، وتوصيل سريع والدفع عند الاستلام لجميع الولايات",
      btn1: "تسوّق الآن",
      btn2: "اكتشف الهواتف",
      gradient: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #030712 100%)",
    },
    {
      id: 2,
      badge: "🔥 عروض حصرية",
      title: "خصومات تصل\nإلى 25% على اللابتوبات",
      subtitle: "تخفيضات كبرى على الحواسيب المحمولة وإكسسوارات الألعاب الاحترافية",
      btn1: "عروض اللابتوب",
      btn2: "تواصل معنا",
      gradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #082f49 100%)",
    },
    {
      id: 3,
      badge: "🚚 توصيل 58 ولاية",
      title: "ضمان حقيقي\nودفع عند الاستلام",
      subtitle: "افحص جهازك قبل الدفع مع سياسة استبدال ميسرة وسريعة لجميع الولايات",
      btn1: "تصفح المتجر",
      btn2: "معرفة المزيد",
      gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #134e4a 100%)",
    },
  ],

  // Promo Banner
  promo: {
    badge: "⚡ عروض الموسم التقنية",
    title: "تجهيزات احترافية — هواتف، حواسيب وإكسسوارات",
    subtitle: "توصيل سريع وآمن لجميع ولايات الجزائر، مع إمكانية الدفع عند الاستلام والضمان",
    btn1: "تسوّق الآن",
    btn2: "تواصل معنا",
  },

  // Footer
  footer: {
    description: "متجر جهزك للتقنية: نوفر لك أحدث الهواتف الذكية، الحواسيب المحمولة، وأفضل الإكسسوارات الأصلية مع ضمان الجودة وأسرع توصيل في الجزائر.",
    copyright: "© 2026 جهزك للتقنية — جميع الحقوق محفوظة",
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
    const res = await fetch("/api/settings");
    if (res.ok) {
      const data = await res.json();
      return { ...defaultSettings, ...data };
    }
  } catch (err) {
    console.warn("Using default settings:", err.message);
  }
  return defaultSettings;
}

export async function updateSiteSettings(settings) {
  try {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to save settings to API/Google Sheets:", err.message);
  }
  return settings;
}

export { defaultSettings };
