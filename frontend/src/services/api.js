const API_URL = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function getProducts({ cat, sort, search, page, limit } = {}) {
  const params = new URLSearchParams();
  if (cat && cat !== "all") params.set("cat", cat);
  if (sort && sort !== "default") params.set("sort", sort);
  if (search) params.set("search", search);
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  const query = params.toString();
  return request(`/products${query ? `?${query}` : ""}`);
}

export async function getProductById(id) {
  return request(`/products/${id}`);
}

export async function createOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function getOrderById(id) {
  return request(`/orders/${id}`);
}

export async function getOrders() {
  return request("/orders");
}

export async function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function updateStock(id, stock) {
  return request(`/products/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({ stock: Number(stock) }),
  });
}

export async function syncGoogleSheets() {
  return request("/sync", {
    method: "POST",
  });
}

export async function getUserProfile(uid) {
  return request(`/users/${uid}`);
}

export async function updateUserProfile(uid, data) {
  return request(`/users/${uid}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
