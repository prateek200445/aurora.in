import { BRAND_NAME } from '../utils/constants';
import '../styles/static-pages.css';

export default function Sustainability() {
  return (
    <div className="sustainability-page static-page-container">
      <h1 className="static-page-title">
        Sustainability & Conscious Craft
      </h1>
      <p className="static-page-text">
        Consciously crafted, sustainably manufactured, and built to endure. At {BRAND_NAME}, sustainability is not just a buzzword—it is at the core of every design decision we make.
      </p>

      <h2 className="static-page-heading">Sustainable Sourcing</h2>
      <p className="static-page-text">
        We source natural, organic, and recycled materials wherever possible. From our certified organic cotton apparel to our recycled glass decor pieces, we strive to minimize our environmental footprint.
      </p>

      <h2 className="static-page-heading">Ethical Manufacturing</h2>
      <p className="static-page-text">
        We partner only with manufacturers who share our dedication to fair labor practices, safe working conditions, and transparent supply chains. Every item we produce supports the workers who brought it to life.
      </p>

      <h2 className="static-page-heading">Our Long-term Vision</h2>
      <p className="static-page-text">
        We are actively working toward zero-waste packaging, full carbon-neutral shipping operations, and closed-loop recycling programs to give a second life to every Aurora product.
      </p>
    </div>
  );
}
