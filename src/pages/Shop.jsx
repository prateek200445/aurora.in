import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import {
  CategoryTabs,
  SortControls,
  SearchBanner,
  FilterBanner,
  ProductSkeletonGrid,
  ProductGridError,
  ProductGridEmpty,
  ProductsList
} from '../components/ProductCatalogShared';

export default function Shop({ onQuickView }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const selectedFilter = searchParams.get('filter') || ''; // 'new', 'bestseller', 'sale'

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
    search: searchQuery,
    filter: selectedFilter
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

  const handleFilterClear = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev.toString());
      next.delete('filter');
      return next;
    });
  };

  return (
    <div className="shop-page" style={{ padding: '40px 0 80px' }}>
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
            <div className="banners-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
              <SearchBanner
                searchQuery={searchQuery}
                onSearchClear={handleSearchClear}
                style={{ margin: 0 }}
              />

              <FilterBanner
                selectedFilter={selectedFilter}
                onFilterClear={handleFilterClear}
                style={{ margin: 0 }}
              />
            </div>
          </div>

          {/* Filter and Sort Toolbar */}
          <div className="toolbar-container">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
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
            <ProductSkeletonGrid count={8} />
          )}

          {/* Empty State */}
          {!isLoading && !isError && productsList.length === 0 && (
            <ProductGridEmpty
              onReset={() => {
                setSearchParams({});
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
    </div>
  );
}
