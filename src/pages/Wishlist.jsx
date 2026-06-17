import { useWishlist } from "../context/WishlistContext";
import { products } from "../data/products";
import ProductCard from "../components/ProductCard";
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Wishlist({ onQuickView }) {
  const { wishlist } = useWishlist();

  const wishlistedItems = products.filter((p) => wishlist.includes(p.id));

  return (
    <div
      className="wishlist-page"
      style={{
        padding: "40px 24px 80px",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <div
        className="section-header"
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span className="section-subtitle">Your Saved Essentials</span>
          <h1 className="section-title">My Wishlist</h1>
        </div>
        <Link
          to="/shop"
          className="btn btn-outline"
          style={{ padding: "8px 16px", fontSize: "0.9rem" }}
        >
          <ArrowLeft className="icon-xs" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {wishlistedItems.length === 0 ? (
        <div
          className="grid-empty-state"
          style={{
            padding: "80px 40px",
            border: "1px dashed var(--border-color)",
            backgroundColor: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <div className="empty-search-icon" style={{ marginBottom: "20px" }}>
            <Heart className="icon-lg" style={{ color: "var(--text-muted)" }} />
          </div>
          <h3
            style={{
              fontSize: "1.40rem",
              fontWeight: "700",
              color: "var(--text-dark)",
              marginBottom: "8px",
            }}
          >
            Your wishlist is empty
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "24px",
              maxWidth: "360px",
              margin: "0 auto 24px",
            }}
          >
            Browse through our catalog of sustainable garments, ceramics, and
            daily skincare to save your favorites!
          </p>
          <Link to="/shop" className="btn btn-primary">
            <span>Explore the Shop</span>
          </Link>
        </div>
      ) : (
        /* Wishlist Grid */
        <div className="products-grid">
          {wishlistedItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      )}
    </div>
  );
}
