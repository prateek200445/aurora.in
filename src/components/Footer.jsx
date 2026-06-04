import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column footer-about">
            <h3 className="footer-brand" style={{ marginBottom: '10px' }}>
              <Link
                to="/"
                className="site-logo"
              >
                Aurora Goods
              </Link>
            </h3>
            <p className="footer-about-desc" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '10px' }}>Got questions or feedback? Connect with our support team.</p>
            <p className="email-contact" style={{ fontWeight: '700', color: 'var(--text-dark)' }}>hello@auroragoods.in</p>
            <p className="phone-contact" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>+91 (800) 456-7890</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Aurora Goods. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link to="/privacy" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '16px' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
