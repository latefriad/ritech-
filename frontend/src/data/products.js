export const allProducts = [
  { id: 1, name: "تيشيرت Patient Jude", price: 2300, oldPrice: null, discount: null, cat: "clothing", image: null, landingPage: "" },
  { id: 2, name: "هودي Patient Ninja", price: 2900, oldPrice: 3800, discount: "-25%", cat: "hoodie", image: null, landingPage: "" },
  { id: 3, name: "بوستر Flying Ninja", price: 2800, oldPrice: 3400, discount: "-18%", cat: "poster", image: null, landingPage: "" },
  { id: 4, name: "تيشيرت Woo Ninja", price: 3900, oldPrice: 4600, discount: "-15%", cat: "clothing", image: null, landingPage: "" },
  { id: 5, name: "تيشيرت Woo Logo", price: 1900, oldPrice: 2500, discount: "-24%", cat: "clothing", image: null, landingPage: "" },
  { id: 6, name: "ألبوم موسيقي #1", price: 2700, oldPrice: 3000, discount: "-10%", cat: "music", image: null, landingPage: "" },
  { id: 7, name: "سينغل موسيقي #2", price: 2900, oldPrice: 3500, discount: "-17%", cat: "music", image: null, landingPage: "" },
  { id: 8, name: "بوستر Woo Logo", price: 1800, oldPrice: 2200, discount: "-18%", cat: "poster", image: null, landingPage: "" },
  { id: 9, name: "هودي كلاسيك", price: 3200, oldPrice: null, discount: null, cat: "hoodie", image: null, landingPage: "" },
];

export const categories = [
  { id: "clothing", name: "ملابس", icon: "👕", count: 12 },
  { id: "hoodie", name: "هوديات", icon: "🧥", count: 5 },
  { id: "poster", name: "بوسترات", icon: "🖼️", count: 8 },
  { id: "music", name: "موسيقى", icon: "🎵", count: 10 },
  { id: "accessories", name: "إكسسوارات", icon: "💎", count: 6 },
  { id: "offers", name: "عروض خاصة", icon: "🔥", count: 4 },
];

export const slides = [
  {
    id: 1,
    badge: "✨ مجموعة 2026",
    title: "جهزك.. أفضل\nاختياراتك",
    subtitle: "نهدف لمنحك تجربة تسوّق سهلة ومتعة حقيقية",
    buttons: ["تسوّق الآن", "اكتشف المزيد"],
    className: "slide-1",
  },
  {
    id: 2,
    badge: "🔥 عروض محدودة",
    title: "خصومات تصل\nإلى 25%",
    subtitle: "تسوّق بذوق مع خصومات موسمية رائعة",
    buttons: ["العروض الآن", "تواصل معنا"],
    className: "slide-2",
  },
  {
    id: 3,
    badge: "🚚 شحن سريع",
    title: "توصيل لجميع\nالولايات",
    subtitle: "شحن سريع والدفع عند الاستلام لجميع الولايات",
    buttons: ["اطلب الآن", "معرفة المزيد"],
    className: "slide-3",
  },
];

export const filterButtons = [
  { key: "all", label: "الكل" },
  { key: "clothing", label: "ملابس" },
  { key: "music", label: "موسيقى" },
  { key: "poster", label: "ملصقات" },
  { key: "hoodie", label: "هوديات" },
];
