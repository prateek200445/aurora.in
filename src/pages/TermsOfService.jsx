import { BRAND_NAME } from '../utils/constants';

export default function TermsOfService() {
  return (
    <div className="terms-of-service-page" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--text-dark)', fontWeight: '800' }}>
        Terms of Service
      </h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        Welcome to {BRAND_NAME}. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Use of Site</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        You may use our site for personal, non-commercial shopping purposes only. You agree not to engage in any behavior that disrupts or harms our website, services, or users.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Product Availability & Pricing</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        All prices and product availability are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including errors in pricing or availability.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Intellectual Property</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        All content on this site, including text, designs, images, and logos, is the property of {BRAND_NAME} and is protected by copyright and intellectual property laws.
      </p>
    </div>
  );
}
