export default function HeroGrid() {
  const cards = [
    {
      id: 1,
      image: '/trending_now.png',
      alt: 'Model in trench coat and sunglasses',
      className: 'card-1'
    },
    {
      id: 2,
      image: '/featured_collections.png',
      alt: 'Minimalist vase and houseplant decor',
      className: 'card-2'
    },
    {
      id: 3,
      image: '/hero_speaker.png',
      alt: 'Sleek smart wireless speaker',
      className: 'card-3'
    },
    {
      id: 4,
      image: '/new_arrivals.png',
      alt: 'Apothecary skincare serum bottles',
      className: 'card-4'
    },
    {
      id: 5,
      image: '/hero_trench_coat.png',
      alt: 'Camel trench coat on hanger',
      className: 'card-5'
    },
    {
      id: 6,
      image: '/new_arrivals.png',
      alt: 'Hydrating skincare cream cosmetic',
      className: 'card-6'
    }
  ];

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
