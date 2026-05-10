import { useEffect, useMemo, useRef, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { getCategories, getListMovies } from "../api/ophim";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

const slugLabels = {
  "phim-moi": "Phim mới",
  "phim-bo": "Phim bộ",
  "phim-le": "Phim lẻ",
  "tv-shows": "TV Shows",
  "hoat-hinh": "Hoạt hình",
};

export default function List() {
  const { slug, page: pageParam } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const page = useMemo(() => {
    const parsed = Number(pageParam || 1);
    return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }, [pageParam]);
  const category = searchParams.get("category") || "";
  const year = searchParams.get("year") || "";

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const listTopRef = useRef(null);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 40 }, (_, index) => currentYear - index);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchList = async () => {
      try {
        setLoading(true);
        const params = { page, limit: 24 };
        if (category) {
          params.category = category;
        }
        if (year) {
          params.year = year;
        }
        const data = await getListMovies(slug, params);
        if (!active) {
          return;
        }
        setItems(data?.data?.items ?? []);
        setPagination(data?.data?.pagination ?? null);
        setError("");
      } catch {
        if (!active) {
          return;
        }
        setError("Không thể tải danh sách phim. Vui lòng thử lại.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchList();
    return () => {
      active = false;
    };
  }, [slug, page, category, year]);

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        if (!active) {
          return;
        }
        setCategories(Array.isArray(data) ? data : []);
      } catch {
        if (!active) {
          return;
        }
        setCategories([]);
      }
    };

    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  const buildQuery = (overrides) => {
    const next = {
      category: overrides?.category ?? category,
      year: overrides?.year ?? year,
    };
    const params = {};
    if (next.category) params.category = next.category;
    if (next.year) params.year = next.year;
    return params;
  };

  const handlePageChange = (nextPage) => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const query = buildQuery();
    const queryString = createSearchParams(query).toString();
    navigate(`/list/${slug}/page/${nextPage}${queryString ? `?${queryString}` : ""}`);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) return;
    navigate(`/search?keyword=${encodeURIComponent(value)}`);
    setKeyword("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
          Danh sách
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold glow-text">
          {slugLabels[slug] || "Danh sách phim"}
        </h2>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex flex-wrap gap-2">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm phim nhanh..."
          className="search-input w-full sm:max-w-xs"
          aria-label="Tìm kiếm phim"
        />
        <button type="submit" className="search-button">
          Tìm
        </button>
      </form>

      <div className="filter-bar">
        <select
          className="filter-select"
          value={category}
          onChange={(event) =>
            setSearchParams(buildQuery({ category: event.target.value }))
          }
          aria-label="Lọc theo thể loại"
        >
          <option value="">Tất cả thể loại</option>
          {categories.map((item) => (
            <option key={item._id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={year}
          onChange={(event) =>
            setSearchParams(buildQuery({ year: event.target.value }))
          }
          aria-label="Lọc theo năm"
        >
          <option value="">Tất cả năm</option>
          {years.map((value) => (
            <option key={value} value={String(value)}>
              {value}
            </option>
          ))}
        </select>

        {(category || year) && (
          <button
            type="button"
            className="neon-button secondary"
            onClick={() => setSearchParams({})}
          >
            Xoa loc
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
              <MovieCard key={movie._id} movie={movie} variant="grid" />
            ))
          ) : (
            <div className="neon-alert">Khong tim thay phim phu hop.</div>
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
