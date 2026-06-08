import React from 'react';
import { useProducts } from '../hooks/useProducts';
import {
  CategoryTabs,
  SortControls,
  SearchBanner,
  ProductGridStates
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

        {/* Product Grid States (Loading / Error / Empty / List) */}
        <ProductGridStates
          isLoading={isLoading}
          isError={isError}
          error={error}
          productsList={productsList}
          refetch={refetch}
          skeletonCount={4}
          onReset={() => {
            onCategorySelect('All');
            onSearchClear();
            setSortBy('featured');
          }}
          onQuickView={onQuickView}
        />
      </div>
    </section>
  );
}
