import React from 'react';
import { useProducts } from '../hooks/useProducts';
import {
  CategoryTabs,
  SortControls,
  SearchBanner,
  ProductSkeletonGrid,
  ProductGridError,
  ProductGridEmpty,
  ProductsList
} from './ProductCatalogShared';

export default function ProductGrid({
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchClear,
  onQuickView
}) {
  const {
    productsList,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    sortBy,
    setSortBy
  } = useProducts({
    category: selectedCategory,
    search: searchQuery
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

          <SearchBanner searchQuery={searchQuery} onSearchClear={onSearchClear} />
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="toolbar-container">
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />

          <SortControls
            sortBy={sortBy}
            onSortChange={setSortBy}
            onRefresh={refetch}
            isFetching={isFetching}
            isLoading={isLoading}
          />
        </div>

        {/* Error State */}
        {isError && (
          <ProductGridError message={error?.message} onRetry={refetch} />
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <ProductSkeletonGrid count={4} />
        )}

        {/* Empty State */}
        {!isLoading && !isError && productsList.length === 0 && (
          <ProductGridEmpty
            onReset={() => {
              onCategorySelect('All');
              onSearchClear();
              setSortBy('featured');
            }}
          />
        )}

        {/* Products Grid */}
        {!isLoading && !isError && productsList.length > 0 && (
          <ProductsList products={productsList} onQuickView={onQuickView} />
        )}
      </div>
    </section>
  );
}
