export default function Returns() {
  return (
    <div className="returns-page" style={{ padding: '80px 24px', maxWidth: '800px', margin: '0 auto', fontFamily: 'inherit' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px', color: 'var(--text-dark)', fontWeight: '800' }}>
        Return & Exchange Policy
      </h1>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        At Aurora Goods, we want you to love your essentials. If you are not completely satisfied with your purchase, we are here to help.
      </p>
      
      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Returns</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Exchanges</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        If you need to exchange an item for a different size or color, please contact our support team. Exchanges are processed free of charge, subject to product availability.
      </p>

      <h2 style={{ fontSize: '1.5rem', marginTop: '32px', marginBottom: '16px', color: 'var(--text-dark)' }}>Refunds</h2>
      <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
        Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your credit card (or original method of payment). You will receive the credit within a certain amount of days, depending on your card issuer's policies.
      </p>
    </div>
  );
}
