import { Link, useLocation } from 'react-router-dom';
import { BRAND_NAME, CONTACT_EMAIL, CONTACT_PHONE } from '../utils/constants';

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column footer-about">
            <h3 className="footer-brand">
              <Link
                to="/"
                className="site-logo"
              >
                {BRAND_NAME}
              </Link>
            </h3>
            <p className="footer-about-desc">
              Designing modern essentials that seamlessly elevate your daily life. Consciously crafted, sustainably manufactured, and built to endure.
            </p>
          </div>
          <div className="footer-column footer-links-column">
            <h4>Shop Catalog</h4>
            <ul>
              <li><Link to="/shop?category=Apparel">Apparel</Link></li>
              <li><Link to="/shop?category=Home%20Decor">Home Decor</Link></li>
              <li><Link to="/shop?category=Skincare">Skincare</Link></li>
              <li><Link to="/shop?category=Electronics">Electronics</Link></li>
            </ul>
          </div>
          <div className="footer-column footer-links-column">
            <h4>Customer Care</h4>
            <ul>
              <li><Link to="/returns">Return & Exchange</Link></li>
              <li><Link to="/sustainability">Sustainable Sourcing</Link></li>
            </ul>
          </div>
          <div className="footer-column footer-links-column">
            <h4>Contact Us</h4>
            <p className="contact-desc">Got questions or feedback? Connect with our support team.</p>
            <p className="email-contact">{CONTACT_EMAIL}</p>
            <p className="phone-contact">{CONTACT_PHONE}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy" className="footer-legal-link">Privacy Policy</Link>
            <Link to="/terms" className="footer-legal-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
