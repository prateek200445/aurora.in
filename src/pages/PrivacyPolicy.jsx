import { BRAND_NAME } from '../utils/constants';
import StaticPageLayout from '../components/StaticPageLayout';

const PrivacyPolicy = () => {
  const sections = [
    {
      text: `Your privacy is important to us. This Privacy Policy explains how ${BRAND_NAME} collects, uses, and protects your personal information when you use our website.`
    },
    {
      heading: 'Information Collection',
      text: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This may include your name, email, shipping address, and payment information.'
    },
    {
      heading: 'Data Usage',
      text: 'We use the information we collect to fulfill your orders, communicate with you, personalize your experience, and improve our services.'
    },
    {
      heading: 'Security',
      text: 'We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, or disclosure.'
    }
  ];

  return (
    <StaticPageLayout
      pageClass="privacy-policy-page"
      title="Privacy Policy"
      sections={sections}
    />
  );
};

export default PrivacyPolicy;

