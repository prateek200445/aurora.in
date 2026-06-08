import { HERO_GRID_CARDS } from "../utils/constants";
import { products } from "../data/products";

export default function HeroGrid() {
  const cards = HERO_GRID_CARDS.map((card, index) => {
    const product = products.find((p) => p.id === card.productId);
    return {
      id: index + 1,
      image: product ? product.image : "",
      alt: product ? product.name : "",
      className: card.className,
    };
  });

  return (
    <div className="hero-grid-showcase">
      <div className="hero-grid-angled-wrapper">
        <div className="hero-grid-layout">
          {cards.map((card) => (
            <div key={card.id} className={`hero-grid-card ${card.className}`}>
              <div className="card-border-frame">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="hero-grid-image"
                  loading="eager"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
