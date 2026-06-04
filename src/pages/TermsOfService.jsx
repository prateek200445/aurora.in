import { BRAND_NAME } from '../utils/constants';
import '../styles/static-pages.css';

export default function TermsOfService() {
  return (
    <div className="terms-of-service-page static-page-container">
      <h1 className="static-page-title">
        Terms of Service
      </h1>
      <p className="static-page-text">
        Welcome to {BRAND_NAME}. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service.
      </p>

      <h2 className="static-page-heading">Use of Site</h2>
      <p className="static-page-text">
        You may use our site for personal, non-commercial shopping purposes only. You agree not to engage in any behavior that disrupts or harms our website, services, or users.
      </p>

      <h2 className="static-page-heading">Product Availability & Pricing</h2>
      <p className="static-page-text">
        All prices and product availability are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including errors in pricing or availability.
      </p>

      <h2 className="static-page-heading">Intellectual Property</h2>
      <p className="static-page-text">
        All content on this site, including text, designs, images, and logos, is the property of {BRAND_NAME} and is protected by copyright and intellectual property laws.
      </p>
    </div>
  );
}
