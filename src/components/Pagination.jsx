export default function Pagination({ page, totalPages, onPageChange, compact = false }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const canPrev = page > 1;
  const canNext = page < totalPages;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={`pagination-wrap ${compact ? "pagination-wrap-compact" : ""}`}>
      <button
        type="button"
        className="neon-button secondary"
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Trước
      </button>
      <div className="pagination-pages" aria-label="Danh sách trang">
        {pages.map((item) => (
          <button
            key={item}
            type="button"
            className={`pagination-page ${item === page ? "active" : ""}`}
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="neon-button secondary"
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Sau
      </button>
    </div>
  );
}
