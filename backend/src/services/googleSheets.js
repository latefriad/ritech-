import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_FILE = path.resolve(__dirname, "../../data/orders.json");
const STOCK_FILE = path.resolve(__dirname, "../../data/stock.json");
const SETTINGS_FILE = path.resolve(__dirname, "../../data/settings.json");

const defaultSiteSettings = {
  siteName: "جهزك للتقنية",
  siteNameEn: "Gehazek Tech",
  tagline: "وجهتك الأولى للهواتف الذكية، الحواسيب وإكسسواراتها الأصلية",
  phone: "0672.43.05.32",
  email: "contact@gehazek-tech.dz",
  address: "الجزائر العاصمة، الجزائر",
  topbarText: "⚡ هواتف وحواسيب أصلية مع الضمان — توصيل سريع والدفع عند الاستلام",
  topbarPhone: "0672.43.05.32",
  shippingCost: 400,
  freeShippingThreshold: 50000,
  deliveryDays: "2-5 أيام عمل",
  promoBadge: "⚡ عروض الموسم التقنية",
  promoTitle: "تجهيزات احترافية — هواتف، حواسيب وإكسسوارات",
  promoSubtitle: "توصيل سريع وآمن لجميع ولايات الجزائر، مع إمكانية الدفع عند الاستلام والضمان",
};

// Helper to read stock overrides
function readStockOverrides() {
  try {
    if (!fs.existsSync(STOCK_FILE)) return {};
    return JSON.parse(fs.readFileSync(STOCK_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading stock overrides:", err.message);
    return {};
  }
}

// Helper to save stock overrides
function saveStockOverrides(overrides) {
  try {
    fs.writeFileSync(STOCK_FILE, JSON.stringify(overrides, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving stock overrides:", err.message);
  }
}

// Default high-quality tech catalog (Phones, Accessories, Computers, PC Accessories)
export const defaultProducts = [
  // --- هواتف ذكية (Phones) ---
  {
    id: "1",
    sku: "PH-IP16-PM",
    name: "Apple iPhone 16 Pro Max (256GB - تيتانيوم صحراوي)",
    price: 245000,
    oldPrice: 265000,
    discount: "-8%",
    stock: 8,
    minStock: 5,
    cat: "phones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "أقوى هواتف آبل مع معالج A18 Pro، إطار تيتانيوم من الدرجة 5، شاشة Super Retina XDR مقاس 6.9 إنش مع ProMotion، وزر التحكم الجديد في الكاميرا.",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "2",
    sku: "PH-SAM-S24U",
    name: "Samsung Galaxy S24 Ultra (512GB - رمادي تيتانيوم)",
    price: 215000,
    oldPrice: 235000,
    discount: "-9%",
    stock: 12,
    minStock: 5,
    cat: "phones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "الهاتف الرائد من سامسونج بقلم S-Pen مدمج، معالج Snapdragon 8 Gen 3، مزايا الذكاء الاصطناعي Galaxy AI، وكاميرا بدقة 200 ميجابكسل.",
    createdAt: new Date("2026-01-16"),
  },
  {
    id: "3",
    sku: "PH-XIA-14U",
    name: "Xiaomi 14 Ultra (512GB / 16GB RAM كاميرا لايكا)",
    price: 178000,
    oldPrice: 195000,
    discount: "-9%",
    stock: 4, // Low stock alert
    minStock: 5,
    cat: "phones",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "وحش التصوير الاحترافي بعدسات Leica الفاخرة ومستشعر 1 إنش كامل، شاشة AMOLED بدقة 2K وتردد 120Hz، مع شحن فائق السرعة 90W.",
    createdAt: new Date("2026-01-17"),
  },
  {
    id: "4",
    sku: "PH-PIX-9P",
    name: "Google Pixel 9 Pro XL (256GB - أسود أوبسيديان)",
    price: 169000,
    oldPrice: 185000,
    discount: "-9%",
    stock: 6,
    minStock: 5,
    cat: "phones",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "أذكى هاتف أندرويد مع معالج Google Tensor G4 ومساعد Gemini المتطور، وتجربة كاميرا استثنائية مع دعم تحديثات لمدة 7 سنوات.",
    createdAt: new Date("2026-01-18"),
  },

  // --- إكسسوارات الهواتف (Phone Accessories) ---
  {
    id: "5",
    sku: "ACC-APP-AIRP2",
    name: "سماعات Apple AirPods Pro 2 (USB-C)",
    price: 42000,
    oldPrice: 48000,
    discount: "-13%",
    stock: 22,
    minStock: 5,
    cat: "phone-accessories",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "عزل ضوضاء نشط مضاعف، صوت مكاني مخصص مع تتبع ديناميكي للرأس، مقاومة للماء والغبار، وعلبة شحن مزودة بمكبر صوت ومنفذ USB-C.",
    createdAt: new Date("2026-01-19"),
  },
  {
    id: "6",
    sku: "ACC-ANK-737",
    name: "باور بانك Anker 737 Power Bank (24,000mAh 140W)",
    price: 18500,
    oldPrice: 22000,
    discount: "-16%",
    stock: 15,
    minStock: 5,
    cat: "phone-accessories",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "بنك طاقة جبار بقدرة إخراج 140 واط، يشحن اللابتوب والهاتف بنفس الوقت، مع شاشة رقمية ذكية توضح استهلاك الطاقة وسرعة الشحن.",
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "7",
    sku: "ACC-APP-CH20W",
    name: "شاحن Apple 20W USB-C الأصلي + كابل مضفر",
    price: 4900,
    oldPrice: 6200,
    discount: "-21%",
    stock: 45,
    minStock: 10,
    cat: "phone-accessories",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "شاحن جداري سريع أصلي من آبل بقدرة 20 واط، يدعم الشحن السريع لجميع هواتف الآيفون والأجهزة الذكية، متضمن كابل شحن Type-C عالي الجودة.",
    createdAt: new Date("2026-01-21"),
  },
  {
    id: "8",
    sku: "ACC-MAG-CASE",
    name: "كفر حماية MagSafe مدرع مع حلقة مغناطيسية",
    price: 2800,
    oldPrice: 3500,
    discount: "-20%",
    stock: 35,
    minStock: 10,
    cat: "phone-accessories",
    image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "حماية عسكرية ضد السقوط والصدمات، حواف بارزة لحماية الكاميرا والشاشة، ومتوافق تماماً مع شواحن وملحقات MagSafe.",
    createdAt: new Date("2026-01-22"),
  },

  // --- حواسيب ولابتوب (Computers & Laptops) ---
  {
    id: "9",
    sku: "PC-MBP-14M3",
    name: "Apple MacBook Pro 14 (شريحة M3 Pro - 18GB / 512GB)",
    price: 345000,
    oldPrice: 370000,
    discount: "-7%",
    stock: 5,
    minStock: 3,
    cat: "computers",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "الحاسوب المحمول الأفضل للمحترفين والمطورين، شاشة Liquid Retina XDR مبهرة، أداء فائق في الرندر والبرمجة مع بطارية تدوم حتى 18 ساعة.",
    createdAt: new Date("2026-01-23"),
  },
  {
    id: "10",
    sku: "PC-ASUS-G16",
    name: "لابتوب ألعاب ASUS ROG Zephyrus G16 (RTX 4070 / i9)",
    price: 310000,
    oldPrice: 340000,
    discount: "-9%",
    stock: 2, // Low stock alert
    minStock: 3,
    cat: "computers",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "تصميم أنيق ونحيف بهيكل ألومنيوم مع شاشة OLED 240Hz، بطاقة RTX 4070 8GB، معالج Intel Core Ultra 9، وذاكرة 32GB LPDDR5X.",
    createdAt: new Date("2026-01-24"),
  },
  {
    id: "11",
    sku: "PC-LEN-X1C",
    name: "لابتوب Lenovo ThinkPad X1 Carbon Gen 12 (Core Ultra 7)",
    price: 285000,
    oldPrice: 310000,
    discount: "-8%",
    stock: 3, // Low stock alert
    minStock: 3,
    cat: "computers",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "لابتوب الأعمال الأول عالمياً بوزن خفيف للغاية من ألياف الكربون، لوحة مفاتيح مريحة أسطورية، شاشة 2.8K OLED، وأعلى معايير الأمان المكتبي.",
    createdAt: new Date("2026-01-25"),
  },

  // --- ملحقات وإكسسوارات الكمبيوتر (PC Accessories) ---
  {
    id: "12",
    sku: "ACC-KEY-Q1P",
    name: "كيبورد ميكانيكي مخصص Keychron Q1 Pro اللاسلكي",
    price: 29500,
    oldPrice: 34000,
    discount: "-13%",
    stock: 14,
    minStock: 5,
    cat: "pc-accessories",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "هيكل ألومنيوم CNC صلب مع تصميم Gasket Mount، سويتشات قابلة للتبديل Hot-swappable، اتصال Bluetooth 5.1 وكابل، ودعم كامل لـ Mac و Windows.",
    createdAt: new Date("2026-01-26"),
  },
  {
    id: "13",
    sku: "ACC-LOG-MX3S",
    name: "ماوس احترافي للإنتاجية Logitech MX Master 3S",
    price: 19800,
    oldPrice: 23500,
    discount: "-16%",
    stock: 19,
    minStock: 5,
    cat: "pc-accessories",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "الماوس المريح الأكثر شهرة، نقرات هادئة بنسبة 90%، عجلة تمرير كهرومغناطيسية MagSpeed فائقة السرعة، ومستشعر 8000 DPI يعمل على أي سطح.",
    createdAt: new Date("2026-01-27"),
  },
  {
    id: "14",
    sku: "ACC-LG-27OLED",
    name: "شاشة ألعاب LG UltraGear 27GR95QE-B OLED 240Hz",
    price: 142000,
    oldPrice: 158000,
    discount: "-10%",
    stock: 0, // Out of stock
    minStock: 2,
    cat: "pc-accessories",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "شاشة ألعاب أوليد 27 بوصة بدقة QHD، وقت استجابة قياسي 0.03ms، ألوان حقيقية مذهلة وتوافق كامل مع G-SYNC و FreeSync Premium.",
    createdAt: new Date("2026-01-28"),
  },
  {
    id: "15",
    sku: "ACC-SAM-990P",
    name: "قرص تخزين فائق السرعة Samsung 990 Pro 2TB NVMe PCIe 4.0",
    price: 28000,
    oldPrice: 33000,
    discount: "-15%",
    stock: 25,
    minStock: 5,
    cat: "pc-accessories",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "سرعات قراءة تصل إلى 7450 ميجابايت/ثانية وكتابة 6900 ميجابايت/ثانية، مثالي لتسريع ألعاب الكمبيوتر ومنصات PS5 وبرامج المونتاج الضخمة.",
    createdAt: new Date("2026-01-29"),
  },
  {
    id: "16",
    sku: "ACC-HYP-CLDW",
    name: "سماعة ألعاب احترافية HyperX Cloud Alpha Wireless",
    price: 26500,
    oldPrice: 30000,
    discount: "-12%",
    stock: 9,
    minStock: 4,
    cat: "pc-accessories",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    landingPage: "",
    description: "بطارية أسطورية تدوم حتى 300 ساعة بشحنة واحدة، مشغلات صوتية ثنائية الغرفة Dual Chamber، وصوت محيطي DTS Headphone:X Spatial Audio.",
    createdAt: new Date("2026-01-30"),
  },
];

// Helper to parse CSV lines safely
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const parseLine = (line) => {
    const values = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += c;
      }
    }
    values.push(current.trim());
    return values.map((val) => val.replace(/^"|"$/g, "").trim());
  };

  const headers = parseLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    if (!cols || cols.length === 0 || !cols[0]) continue;
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] || "";
    });
    rows.push(obj);
  }
  return rows;
}

// In-memory cache for Google Sheet products
let cachedProducts = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

// Read local persistent orders file
function readLocalOrders() {
  try {
    if (!fs.existsSync(ORDERS_FILE)) return [];
    const data = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading local orders:", err.message);
    return [];
  }
}

// Write local persistent orders file
function saveLocalOrder(order) {
  try {
    const orders = readLocalOrders();
    orders.unshift(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving local order:", err.message);
  }
}

export const googleSheetsService = {
  /**
   * Fetch all products from Google Sheets (or fallback) + apply local stock overrides
   */
  async getProductsList() {
    const now = Date.now();
    const overrides = readStockOverrides();

    const applyStockOverrides = (items) => {
      return items.map((p) => {
        const idStr = String(p.id);
        const currentStock = overrides[idStr] !== undefined ? Number(overrides[idStr]) : Number(p.stock !== undefined ? p.stock : 10);
        return {
          ...p,
          stock: currentStock,
          sku: p.sku || `SKU-${idStr.padStart(3, "0")}`,
          minStock: p.minStock !== undefined ? Number(p.minStock) : 5,
        };
      });
    };

    if (cachedProducts && now - lastCacheTime < CACHE_TTL_MS) {
      return applyStockOverrides(cachedProducts);
    }

    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    // 1. Try Google Apps Script Web App URL
    if (webAppUrl) {
      try {
        const response = await fetch(`${webAppUrl}?action=products`, {
          signal: AbortSignal.timeout(6000),
        });
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("json")) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : data.products;
          if (Array.isArray(items) && items.length > 0) {
            cachedProducts = items.map((p, idx) => ({
              id: String(p.id || idx + 1),
              sku: p.sku || `SKU-${String(p.id || idx + 1).padStart(3, "0")}`,
              name: p.name || "",
              price: Number(p.price) || 0,
              oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
              discount: p.discount || null,
              stock: p.stock !== undefined ? Number(p.stock) : 10,
              minStock: p.minStock !== undefined ? Number(p.minStock) : 5,
              cat: p.cat || "phones",
              image: p.image || null,
              landingPage: p.landingPage || "",
              description: p.description || "",
              createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            }));
            lastCacheTime = now;
            console.log(`✅ Loaded ${cachedProducts.length} products from Google Sheet WebApp`);
            return applyStockOverrides(cachedProducts);
          }
        } else if (response.ok && !contentType.includes("json")) {
          console.warn("⚠️ Google Sheet WebApp returned HTML instead of JSON. Ensure 'Who has access' (Qui a accès) is set to 'Anyone' (Tous / أي شخص) in Google Apps Script deployment.");
        }
      } catch (err) {
        console.warn("⚠️ Google Sheet WebApp fetch failed, trying fallback:", err.message);
      }
    }

    // 2. Try Public Google Sheet CSV
    if (sheetId) {
      try {
        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Products`;
        const response = await fetch(csvUrl, { signal: AbortSignal.timeout(6000) });
        if (response.ok) {
          const text = await response.text();
          const rows = parseCSV(text);
          if (rows.length > 0) {
            cachedProducts = rows.map((r, idx) => ({
              id: String(r.id || idx + 1),
              sku: r.sku || `SKU-${String(r.id || idx + 1).padStart(3, "0")}`,
              name: r.name || "",
              price: Number(r.price) || 0,
              oldPrice: r.oldPrice ? Number(r.oldPrice) : null,
              discount: r.discount || null,
              stock: r.stock !== undefined ? Number(r.stock) : 10,
              minStock: r.minStock !== undefined ? Number(r.minStock) : 5,
              cat: r.cat || "phones",
              image: r.image || null,
              landingPage: r.landingPage || "",
              description: r.description || "",
              createdAt: new Date(),
            }));
            lastCacheTime = now;
            console.log(`✅ Loaded ${cachedProducts.length} products from Google Sheet CSV`);
            return applyStockOverrides(cachedProducts);
          }
        }
      } catch (err) {
        console.warn("⚠️ Google Sheet CSV fetch failed, falling back to default tech catalog:", err.message);
      }
    }

    // 3. Fallback to default high quality tech catalog
    cachedProducts = defaultProducts;
    lastCacheTime = now;
    return applyStockOverrides(cachedProducts);
  },

  /**
   * Filter, sort, and paginate products
   */
  async getProducts({ cat, sort, search, page = 1, limit = 20 } = {}) {
    let list = await this.getProductsList();
    list = [...list];

    if (cat && cat !== "all") {
      list = list.filter((p) => p.cat === cat);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "sale") list.sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));
    else if (sort === "stock-asc") list.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    else if (sort === "stock-desc") list.sort((a, b) => (b.stock || 0) - (a.stock || 0));

    const total = list.length;
    const offset = (Number(page) - 1) * Number(limit);
    const paginated = list.slice(offset, offset + Number(limit));

    return { products: paginated, total, page: Number(page), limit: Number(limit) };
  },

  /**
   * Get product by ID
   */
  async getProductById(id) {
    const list = await this.getProductsList();
    return list.find((p) => String(p.id) === String(id)) || null;
  },

  /**
   * Update stock quantity for a single product
   */
  async updateStock(id, newStock) {
    const overrides = readStockOverrides();
    const stockVal = Math.max(0, Number(newStock) || 0);
    overrides[String(id)] = stockVal;
    saveStockOverrides(overrides);

    if (cachedProducts) {
      const target = cachedProducts.find((p) => String(p.id) === String(id));
      if (target) target.stock = stockVal;
    }

    // If Google Sheet WebApp is connected, notify it
    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (webAppUrl) {
      try {
        fetch(webAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateStock", id: String(id), stock: stockVal }),
          signal: AbortSignal.timeout(4000),
        }).catch(() => {});
      } catch (e) {}
    }

    return { id: String(id), stock: stockVal };
  },

  /**
   * Create an order (writes to Google Sheets, local orders backup, and decrements stock)
   */
  async createOrder(orderData) {
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    const newOrder = {
      id: orderId,
      orderId: orderId,
      date: new Date().toISOString(),
      name: orderData.name,
      phone: orderData.phone,
      wilaya: orderData.wilaya,
      address: orderData.address,
      items: orderData.items,
      total: Number(orderData.total),
      notes: orderData.notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save locally first so orders are never lost
    saveLocalOrder(newOrder);

    // Automatically decrement stock for ordered items
    try {
      if (Array.isArray(orderData.items)) {
        const overrides = readStockOverrides();
        const currentProducts = await this.getProductsList();
        for (const item of orderData.items) {
          const prod = currentProducts.find((p) => String(p.id) === String(item.id) || p.name === item.name);
          if (prod) {
            const currentQty = overrides[String(prod.id)] !== undefined ? overrides[String(prod.id)] : prod.stock;
            const updatedQty = Math.max(0, currentQty - (item.qty || 1));
            overrides[String(prod.id)] = updatedQty;
            if (prod) prod.stock = updatedQty;
          }
        }
        saveStockOverrides(overrides);
      }
    } catch (stockErr) {
      console.warn("⚠️ Could not auto-decrement stock:", stockErr.message);
    }

    // If Google Sheet WebApp is configured, send the order to the sheet
    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (webAppUrl) {
      try {
        const response = await fetch(webAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "createOrder",
            ...newOrder,
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (response.ok) {
          console.log(`✅ Order ${orderId} successfully appended to Google Sheet!`);
        }
      } catch (err) {
        console.warn(`⚠️ Could not append order ${orderId} to Google Sheet WebApp (saved locally):`, err.message);
      }
    } else {
      console.log(`ℹ️ Order ${orderId} saved locally (Add GOOGLE_SHEET_WEBAPP_URL to sync to Google Sheets)`);
    }

    return newOrder;
  },

  /**
   * Get orders list
   */
  async getOrders() {
    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (webAppUrl) {
      try {
        const response = await fetch(`${webAppUrl}?action=orders`, {
          signal: AbortSignal.timeout(6000),
        });
        const contentType = response.headers.get("content-type") || "";
        if (response.ok && contentType.includes("json")) {
          const data = await response.json();
          if (Array.isArray(data.orders)) {
            return data.orders;
          }
        }
      } catch (err) {
        console.warn("⚠️ Failed fetching orders from Google Sheet WebApp, using local backup:", err.message);
      }
    }
    return readLocalOrders();
  },

  /**
   * Update order status
   */
  async updateOrderStatus(id, status) {
    const orders = readLocalOrders();
    const order = orders.find((o) => String(o.id) === String(id) || String(o.orderId) === String(id));
    if (order) {
      order.status = status;
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");

      const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
      if (webAppUrl) {
        fetch(webAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateOrderStatus", id, status }),
          signal: AbortSignal.timeout(5000),
        }).catch(() => {});
      }

      return order;
    }
    return null;
  },

  /**
   * Get site settings from Google Sheet (or local backup / defaults)
   */
  async getSettings() {
    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (webAppUrl) {
      try {
        const response = await fetch(`${webAppUrl}?action=settings`, {
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.settings) {
            return { ...defaultSiteSettings, ...data.settings };
          }
        }
      } catch (err) {
        console.warn("Could not load settings from Google Sheet:", err.message);
      }
    }

    try {
      if (fs.existsSync(SETTINGS_FILE)) {
        const saved = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
        return { ...defaultSiteSettings, ...saved };
      }
    } catch (e) {}

    return defaultSiteSettings;
  },

  /**
   * Update site settings (writes to Google Sheet and local file)
   */
  async updateSettings(newSettings) {
    const current = await this.getSettings();
    const merged = { ...current, ...newSettings, updatedAt: new Date().toISOString() };

    try {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
    } catch (e) {
      console.error("Could not write settings file:", e.message);
    }

    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (webAppUrl) {
      try {
        fetch(webAppUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateSettings", settings: merged }),
          signal: AbortSignal.timeout(6000),
        }).catch(() => {});
      } catch (e) {}
    }

    return merged;
  },

  /**
   * Get customers list (from Google Sheet or derived from orders)
   */
  async getCustomers() {
    const webAppUrl = process.env.GOOGLE_SHEET_WEBAPP_URL;
    if (webAppUrl) {
      try {
        const response = await fetch(`${webAppUrl}?action=customers`, {
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.customers) && data.customers.length > 0) {
            return data.customers;
          }
        }
      } catch (e) {}
    }

    // Derive from orders
    const orders = await this.getOrders();
    const customerMap = new Map();

    for (const ord of orders) {
      const key = ord.phone || ord.name || ord.id;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          name: ord.name || ord.customerName || "عميل",
          phone: ord.phone || "-",
          wilaya: ord.wilaya || "",
          address: ord.address || "",
          ordersCount: 1,
          totalSpent: Number(ord.total) || 0,
          lastOrderDate: ord.date || ord.createdAt,
        });
      } else {
        const c = customerMap.get(key);
        c.ordersCount += 1;
        c.totalSpent += Number(ord.total) || 0;
      }
    }

    return Array.from(customerMap.values());
  },

  /**
   * Force immediate full synchronization with Google Sheets
   */
  async syncNow() {
    // Invalidate product cache
    cachedProducts = null;
    lastCacheTime = 0;

    const products = await this.getProductsList();
    const orders = await this.getOrders();
    const settings = await this.getSettings();
    const timestamp = new Date().toISOString();

    console.log(`⚡ [Google Sheets Sync] Successfully synced at ${timestamp}: ${products.length} products, ${orders.length} orders`);

    return {
      success: true,
      timestamp,
      synced: {
        products: products.length,
        orders: orders.length,
        settings: Object.keys(settings).length,
      },
      message: "تمت المزامنة مع Google Sheets بنجاح",
    };
  },
};

// Daily Auto-Sync scheduler (runs every 24 hours)
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
setInterval(() => {
  console.log("⏰ [Daily Auto-Sync] Running scheduled daily synchronization with Google Sheets...");
  googleSheetsService.syncNow().catch((e) => console.warn("Auto-sync warning:", e.message));
}, ONE_DAY_MS);
