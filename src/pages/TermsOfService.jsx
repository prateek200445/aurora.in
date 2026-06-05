import { BRAND_NAME } from '../utils/constants';
import StaticPageLayout from '../components/StaticPageLayout';

export default function TermsOfService() {
  const sections = [
    {
      text: `Welcome to ${BRAND_NAME}. By accessing or using our website, you agree to comply with and be bound by the following Terms of Service.`
    },
    {
      heading: 'Use of Site',
      text: 'You may use our site for personal, non-commercial shopping purposes only. You agree not to engage in any behavior that disrupts or harms our website, services, or users.'
    },
    {
      heading: 'Product Availability & Pricing',
      text: 'All prices and product availability are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including errors in pricing or availability.'
    },
    {
      heading: 'Intellectual Property',
      text: `All content on this site, including text, designs, images, and logos, is the property of ${BRAND_NAME} and is protected by copyright and intellectual property laws.`
    }
  ];

  return (
    <StaticPageLayout
      pageClass="terms-of-service-page"
      title="Terms of Service"
      sections={sections}
    />
  );
}

