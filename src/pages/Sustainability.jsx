import { BRAND_NAME } from '../utils/constants';

export default function Sustainability() {
  return (
    <div className="sustainability-page" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--text-dark)', fontWeight: '800' }}>
        Sustainability & Conscious Craft
      </h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        Consciously crafted, sustainably manufactured, and built to endure. At {BRAND_NAME}, sustainability is not just a buzzword—it is at the core of every design decision we make.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Sustainable Sourcing</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        We source natural, organic, and recycled materials wherever possible. From our certified organic cotton apparel to our recycled glass decor pieces, we strive to minimize our environmental footprint.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Ethical Manufacturing</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        We partner only with manufacturers who share our dedication to fair labor practices, safe working conditions, and transparent supply chains. Every item we produce supports the workers who brought it to life.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Our Long-term Vision</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        We are actively working toward zero-waste packaging, full carbon-neutral shipping operations, and closed-loop recycling programs to give a second life to every Aurora product.
      </p>
    </div>
  );
}
