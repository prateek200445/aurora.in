import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ArrowUpDown, Search, RefreshCw, X } from 'lucide-react';

export default function Shop({ onQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const selectedFilter = searchParams.get('filter') || ''; // 'new', 'bestseller', 'sale'
  const [sortBy, setSortBy] = useState('featured');

  const {
    data: productsList = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['products', selectedCategory, searchQuery, selectedFilter, sortBy],
    queryFn: () => {
      const params = {
        category: selectedCategory,
        search: searchQuery,
        sortBy: sortBy
      };
      if (selectedFilter) {
        params.filter = selectedFilter;
      }
      return api.getProducts(params);
    }
  });

  const categories = ['All', 'Apparel', 'Home Decor', 'Skincare', 'Electronics'];

  const handleCategorySelect = (cat) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString());
      if (cat === 'All') {
        next.delete('category');
      } else {
        next.set('category', cat);
      }
      return next;
    });
  };

  const handleSearchClear = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString());
      next.delete('search');
      return next;
    });
  };

  return (
    <div className="shop-page">
      <section className="product-section" id="products">
        <div className="section-container">

          <div className="section-header">
            <div className="section-title-wrapper">
              <span className="section-subtitle">
                {selectedFilter === 'new' ? 'Freshly Added' :
                 selectedFilter === 'bestseller' ? 'Most Popular' :
                 selectedFilter === 'sale' ? 'Limited Time Discounts' : 'Our Curated Catalog'}
              </span>
              <h2 className="section-title">
                {selectedFilter === 'new' ? 'New Arrivals' :
                 selectedFilter === 'bestseller' ? 'Trending Best Sellers' :
                 selectedFilter === 'sale' ? 'Exclusive Sale Offers' : 'Discover Our Essentials'}
              </h2>
            </div>

            {/* Search and Filter Result Banners */}
            <div className="banners-container">
              {searchQuery && (
                <div className="search-banner">
                  <span>Showing results for "<strong>{searchQuery}</strong>"</span>
                  <button onClick={handleSearchClear} className="btn-clear-search">
                    <X className="icon-xs" />
                  </button>
                </div>
              )}

              {selectedFilter && (
                <div className="search-banner">
                  <span>Filtered by: <strong>{
                    selectedFilter === 'new' ? 'New Arrivals' :
                    selectedFilter === 'bestseller' ? 'Best Sellers' : 'Sale'
                  }</strong></span>
                  <button 
                    onClick={() => setSearchParams((prev) => {
                      const next = new URLSearchParams(prev.toString());
                      next.delete('filter');
                      return next;
                    })} 
                    className="btn-clear-search"
                    aria-label="Clear filter"
                  >
                    <X className="icon-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter and Sort Toolbar */}
          <div className="toolbar-container">
            {/* Category Tabs */}
            <div className="tabs-container">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat)}
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
              {Array.from({ length: 8 }).map((_, idx) => (
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
                  setSearchParams({});
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
    </div>
  );
}
