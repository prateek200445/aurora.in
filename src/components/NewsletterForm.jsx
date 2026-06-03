import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../data/products';

export default function NewsletterForm() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const email = data.newsletterEmail?.trim();
    if (!email) return;

    setIsLoading(true);
    try {
      const result = await api.subscribeNewsletter(email);
      setMessage(result.message);
      setIsSuccess(true);
      form.reset();
    } catch (err) {
      setMessage(err.message || 'Something went wrong. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="newsletter-wrapper">
      <div className="newsletter-header">
        <div className="newsletter-subtitle">
          <Sparkles className="newsletter-subtitle-icon" />
          <span>Stay Connected</span>
        </div>
        <h2 className="newsletter-title">Unlock 10% Off Your First Order</h2>
        <p className="newsletter-description">
          Subscribe to recieve curated collections announcements, exclusive promotions, and limited product alerts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="newsletter-form">
        <div className="newsletter-input-group">
          <input
            id="newsletter-email-input"
            name="newsletterEmail"
            type="email"
            placeholder="Enter your email address"
            disabled={isLoading}
            required
            className="newsletter-input"
            aria-label="Email address for newsletter"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary newsletter-submit-btn"
          >
            {isLoading ? (
              <span className="spinner-sm"></span>
            ) : (
              <>
                <span>Subscribe</span>
                <ArrowRight className="icon-sm" />
              </>
            )}
          </button>
        </div>
      </form>

      {message && (
        <div className={`newsletter-message-alert ${isSuccess ? 'success' : 'error'}`}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
