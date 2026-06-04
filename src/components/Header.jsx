import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, ChevronDown, X, Heart, Menu, Sparkles, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../data/products';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Header({ onCartToggle, onQuickView }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const searchParams = new URLSearchParams(location.search);
  const currentFilter = searchParams.get('filter') || '';
  const currentCategory = searchParams.get('category') || '';
  const selectedCategory = currentCategory || 'All';

  const isNewArrivalsActive = location.pathname === '/shop' && currentFilter === 'new';
  const isBestSellersActive = location.pathname === '/shop' && currentFilter === 'bestseller';
  const isSaleActive = location.pathname === '/shop' && currentFilter === 'sale';
  const isCategoriesActive = location.pathname === '/shop' && (currentCategory || (!currentFilter && !searchParams.get('search')));
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
    if (searchParam) {
      setIsSearchOpen(true);
    }
  }, [location.search]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Prevent background scrolling when mobile navigation menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('no-scroll');
      document.documentElement.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
      document.documentElement.classList.remove('no-scroll');
    };
  }, [isMobileMenuOpen]);

  // Handle Search Input suggestions
  
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      const results = await api.getSearchSuggestions(searchQuery);
      setSuggestions(results);
    };
    fetchSuggestions();
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category) => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (category === 'All') {
      navigate('/shop');
    } else {
      navigate(`/shop?category=${encodeURIComponent(category)}`);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      setIsMobileMenuOpen(false);
      navigate(`/shop?search=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate('/shop', { replace: true });
    }
  };

  const handleSuggestionClick = async (productId) => {
    const product = await api.getProductById(productId);
    if (product) {
      onQuickView(product);
    }
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* Logo and Menu Toggle wrapper for leftmost grouping on mobile */}
        <div className="logo-wrapper">
          {location.pathname === '/' ? (
            <button
              className="action-btn mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="icon" /> : <Menu className="icon" />}
            </button>
          ) : (
            <button
              className="action-btn mobile-menu-toggle"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ArrowLeft className="icon" />
            </button>
          )}

          <Link
            to="/"
            className="site-logo"
          >
            <span className="logo-full">Aurora Goods</span>
            <span className="logo-short">AG</span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="site-navigation" aria-label="Main Navigation">
          <ul className="nav-list">
            {/* Shop Categories Dropdown */}
            <li className="nav-item" ref={dropdownRef}>
              <button
                className={`nav-link dropdown-toggle ${isDropdownOpen || isCategoriesActive ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                <span>Shop Categories</span>
                <ChevronDown className="icon-xs" />
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  {['All', 'Apparel', 'Home Decor', 'Skincare', 'Electronics'].map((cat) => {
                    const selectedCategory = searchParams.get('category') || 'All';
                    return (
                      <li key={cat}>
                        <button
                          className={`dropdown-item ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => handleCategoryClick(cat)}
                        >
                          {cat}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>

            <li className="nav-item">
              <Link to="/shop?filter=new" className={`nav-link ${isNewArrivalsActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                New Arrivals
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shop?filter=bestseller" className={`nav-link ${isBestSellersActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                Best Sellers
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/shop?filter=sale" className={`nav-link text-sale ${isSaleActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                <Sparkles className="icon-xs sale-icon" />
                <span>Sale</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Icons */}
        <div className="header-actions">

          {/* Inline Search Toggle */}
          <div className={`search-wrapper ${isSearchOpen ? 'active' : ''}`}>
            {isSearchOpen ? (
              <div className="search-bar-expanded">
                <input
                  id="search-input"
                  name="search"
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="search-input"
                />
                <button
                  className="btn-search-clear"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                    navigate('/shop');
                  }}
                  aria-label="Close search"
                >
                  <X className="icon-sm" />
                </button>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="search-suggestions-dropdown">
                    <ul className="suggestions-list">
                      {suggestions.map((item) => (
                        <li key={item.id} className="suggestion-item">
                          <button onClick={() => handleSuggestionClick(item.id)}>
                            <span className="suggestion-name">{item.name}</span>
                            <span className="suggestion-cat">{item.category}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="action-btn"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                aria-label="Open search bar"
              >
                <Search className="icon" />
              </button>
            )}
          </div>

          {/* Wishlist Link Shortcut */}
          <Link to="/wishlist" className="action-btn" aria-label="View Wishlist" style={{ position: 'relative' }} onClick={closeMobileMenu}>
            <Heart 
              className="icon" 
              fill={wishlist.length > 0 ? 'var(--accent-color)' : 'none'} 
              style={{ color: wishlist.length > 0 ? 'var(--accent-color)' : 'var(--text-dark)' }} 
            />
            {wishlist.length > 0 && (
              <span className="cart-badge" style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'var(--accent-color)', width: '16px', height: '16px', border: '2px solid var(--bg-primary)' }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Trigger */}
          <button className="action-btn cart-trigger" onClick={onCartToggle} aria-label="Open cart">
            <ShoppingBag className="icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className={`mobile-navigation ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden={!isMobileMenuOpen}>
        <div className="mobile-navigation-inner">
          <Link to="/shop?filter=new" className={`mobile-nav-link ${isNewArrivalsActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            New Arrivals
          </Link>
          <Link to="/shop?filter=bestseller" className={`mobile-nav-link ${isBestSellersActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            Best Sellers
          </Link>
          <Link to="/shop?filter=sale" className={`mobile-nav-link text-sale ${isSaleActive ? 'active' : ''}`} onClick={closeMobileMenu}>
            <span>Sale</span>
            <Sparkles className="icon-xs sale-icon" />
          </Link>

          <div className="mobile-nav-group">
            <p className="mobile-nav-group-title">Shop Categories</p>
            {['All', 'Apparel', 'Home Decor', 'Skincare', 'Electronics'].map((cat) => {
              const isCatActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  className={`mobile-nav-link mobile-nav-button ${isCatActive ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
