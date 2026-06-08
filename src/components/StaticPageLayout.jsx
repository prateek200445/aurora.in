import React from "react";
import "../styles/static-pages.css";

/**
 * Reusable layout component for informational static pages.
 * Displays a page title followed by list of sections containing headings and descriptions.
 *
 * @param {Object} props
 * @param {string} props.pageClass - The page-specific CSS class name to apply.
 * @param {string} props.title - The main page title.
 * @param {Array<{heading?: string, text: string}>} props.sections - The array of text sections.
 */
export default function StaticPageLayout({ pageClass, title, sections }) {
  return (
    <div className={`${pageClass} static-page-container`}>
      <h1 className="static-page-title">{title}</h1>
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          {section.heading && (
            <h2 className="static-page-heading">{section.heading}</h2>
          )}
          <p className="static-page-text">{section.text}</p>
        </React.Fragment>
      ))}
    </div>
  );
}
