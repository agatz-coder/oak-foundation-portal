import React from 'react';
import './SkeletonLoader.css';

/**
 * Shimmer loading skeleton — displayed while the MIAW SDK is loading.
 * Mirrors the HAA package's haaSkeletonLoader LWC pattern.
 */
function SkeletonLoader() {
  return (
    <div className="skeleton-container" aria-busy="true" aria-label="Loading chat...">
      {/* Avatar + greeting line */}
      <div className="skeleton-row">
        <div className="skeleton-circle" />
        <div className="skeleton-lines">
          <div className="skeleton-line skeleton-line--long" />
          <div className="skeleton-line skeleton-line--medium" />
        </div>
      </div>

      {/* Suggestion pills */}
      <div className="skeleton-pills">
        <div className="skeleton-pill" />
        <div className="skeleton-pill skeleton-pill--short" />
        <div className="skeleton-pill skeleton-pill--medium" />
      </div>

      {/* Input bar */}
      <div className="skeleton-input" />
    </div>
  );
}

export default SkeletonLoader;
