import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories, searchMovies } from "../api/ophim";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("keyword") || "";
  const page = useMemo(
    () => Number(searchParams.get("page") || 1),
    [searchParams]
  );

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categoryRedirectCheck, setCategoryRedirectCheck] = useState({
    keyword: "",
    checked: true,
  });
  const listTopRef = useRef(null);
  const categoryRedirectChecked =
    !keyword ||
    (categoryRedirectCheck.keyword === keyword && categoryRedirectCheck.checked);

  useEffect(() => {
    if (!keyword) {
      return;
    }

    let active = true;

    const redirectCategoryKeyword = async () => {
      try {
        const categories = await getCategories();
        if (!active) {
          return;
        }
        const normalizedKeyword = normalizeText(keyword);
        const matchedCategory = categories.find(
          (item) => normalizeText(item.name) === normalizedKeyword
        );
        if (matchedCategory?.slug) {
          navigate(`/the-loai/${matchedCategory.slug}`, { replace: true });
          return;
        }
      } catch {
        // If categories cannot be loaded, keep normal movie search working.
      }

      if (active) {
        setCategoryRedirectCheck({ keyword, checked: true });
      }
    };

    redirectCategoryKeyword();
    return () => {
      active = false;
    };
  }, [keyword, navigate]);

  useEffect(() => {
    if (!keyword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      setPagination(null);
      return;
    }
    if (!categoryRedirectChecked) {
      return;
    }

    let active = true;

    const fetchSearch = async () => {
      try {
        setLoading(true);
        const data = await searchMovies(keyword, { page, limit: 24 });
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
        setError("Không thể tìm kiếm phim. Vui lòng thử lại.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSearch();
    return () => {
      active = false;
    };
  }, [keyword, page, categoryRedirectChecked]);

  const handlePageChange = (nextPage) => {
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSearchParams({ keyword, page: String(nextPage) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
          Tìm kiếm
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold glow-text">
          {keyword ? `Kết quả cho: ${keyword}` : "Nhập từ khóa để tìm kiếm"}
        </h2>
      </div>

      {!keyword && (
        <div className="neon-alert">
          Hãy nhập từ khóa trên thanh tìm kiếm.
        </div>
      )}

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
        keyword && (
          <div className="movie-grid">
            {items.map((movie) => (
              <MovieCard key={movie._id} movie={movie} variant="grid" />
            ))}
          </div>
        )
      )}

      <Pagination
        page={pagination?.currentPage || page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
    .toLowerCase();
}
