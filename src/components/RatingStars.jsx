import React from "react";
import { Star } from "lucide-react";

/**
 * Reusable Star Rating Component.
 * Displays up to 5 stars filled based on rating value.
 *
 * @param {Object} props
 * @param {number} props.rating - Rating value (e.g. 4.5).
 */
export default function RatingStars({ rating }) {
  const floorRating = Math.floor(rating || 0);

  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`star-icon ${i < floorRating ? "filled" : ""}`}
          fill={i < floorRating ? "var(--star-color)" : "none"}
        />
      ))}
    </div>
  );
}
