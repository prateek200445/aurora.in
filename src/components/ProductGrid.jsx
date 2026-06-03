import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../data/products';
import ProductCard from './ProductCard';
import { ArrowUpDown, Search, RefreshCw, X } from 'lucide-react';

export default function ProductGrid({
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchClear,
  onQuickView
}) {
  const [sortBy, setSortBy] = useState('featured');

  // TanStack Query useQuery hook
  const {
    data: productsList = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, sortBy],
    queryFn: () => api.getProducts({
      category: selectedCategory,
      search: searchQuery,
      sortBy: sortBy
    })
  });

  const categories = ['All', 'Apparel', 'Home Decor', 'Skincare', 'Electronics'];

  return (
    <section className="product-section" id="products">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="section-subtitle">Our Curated Catalog</span>
            <h2 className="section-title">Discover Our Essentials</h2>
          </div>

          {/* Search Result Banner */}
          {searchQuery && (
            <div className="search-banner">
              <span>Showing results for "<strong>{searchQuery}</strong>"</span>
              <button onClick={onSearchClear} className="btn-clear-search">
                <X className="icon-xs" />
              </button>
            </div>
          )}
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="toolbar-container">
          {/* Category Tabs */}
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

          {/* Sort Controls */}
          <div className="sort-controls">
            <div className="sort-select-wrapper">
              <ArrowUpDown className="sort-icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Manual Refetch */}
            <button
              onClick={() => refetch()}
              className={`btn-refetch ${isFetching && !isLoading ? 'spinning' : ''}`}
              title="Refresh Products"
              aria-label="Refresh product list"
            >
              <RefreshCw className="icon-sm" />
            </button>
          </div>
        </div>

        {/* Error State */}
        {isError && (
          <div className="grid-error-state">
            <p>Failed to load products: {error?.message || 'Unknown error'}</p>
            <button onClick={() => refetch()} className="btn btn-primary">
              <RefreshCw className="icon-sm" />
              <span>Retry Load</span>
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="products-grid">
            {Array.from({ length: 4 }).map((_, idx) => (
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
        )}

        {/* Empty State */}
        {!isLoading && !isError && productsList.length === 0 && (
          <div className="grid-empty-state">
            <div className="empty-search-icon">
              <Search className="icon-lg" />
            </div>
            <h3>No products found</h3>
            <p>We couldn't find anything matching your filters or search query. Try resetting them.</p>
            <button
              onClick={() => {
                onCategorySelect('All');
                onSearchClear();
                setSortBy('featured');
              }}
              className="btn btn-outline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && productsList.length > 0 && (
          <div className="products-grid">
            {productsList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
