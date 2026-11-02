/**
 * =======================================================================
 * Google Apps Script - نظام إدارة المتجر المتكامل عبر Google Sheets
 * المتجر: جهزك للتقنية (Gehazek Tech)
 * 
 * يدعم إدارة 100% من بيانات الموقع:
 * 1. المنتجات والمخزون (Products & Stock)
 * 2. الطلبات وتحديث حالاتها (Orders & Statuses)
 * 3. العملاء وإجمالي المشتريات (Customers & Spending)
 * 4. إعدادات الموقع والشحن (Site Settings & Delivery)
 * =======================================================================
 */

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var action = (e && e.parameter && e.parameter.action) || "products";

  // 1. استرجاع الطلبات (Orders)
  if (action === "orders") {
    var ordersSheet = ss.getSheetByName("Orders");
    if (!ordersSheet) return responseJSON({ orders: [] });
    var data = ordersSheet.getDataRange().getValues();
    if (data.length <= 1) return responseJSON({ orders: [] });
    
    var headers = data[0].map(function(h) { return String(h).trim(); });
    var orders = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var ord = {};
      for (var j = 0; j < headers.length; j++) ord[headers[j]] = row[j];
      orders.push(ord);
    }
    return responseJSON({ orders: orders });
  }

  // 2. استرجاع العملاء (Customers)
  if (action === "customers") {
    var custSheet = ss.getSheetByName("Customers");
    if (!custSheet) return responseJSON({ customers: [] });
    var data = custSheet.getDataRange().getValues();
    if (data.length <= 1) return responseJSON({ customers: [] });

    var headers = data[0].map(function(h) { return String(h).trim(); });
    var customers = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      var cust = {};
      for (var j = 0; j < headers.length; j++) cust[headers[j]] = row[j];
      customers.push(cust);
    }
    return responseJSON({ customers: customers });
  }

  // 3. استرجاع إعدادات المتجر (Settings)
  if (action === "settings") {
    var setSheet = ss.getSheetByName("Settings");
    if (!setSheet) return responseJSON({ settings: {} });
    var data = setSheet.getDataRange().getValues();
    var settings = {};
    for (var i = 1; i < data.length; i++) {
      var key = String(data[i][0]).trim();
      var val = data[i][1];
      if (key) settings[key] = val;
    }
    return responseJSON({ settings: settings });
  }

  // 4. الافتراضي: استرجاع المنتجات والمخزون (Products & Stock)
  var sheet = ss.getSheetByName("Products") || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return responseJSON({ products: [] });

  var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
  var products = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    var prod = {};
    for (var j = 0; j < headers.length; j++) {
      prod[headers[j]] = row[j];
    }
    prod.id = String(prod.id || i);
    prod.price = Number(prod.price) || 0;
    prod.oldPrice = prod.oldprice ? Number(prod.oldprice) : null;
    prod.stock = prod.stock !== undefined && prod.stock !== "" ? Number(prod.stock) : 10;
    prod.minStock = prod.minstock !== undefined && prod.minstock !== "" ? Number(prod.minstock) : 5;
    products.push(prod);
  }

  return responseJSON({ products: products });
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }

    // 1. تحديث كمية المخزون (Update Stock)
    if (body.action === "updateStock") {
      var prodSheet = ss.getSheetByName("Products") || ss.getSheets()[0];
      var data = prodSheet.getDataRange().getValues();
      var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
      var idCol = headers.indexOf("id");
      var stockCol = headers.indexOf("stock");

      if (idCol !== -1 && stockCol !== -1) {
        for (var i = 1; i < data.length; i++) {
          if (String(data[i][idCol]) === String(body.id)) {
            prodSheet.getRange(i + 1, stockCol + 1).setValue(Number(body.stock));
            return responseJSON({ success: true, id: body.id, stock: Number(body.stock) });
          }
        }
      }
      return responseJSON({ success: false, error: "Product not found" });
    }

    // 2. تحديث حالة الطلب (Update Order Status)
    if (body.action === "updateOrderStatus") {
      var ordersSheet = ss.getSheetByName("Orders");
      if (ordersSheet) {
        var data = ordersSheet.getDataRange().getValues();
        var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
        var idCol = headers.indexOf("orderid");
        var statusCol = headers.indexOf("status");
        if (idCol !== -1 && statusCol !== -1) {
          for (var i = 1; i < data.length; i++) {
            if (String(data[i][idCol]) === String(body.id)) {
              ordersSheet.getRange(i + 1, statusCol + 1).setValue(body.status);
              return responseJSON({ success: true, id: body.id, status: body.status });
            }
          }
        }
      }
      return responseJSON({ success: false, error: "Order not found" });
    }

    // 3. تحديث إعدادات الموقع (Update Site Settings)
    if (body.action === "updateSettings") {
      var setSheet = ss.getSheetByName("Settings");
      if (!setSheet) {
        setSheet = ss.insertSheet("Settings");
        setSheet.appendRow(["key", "value"]);
      }
      var existingData = setSheet.getDataRange().getValues();
      var keyMap = {};
      for (var k = 1; k < existingData.length; k++) {
        keyMap[String(existingData[k][0])] = k + 1;
      }
      for (var key in body.settings) {
        var val = body.settings[key];
        if (typeof val === "object") val = JSON.stringify(val);
        if (keyMap[key]) {
          setSheet.getRange(keyMap[key], 2).setValue(val);
        } else {
          setSheet.appendRow([key, val]);
        }
      }
      return responseJSON({ success: true });
    }

    // 4. تسجيل طلب جديد (Create Order)
    var ordersSheet = ss.getSheetByName("Orders");
    if (!ordersSheet) {
      ordersSheet = ss.insertSheet("Orders");
      ordersSheet.appendRow(["orderId", "date", "customerName", "phone", "wilaya", "address", "items", "total", "notes", "status"]);
      ordersSheet.setFrozenRows(1);
    }

    var orderId = body.id || ("ORD-" + new Date().getTime().toString().slice(-6));
    var dateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "GMT+1", "yyyy-MM-dd HH:mm:ss");
    var itemsSummary = Array.isArray(body.items) 
      ? body.items.map(function(it) { return (it.name || it.id) + " (x" + (it.qty || 1) + " - " + (it.price || 0) + " د.ج)"; }).join(" | ")
      : String(body.items || "");

    ordersSheet.appendRow([
      orderId, dateStr, body.name || "", "'" + String(body.phone || ""),
      body.wilaya || "", body.address || "", itemsSummary, Number(body.total) || 0,
      body.notes || "", body.status || "pending"
    ]);

    // إنقاص المخزون تلقائياً في ورقة Products
    var prodSheet = ss.getSheetByName("Products");
    if (prodSheet && Array.isArray(body.items)) {
      var pData = prodSheet.getDataRange().getValues();
      var pHeaders = pData[0].map(function(h) { return String(h).trim().toLowerCase(); });
      var pIdCol = pHeaders.indexOf("id");
      var pStockCol = pHeaders.indexOf("stock");
      if (pIdCol !== -1 && pStockCol !== -1) {
        body.items.forEach(function(orderedItem) {
          for (var r = 1; r < pData.length; r++) {
            if (String(pData[r][pIdCol]) === String(orderedItem.id)) {
              var curStock = Number(pData[r][pStockCol]) || 0;
              var newStock = Math.max(0, curStock - (Number(orderedItem.qty) || 1));
              prodSheet.getRange(r + 1, pStockCol + 1).setValue(newStock);
              break;
            }
          }
        });
      }
    }

    // تسجيل وتحديث بيانات العميل في ورقة Customers
    var custSheet = ss.getSheetByName("Customers");
    if (!custSheet) {
      custSheet = ss.insertSheet("Customers");
      custSheet.appendRow(["name", "phone", "wilaya", "address", "ordersCount", "totalSpent", "lastOrderDate"]);
      custSheet.setFrozenRows(1);
    }
    var cData = custSheet.getDataRange().getValues();
    var customerRow = -1;
    for (var c = 1; c < cData.length; c++) {
      if (String(cData[c][1]).replace(/'/g, "") === String(body.phone).replace(/'/g, "")) {
        customerRow = c + 1;
        break;
      }
    }
    if (customerRow !== -1) {
      var curOrders = Number(cData[customerRow - 1][4]) || 1;
      var curSpent = Number(cData[customerRow - 1][5]) || 0;
      custSheet.getRange(customerRow, 5).setValue(curOrders + 1);
      custSheet.getRange(customerRow, 6).setValue(curSpent + (Number(body.total) || 0));
      custSheet.getRange(customerRow, 7).setValue(dateStr);
    } else {
      custSheet.appendRow([
        body.name || "", "'" + String(body.phone || ""), body.wilaya || "",
        body.address || "", 1, Number(body.total) || 0, dateStr
      ]);
    }

    return responseJSON({ success: true, orderId: orderId });
  } catch (err) {
    return responseJSON({ success: false, error: err.toString() });
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * =======================================================================
 * دالة التهيئة التلقائية - بنقرة واحدة
 * لتعبئة جميع المنتجات، الإعدادات، وجداول الطلبات والعملاء تلقائياً
 * =======================================================================
 */
function initSampleData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. ورقة المنتجات (Products)
  var pSheet = ss.getSheetByName("Products") || ss.getActiveSheet();
  pSheet.setName("Products");
  pSheet.clear();
  pSheet.appendRow(["id", "name", "name_ar", "price", "original_price", "image", "category", "stock", "sku", "rating", "description"]);
  
  var sampleProducts = [
    ["1", "Apple iPhone 16 Pro Max", "Apple iPhone 16 Pro Max (256GB - تيتانيوم صحراوي)", 245000, 265000, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80", "phones", 12, "PH-IP16-PM", 4.9, "أقوى هواتف آبل مع معالج A18 Pro، إطار تيتانيوم من الدرجة 5، شاشة Super Retina XDR مقاس 6.9 إنش"],
    ["2", "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24 Ultra (512GB - رمادي تيتانيوم)", 215000, 235000, "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80", "phones", 12, "PH-SAM-S24U", 4.8, "الهاتف الرائد من سامسونج بقلم S-Pen مدمج، معالج Snapdragon 8 Gen 3 ومزايا الذكاء الاصطناعي Galaxy AI"],
    ["3", "Xiaomi 14 Ultra", "Xiaomi 14 Ultra (512GB / 16GB RAM كاميرا لايكا)", 178000, 195000, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80", "phones", 4, "PH-XIA-14U", 4.7, "وحش التصوير الاحترافي بعدسات Leica الفاخرة ومستشعر 1 إنش كامل، شاشة AMOLED وتردد 120Hz"],
    ["4", "Google Pixel 9 Pro XL", "Google Pixel 9 Pro XL (256GB - أسود أوبسيديان)", 169000, 185000, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80", "phones", 6, "PH-PIX-9P", 4.6, "أذكى هاتف أندرويد مع معالج Google Tensor G4 ومساعد Gemini المتطور، وتجربة كاميرا استثنائية"],
    ["5", "Apple AirPods Pro 2", "سماعات Apple AirPods Pro 2 (USB-C)", 42000, 48000, "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80", "phone-accessories", 22, "ACC-APP-AIRP2", 4.9, "عزل ضوضاء نشط مضاعف، صوت مكاني مخصص مع تتبع ديناميكي للرأس، مقاومة للماء والغبار"],
    ["6", "Anker 737 Power Bank", "باور بانك Anker 737 Power Bank (24,000mAh 140W)", 18500, 22000, "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&auto=format&fit=crop&q=80", "phone-accessories", 15, "ACC-ANK-737", 4.8, "بنك طاقة جبار بقدرة إخراج 140 واط، يشحن اللابتوب والهاتف بنفس الوقت مع شاشة رقمية ذكية"],
    ["7", "Apple 20W USB-C Charger", "شاحن Apple 20W USB-C الأصلي + كابل مضفر", 4900, 6200, "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80", "phone-accessories", 45, "ACC-APP-CH20W", 4.9, "شاحن جداري سريع أصلي من آبل بقدرة 20 واط، يدعم الشحن السريع لجميع أجهزة الآيفون والأجهزة الذكية"],
    ["8", "MagSafe Armor Case", "كفر حماية MagSafe مدرع مع حلقة مغناطيسية", 2800, 3500, "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&auto=format&fit=crop&q=80", "phone-accessories", 35, "ACC-MAG-CASE", 4.5, "حماية عسكرية ضد السقوط والصدمات، حواف بارزة لحماية الكاميرا والشاشة متوافق مع شواحن MagSafe"],
    ["9", "Apple MacBook Pro 14", "Apple MacBook Pro 14 (شريحة M3 Pro - 18GB / 512GB)", 345000, 370000, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80", "computers", 5, "PC-MBP-14M3", 5.0, "الحاسوب المحمول الأفضل للمحترفين والمطورين، شاشة Liquid Retina XDR مبهرة وأداء فائق في الرندر"],
    ["10", "ASUS ROG Zephyrus G16", "لابتوب ألعاب ASUS ROG Zephyrus G16 (RTX 4070 / i9)", 310000, 340000, "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80", "computers", 2, "PC-ASUS-G16", 4.8, "تصميم نحيف بهيكل ألومنيوم مع شاشة OLED 240Hz، بطاقة RTX 4070 8GB ومعالج Intel Core Ultra 9"],
    ["11", "Lenovo ThinkPad X1 Carbon", "لابتوب Lenovo ThinkPad X1 Carbon Gen 12 (Core Ultra 7)", 285000, 310000, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80", "computers", 3, "PC-LEN-X1C", 4.9, "لابتوب الأعمال الأول عالمياً بوزن خفيف للغاية من ألياف الكربون، لوحة مفاتيح مريحة وأعلى معايير الأمان"],
    ["12", "Keychron Q1 Pro", "كيبورد ميكانيكي مخصص Keychron Q1 Pro اللاسلكي", 29500, 34000, "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80", "pc-accessories", 14, "ACC-KEY-Q1P", 4.7, "هيكل ألومنيوم CNC صلب مع تصميم Gasket Mount وسويتشات قابلة للتبديل Hot-swappable"],
    ["13", "Logitech MX Master 3S", "ماوس احترافي للإنتاجية Logitech MX Master 3S", 19800, 23500, "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80", "pc-accessories", 19, "ACC-LOG-MX3S", 4.9, "الماوس المريح الأكثر شهرة، نقرات هادئة بنسبة 90%، وعجلة تمرير كهرومغناطيسية MagSpeed فائقة السرعة"],
    ["14", "LG UltraGear 27 OLED", "شاشة ألعاب LG UltraGear 27GR95QE-B OLED 240Hz", 142000, 158000, "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80", "pc-accessories", 0, "ACC-LG-27OLED", 4.9, "شاشة ألعاب أوليد 27 بوصة بدقة QHD، وقت استجابة قياسي 0.03ms وألوان حقيقية مذهلة"],
    ["15", "Samsung 990 Pro 2TB", "قرص تخزين Samsung 990 Pro 2TB NVMe PCIe 4.0", 28000, 33000, "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80", "pc-accessories", 25, "ACC-SAM-990P", 4.9, "سرعات قراءة تصل إلى 7450 ميجابايت/ثانية وكتابة 6900 ميجابايت/ثانية لتسريع الألعاب وبرامج المونتاج"],
    ["16", "HyperX Cloud Alpha Wireless", "سماعة ألعاب احترافية HyperX Cloud Alpha Wireless", 26500, 30000, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80", "pc-accessories", 9, "ACC-HYP-CLDW", 4.8, "بطارية أسطورية تدوم حتى 300 ساعة بشحنة واحدة وصوت محيطي DTS Headphone:X Spatial Audio"]
  ];
  
  for (var i = 0; i < sampleProducts.length; i++) {
    pSheet.appendRow(sampleProducts[i]);
  }
  pSheet.setFrozenRows(1);

  // 2. ورقة الطلبات (Orders)
  var oSheet = ss.getSheetByName("Orders") || ss.insertSheet("Orders");
  if (oSheet.getLastRow() === 0) {
    oSheet.appendRow(["orderId", "date", "customerName", "phone", "wilaya", "address", "items", "total", "notes", "status"]);
    oSheet.setFrozenRows(1);
  }

  // 3. ورقة العملاء (Customers)
  var cSheet = ss.getSheetByName("Customers") || ss.insertSheet("Customers");
  if (cSheet.getLastRow() === 0) {
    cSheet.appendRow(["name", "phone", "wilaya", "address", "ordersCount", "totalSpent", "lastOrderDate"]);
    cSheet.setFrozenRows(1);
  }

  // 4. ورقة الإعدادات (Settings)
  var sSheet = ss.getSheetByName("Settings") || ss.insertSheet("Settings");
  sSheet.clear();
  sSheet.appendRow(["key", "value"]);
  sSheet.appendRow(["siteName", "Gehazek Tech | جهزك للتقنية"]);
  sSheet.appendRow(["phone", "0555123456"]);
  sSheet.appendRow(["shippingPrice", "600"]);
  sSheet.appendRow(["freeShippingThreshold", "150000"]);
  sSheet.appendRow(["currency", "د.ج"]);
  sSheet.setFrozenRows(1);

  Logger.log("Done! All sheets initialized successfully.");
}
