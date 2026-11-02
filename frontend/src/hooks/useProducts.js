import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/api";
import { allProducts } from "../data/products";

function getStaticFallback({ cat, sort, search, page, limit }) {
  let list = [...allProducts];

  if (cat && cat !== "all") {
    list = list.filter((p) => p.cat === cat);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter((p) => (p.name || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
  }
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (sort === "sale")
    list.sort((a, b) => (b.discount ? 1 : 0) - (a.discount ? 1 : 0));

  const total = list.length;
  const p = Number(page) || 1;
  const l = Number(limit) || 20;
  return { products: list.slice((p - 1) * l, p * l), total };
}

export default function useProducts({ cat, sort, search, page, limit } = {}) {
  const [state, setState] = useState(() => ({
    products: [],
    total: 0,
    loading: true,
    error: null,
  }));

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getProducts({ cat, sort, search, page, limit });
      setState({ products: data.products, total: data.total, loading: false, error: null });
    } catch (err) {
      console.warn("API/Google Sheets unavailable, using local catalog:", err.message);
      const fallback = getStaticFallback({ cat, sort, search, page, limit });
      setState({ products: fallback.products, total: fallback.total, loading: false, error: null });
    }
  }, [cat, sort, search, page, limit]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const data = await getProducts({ cat, sort, search, page, limit });
        if (!cancelled) setState({ products: data.products, total: data.total, loading: false, error: null });
      } catch (err) {
        console.warn("API/Google Sheets unavailable, using local catalog:", err.message);
        const fallback = getStaticFallback({ cat, sort, search, page, limit });
        if (!cancelled) setState({ products: fallback.products, total: fallback.total, loading: false, error: null });
      }
    })();
    return () => { cancelled = true; };
  }, [cat, sort, search, page, limit]);

  return { ...state, refetch: load };
}
