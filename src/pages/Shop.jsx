import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { LABELS } from '../utils/constants';
import {
  CategoryTabs,
  SortControls,
  SearchBanner,
  FilterBanner,
  ProductGridStates
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
                {selectedFilter === 'new' ? LABELS.NEW_ARRIVALS :
                 selectedFilter === 'bestseller' ? `Trending ${LABELS.BEST_SELLERS}` :
                 selectedFilter === 'sale' ? `Exclusive ${LABELS.SALE} Offers` : 'Discover Our Essentials'}
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

          {/* Product Grid States (Loading / Error / Empty / List) */}
          <ProductGridStates
            isLoading={isLoading}
            isError={isError}
            error={error}
            productsList={productsList}
            refetch={refetch}
            skeletonCount={8}
            onReset={() => {
              setSearchParams({});
              setSortBy('featured');
            }}
            onQuickView={onQuickView}
          />
        </div>
      </section>
    </div>
  );
}
