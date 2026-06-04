import { BRAND_NAME } from '../utils/constants';
import '../styles/static-pages.css';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page static-page-container">
      <h1 className="static-page-title">
        Privacy Policy
      </h1>
      <p className="static-page-text">
        Your privacy is important to us. This Privacy Policy explains how {BRAND_NAME} collects, uses, and protects your personal information when you use our website.
      </p>

      <h2 className="static-page-heading">Information Collection</h2>
      <p className="static-page-text">
        We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This may include your name, email, shipping address, and payment information.
      </p>

      <h2 className="static-page-heading">Data Usage</h2>
      <p className="static-page-text">
        We use the information we collect to fulfill your orders, communicate with you, personalize your experience, and improve our services.
      </p>

      <h2 className="static-page-heading">Security</h2>
      <p className="static-page-text">
        We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, or disclosure.
      </p>
    </div>
  );
}
