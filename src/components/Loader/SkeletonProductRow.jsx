import React from "react";
import "./SkeletonProductRow.css";

const SkeletonProductRow = () => {
  const skeletonItems = [1, 2, 3, 4]; // one row with 4 cards

  return (
    <div className="skeleton-row">
      {skeletonItems.map((item) => (
        <div key={item} className="skeleton-card">
          <div className="skeleton-img shimmer"></div>

          <div className="skeleton-text skeleton-title shimmer"></div>

          <div className="skeleton-text skeleton-desc shimmer"></div>
          <div className="skeleton-text skeleton-desc small shimmer"></div>

          <div className="skeleton-text skeleton-price shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonProductRow;
