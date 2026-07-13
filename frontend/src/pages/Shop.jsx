import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import FiltersBar from "../components/products/FiltersBar";
import ProductCard from "../components/products/ProductCard";
import Pagination from "../components/products/Pagination";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

const ITEMS_PER_PAGE = 9;

export default function Shop({ searchQuery }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const catFromUrl = searchParams.get("cat") || "all";
  const sortFromUrl = searchParams.get("sort") || "default";

  const [activeFilter, setActiveFilter] = useState(catFromUrl);
  const [activeSort, setActiveSort] = useState(sortFromUrl);
  const [currentPage, setCurrentPage] = useState(1);

  const { products: apiProducts, total, loading } = useProducts({
    cat: activeFilter,
    sort: activeSort,
    search: searchQuery,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (f === "all") params.delete("cat");
    else params.set("cat", f);
    setSearchParams(params);
  };

  const handleSortChange = (s) => {
    setActiveSort(s);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (s === "default") params.delete("sort");
    else params.set("sort", s);
    setSearchParams(params);
  };

  return (
    <section className="products-section" style={{ minHeight: "60vh" }}>
      <div className="section-header">
        <div className="section-badge">🛍️ منتجاتنا</div>
        <div className="section-title">منتجات أصلية</div>
      </div>

      <FiltersBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        activeSort={activeSort}
        onSortChange={handleSortChange}
      />

      <div className="products-meta">
        عرض {total} منتج{total !== 1 ? "ات" : ""}
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : (
        <div className="products-grid">
          {apiProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && apiProducts.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
          لا توجد منتجات مطابقة
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
