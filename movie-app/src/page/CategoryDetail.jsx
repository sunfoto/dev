import { useEffect, useMemo, useRef, useState } from "react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getCategoryMovies } from "../api/ophim";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

export default function CategoryDetail() {
  const { slug, page: pageParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const page = useMemo(() => {
    const parsed = Number(pageParam || 1);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageParam]);
  const year = searchParams.get("year") || "";

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [title, setTitle] = useState("Thể loại");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const listTopRef = useRef(null);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const params = { page, limit: 24 };
        if (year) {
          params.year = year;
        }
        const data = await getCategoryMovies(slug, params);
        if (!active) {
          return;
        }
        setItems(data?.data?.items ?? []);
        setPagination(data?.data?.pagination ?? null);
        setTitle(data?.data?.titlePage || "Thể loại");
        setError("");
      } catch {
        if (!active) {
          return;
        }
        setError("Không thể tải phim theo thể loại. Vui lòng thử lại.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategory();
    return () => {
      active = false;
    };
  }, [slug, page, year]);

  const buildQuery = (overrides) => {
    const nextYear = overrides?.year ?? year;
    return nextYear ? { year: nextYear } : {};
  };

  const handlePageChange = (nextPage) => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const queryString = createSearchParams(buildQuery()).toString();
    navigate(`/the-loai/${slug}/page/${nextPage}${queryString ? `?${queryString}` : ""}`);
  };

  const handleYearChange = (event) => {
    const queryString = createSearchParams(buildQuery({ year: event.target.value })).toString();
    navigate(`/the-loai/${slug}${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
          Thể loại
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold glow-text">
          {title}
        </h2>
      </div>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={year}
          onChange={handleYearChange}
          aria-label="Lọc theo năm"
        >
          <option value="">Tất cả năm</option>
          {years.map((value) => (
            <option key={value} value={String(value)}>
              {value}
            </option>
          ))}
        </select>

        {year && (
          <button
            type="button"
            className="neon-button secondary"
            onClick={() => navigate(`/the-loai/${slug}`)}
          >
            Xóa lọc
          </button>
        )}
      </div>

      {error && <div className="neon-alert">{error}</div>}

      <Pagination
        page={pagination?.currentPage || page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={handlePageChange}
        compact
      />

      <div ref={listTopRef} className="scroll-anchor" aria-hidden="true" />
      {loading ? (
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="movie-skeleton" />
          ))}
        </div>
      ) : (
        <div className="movie-grid">
          {items.length ? (
            items.map((movie) => (
              <MovieCard key={movie._id || movie.slug} movie={movie} variant="grid" />
            ))
          ) : (
            <div className="neon-alert">Không tìm thấy phim phù hợp.</div>
          )}
        </div>
      )}

      <Pagination
        page={pagination?.currentPage || page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
