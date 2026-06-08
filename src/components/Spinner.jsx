import React from "react";

/**
 * Reusable Spinner component for displaying loading indicators.
 * Can be an inline button spinner (size="sm") or a block/page-level spinner (size="md" or "lg").
 *
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size='sm'] - The size of the spinner.
 * @param {string} [props.message] - Optional text message to display alongside the spinner (for block/page layout).
 * @param {string} [props.className=''] - Additional custom CSS classes.
 */
export default function Spinner({ size = "sm", message, className = "" }) {
  if (size === "sm") {
    return <span className={`spinner-sm ${className}`} />;
  }

  // Large or medium block-level spinner
  const containerClass =
    size === "lg" ? "product-details-page loading" : "spinner-block-container";

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="spinner"></div>
      {message && (
        <p
          className="spinner-message"
          style={{ marginTop: "12px", color: "var(--text-muted)" }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
