import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { collections } from "../data/products";

const categoryByCollectionName = {
  "Featured Collections": "Home Decor",
  "New Arrivals": "Skincare",
};

function getCollectionCategory(name) {
  return categoryByCollectionName[name] || "Apparel";
}

export default function CollectionsSection() {
  return (
    <section className="collections-section" id="collections">
      <div className="collections-container">
        <div className="collections-grid">
          {collections.map((col) => {
            const category = getCollectionCategory(col.name);

            return (
              <div key={col.id} className="collection-card">
                <img
                  src={col.image}
                  alt={col.name}
                  className="collection-bg"
                  loading="lazy"
                />
                <div className="collection-card-overlay">
                  <div className="collection-text-group">
                    <Link
                      to={`/shop?category=${encodeURIComponent(category)}`}
                      className="collection-btn"
                    >
                      <span>{col.tag}</span>
                      <span className="collection-btn-label">{col.name}</span>
                    </Link>
                    <p className="collection-desc">{col.subtitle}</p>
                    <Link
                      to={`/shop?category=${encodeURIComponent(category)}`}
                      className="btn-link"
                    >
                      <span>Explore</span>
                      <ArrowRight className="icon-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
