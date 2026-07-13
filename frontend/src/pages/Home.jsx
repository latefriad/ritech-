import HeroSlider from "../components/home/HeroSlider";
import CategoriesSection from "../components/home/CategoriesSection";
import PromoBanner from "../components/home/PromoBanner";
import ProductCard from "../components/products/ProductCard";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import useProducts from "../hooks/useProducts";

export default function Home() {
  const { products, loading } = useProducts({ limit: 6 });

  return (
    <>
      <HeroSlider />
      <CategoriesSection />

      <section className="products-section">
        <div className="section-header">
          <div className="section-badge">🛍️ منتجاتنا</div>
          <div className="section-title">منتجات أصلية</div>
        </div>
        {loading ? (
          <LoadingSkeleton count={6} />
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <PromoBanner />
    </>
  );
}
