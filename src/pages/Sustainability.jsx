import { BRAND_NAME } from '../utils/constants';
import StaticPageLayout from '../components/StaticPageLayout';

export default function Sustainability() {
  const sections = [
    {
      text: `Consciously crafted, sustainably manufactured, and built to endure. At ${BRAND_NAME}, sustainability is not just a buzzword—it is at the core of every design decision we make.`
    },
    {
      heading: 'Sustainable Sourcing',
      text: 'We source natural, organic, and recycled materials wherever possible. From our certified organic cotton apparel to our recycled glass decor pieces, we strive to minimize our environmental footprint.'
    },
    {
      heading: 'Ethical Manufacturing',
      text: 'We partner only with manufacturers who share our dedication to fair labor practices, safe working conditions, and transparent supply chains. Every item we produce supports the workers who brought it to life.'
    },
    {
      heading: 'Our Long-term Vision',
      text: `We are actively working toward zero-waste packaging, full carbon-neutral shipping operations, and closed-loop recycling programs to give a second life to every ${BRAND_NAME} product.`
    }
  ];

  return (
    <StaticPageLayout
      pageClass="sustainability-page"
      title="Sustainability & Conscious Craft"
      sections={sections}
    />
  );
}

