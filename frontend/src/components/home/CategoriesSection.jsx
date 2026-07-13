import { Link } from "react-router-dom";
import { categories } from "../../data/products";

export default function CategoriesSection() {
  return (
    <section className="section" style={{ background: "white" }}>
      <div className="section-header">
        <div className="section-badge">🏷️ التصنيفات</div>
        <div className="section-title">تناسب جميع الأذواق</div>
      </div>
      <div className="cats-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?cat=${cat.id}`}
            className="cat-card"
          >
            <div className="cat-icon">
              <span>{cat.icon}</span>
            </div>
            <div className="cat-name">{cat.name}</div>
            <div className="cat-count">{cat.count} منتج</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
