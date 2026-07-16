import React from "react";

const Pagination = ({
  page,
  totalPages,
  totalItems,
  onPrevious,
  onNext,
  className = "",
  itemLabel = "recipes",
}) => {

  const containerClass = ["pagination-controls", className].filter(Boolean).join(" ");

  return (
    <div className={containerClass}>
      <button onClick={onPrevious} disabled={page <= 1}>
        Previous
      </button>
      <span>
        Page {page} of {totalPages} ({totalItems} {itemLabel})
      </span>
      <button onClick={onNext} disabled={page >= totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
