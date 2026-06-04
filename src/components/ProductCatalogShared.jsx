import React from 'react';
import { ArrowUpDown, RefreshCw, Search, X } from 'lucide-react';
import ProductCard from './ProductCard';

export function CategoryTabs({ categories, selectedCategory, onCategorySelect }) {
  return (
    <div className="tabs-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
          onClick={() => onCategorySelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export function SortControls({ sortBy, onSortChange, onRefresh, isFetching, isLoading }) {
  return (
    <div className="sort-controls">
      <div className="sort-select-wrapper">
        <ArrowUpDown className="sort-icon" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <button
        onClick={onRefresh}
        className={`btn-refetch ${isFetching && !isLoading ? 'spinning' : ''}`}
        title="Refresh Products"
        aria-label="Refresh product list"
      >
        <RefreshCw className="icon-sm" />
      </button>
    </div>
  );
}

export function SearchBanner({ searchQuery, onSearchClear, style }) {
  if (!searchQuery) return null;
  return (
    <div className="search-banner" style={style}>
      <span>Showing results for "<strong>{searchQuery}</strong>"</span>
      <button onClick={onSearchClear} className="btn-clear-search" aria-label="Clear search">
        <X className="icon-xs" />
      </button>
    </div>
  );
}

export function FilterBanner({ selectedFilter, onFilterClear, style }) {
  if (!selectedFilter) return null;
  
  const getFilterLabel = (filter) => {
    switch (filter) {
      case 'new': return 'New Arrivals';
      case 'bestseller': return 'Best Sellers';
      case 'sale': return 'Sale';
      default: return filter;
    }
  };

  return (
    <div className="search-banner" style={style}>
      <span>Filtered by: <strong>{getFilterLabel(selectedFilter)}</strong></span>
      <button 
        onClick={onFilterClear} 
        className="btn-clear-search"
        aria-label="Clear filter"
      >
        <X className="icon-xs" />
      </button>
    </div>
  );
}

export function ProductSkeletonGrid({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton-image pulse"></div>
          <div className="skeleton-details">
            <div className="skeleton-line pulse w-33"></div>
            <div className="skeleton-line pulse w-75"></div>
            <div className="skeleton-line pulse w-50"></div>
            <div className="skeleton-line pulse w-25"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGridError({ message, onRetry }) {
  return (
    <div className="grid-error-state">
      <p>Failed to load products: {message || 'Unknown error'}</p>
      <button onClick={onRetry} className="btn btn-primary">
        <RefreshCw className="icon-sm" />
        <span>Retry Load</span>
      </button>
    </div>
  );
}

export function ProductGridEmpty({ onReset }) {
  return (
    <div className="grid-empty-state">
      <div className="empty-search-icon">
        <Search className="icon-lg" />
      </div>
      <h3>No products found</h3>
      <p>We couldn't find anything matching your filters or search query. Try resetting them.</p>
      <button onClick={onReset} className="btn btn-outline">
        Reset Filters
      </button>
    </div>
  );
}

export function ProductsList({ products, onQuickView }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}
