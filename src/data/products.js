import { isValidEmail } from '../utils/validation';
import productsData from './products.json';
import { PROMO_CODE_AURORA10, PROMO_CODE_FREESHIP } from '../utils/constants';

export const collections = [
  {
    id: 'trending-now',
    name: 'Trending Now',
    subtitle: 'Selected garments and everyday apparel designed to empower.',
    image: '/trending_now.png',
    tag: 'Shop Now',
    link: '#products'
  },
  {
    id: 'featured-collections',
    name: 'Featured Collections',
    subtitle: 'Minimalist ceramics, lush plants, and modern art pieces.',
    image: '/featured_collections.png',
    tag: 'Featured',
    link: '#products'
  },
  {
    id: 'new-arrivals',
    name: 'New Arrivals',
    subtitle: 'Premium apothecary, dropper serums, and skin hydration.',
    image: '/new_arrivals.png',
    tag: 'Shop Now',
    link: '#products'
  }
];

export const products = productsData;

export const api = {
  getProducts: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...products];

        if (filters.category && filters.category !== 'All') {
          result = result.filter(p => p.category === filters.category);
        }

        // Apply filter (e.g. 'new', 'bestseller', 'sale')
        if (filters.filter) {
          if (filters.filter === 'new') {
            result = result.filter(p => p.isNew === true);
          } else if (filters.filter === 'bestseller') {
            result = result.filter(p => p.isBestSeller === true);
          } else if (filters.filter === 'sale') {
            result = result.filter(p => p.discountPrice !== undefined);
          }
        }

        // Apply search query filter
        
        if (filters.search) {
          const query = filters.search.toLowerCase();
          result = result.filter(
            p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-low':
              result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
              break;
            case 'price-high':
              result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
              break;
            case 'rating':
              result.sort((a, b) => b.rating - a.rating);
              break;
            case 'featured':
            default:
              result.sort((a, b) => {
                if (a.isBestSeller && !b.isBestSeller) return -1;
                if (!a.isBestSeller && b.isBestSeller) return 1;
                return 0;
              });
              break;
          }
        }

        resolve(result);
      }, 500);
    });
  },

  getProductById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(products.find(p => p.id === id));
      }, 300);
    });
  },

  getSearchSuggestions: async (query) => {
    return new Promise((resolve) => {
      if (!query) {
        resolve([]);
        return;
      }
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const matches = products
          .filter(p => p.name.toLowerCase().includes(lowerQuery))
          .map(p => ({ id: p.id, name: p.name, category: p.category }))
          .slice(0, 5);
        resolve(matches);
      }, 200);
    });
  },

  applyCoupon: async (code) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalized = code.toUpperCase().trim();
        if (normalized === PROMO_CODE_AURORA10) {
          resolve({ success: true, discountPercent: 10, message: `${PROMO_CODE_AURORA10} applied: 10% Discount!` });
        } else if (normalized === PROMO_CODE_FREESHIP) {
          resolve({ success: true, discountPercent: 0, message: `${PROMO_CODE_FREESHIP} applied: Free Shipping!` });
        } else {
          resolve({ success: false, message: 'Invalid or expired promo code.' });
        }
      }, 800);
    });
  },

  subscribeNewsletter: async (email) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!isValidEmail(email)) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        resolve({
          success: true,
          message: `Thank you! ${email} has been subscribed to the Aurora Goods newsletter.`
        });
      }, 1500);
    });
  }
};
