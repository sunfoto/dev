import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategoryMovies,
  getNewMovies,
  getSeriesMovies,
  getSingleMovies,
} from "../api/ophim";
import MovieCard from "../components/MovieCard";
import { buildPosterUrl } from "../utils/media";

const sections = [
  { key: "new", title: "Hôm nay đổi gió", link: "/the-loai" },
  { key: "series", title: "Phim bộ", link: "/list/phim-bo" },
  { key: "single", title: "Phim lẻ", link: "/list/phim-le" },
];

const monthCategories = [
  { slug: "hanh-dong", label: "Hành động" },
  { slug: "tinh-cam", label: "Tình cảm" },
  { slug: "vien-tuong", label: "Viễn tưởng" },
  { slug: "kinh-di", label: "Kinh dị" },
  { slug: "hoat-hinh", label: "Hoạt hình" },
  { slug: "phieu-luu", label: "Phiêu lưu" },
  { slug: "hai-huoc", label: "Hài hước" },
  { slug: "tam-ly", label: "Tâm lý" },
  { slug: "hinh-su", label: "Hình sự" },
  { slug: "chien-tranh", label: "Chiến tranh" },
  { slug: "co-trang", label: "Cổ trang" },
  { slug: "gia-dinh", label: "Gia đình" },
];

export default function Home() {
  const [newMovies, setNewMovies] = useState([]);
  const [seriesMovies, setSeriesMovies] = useState([]);
  const [singleMovies, setSingleMovies] = useState([]);
  const [updatedMovies, setUpdatedMovies] = useState([]);
  const [monthlyCategorySections, setMonthlyCategorySections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const monthIndex = new Date().getMonth();
  const monthlyCategories = useMemo(
    () => pickMonthlyCategories(monthCategories, monthIndex, 5),
    [monthIndex]
  );

  useEffect(() => {
    let active = true;

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const baseRequests = [
          getNewMovies({
            sort_field: "modified.time",
            sort_type: "desc",
            limit: 18,
          }),
          getSeriesMovies({ limit: 12 }),
          getSingleMovies({ limit: 12 }),
        ];
        const categoryRequests = monthlyCategories.map((category) =>
          getCategoryMovies(category.slug, { limit: 10 })
        );
        const results = await Promise.allSettled([
          ...baseRequests,
          ...categoryRequests,
        ]);

        if (!active) {
          return;
        }

        const getItems = (index) =>
          results[index].status === "fulfilled"
            ? results[index].value?.data?.items ?? []
            : [];
        const failedCount = results.filter(
          (result) => result.status === "rejected"
        ).length;

        setNewMovies(
          pickRandomMovies(
            [
              getItems(0),
              getItems(1),
              getItems(2),
              ...monthlyCategories.map((_, index) =>
                getItems(index + baseRequests.length)
              ),
            ],
            18
          )
        );
        setSeriesMovies(getItems(1));
        setSingleMovies(getItems(2));
        setUpdatedMovies(getItems(0).slice(0, 12));
        setMonthlyCategorySections(
          monthlyCategories.map((category, index) => ({
            ...category,
            items: getItems(index + baseRequests.length),
          }))
        );
        setError(
          failedCount
            ? "Một số danh sách phim chưa tải được. Vui lòng thử lại sau."
            : ""
        );
      } catch {
        if (!active) {
          return;
        }
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMovies();
    return () => {
      active = false;
    };
  }, [monthlyCategories]);

  const heroMovie = useMemo(() => newMovies[0], [newMovies]);
  const heroPoster = heroMovie
    ? buildPosterUrl(heroMovie.poster_url || heroMovie.thumb_url, heroMovie.__cdn)
    : "";
  const dataMap = {
    new: newMovies,
    series: seriesMovies,
    single: singleMovies,
  };

  return (
    <div className="space-y-10">
      <section className="hero-card">
        {heroPoster && (
          <div
            className="hero-backdrop"
            style={{ backgroundImage: `url(${heroPoster})` }}
          />
        )}
        <div className="hero-overlay" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-4">
            <div className="hero-marquee" aria-hidden="true">
              <div className="hero-marquee-track">
                <span>Làn neon đang chảy</span>
                <span>Làn neon đang chảy</span>
                <span>Làn neon đang chảy</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold glow-text">
              {heroMovie?.name || "Sẵn sàng bước vào vũ trụ phim ảnh"}
            </h2>
            <p className="text-sm text-emerald-100/70 max-w-xl">
              {heroMovie?.origin_name ||
                "Lựa chọn phim mới, phim bộ, phim lẻ, TV shows với ánh sáng neon nổi bật."}
            </p>
            <div className="flex flex-wrap gap-2">
              {heroMovie?.year && <span className="chip">{heroMovie.year}</span>}
              {heroMovie?.quality && <span className="chip">{heroMovie.quality}</span>}
              {heroMovie?.lang && <span className="chip">{heroMovie.lang}</span>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="neon-button"
                to={heroMovie ? `/movie/${heroMovie.slug}` : "/"}
              >
                Xem chi tiết
              </Link>
              <Link className="neon-button secondary" to="/list/phim-moi">
                Đổi gió hôm nay
              </Link>
            </div>
          </div>
          <div className="flex justify-center hidden sm:flex">
            {heroMovie ? (
              <div className="hero-poster hero-poster-landscape">
                <img
                  src={heroPoster}
                  alt={heroMovie?.name}
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div className="hero-placeholder">Neon Grid</div>
            )}
          </div>
        </div>
      </section>

      {error && <div className="neon-alert">{error}</div>}

      <Section
        title="Phim mới cập nhật"
        link="/list/phim-moi"
        loading={loading}
        items={updatedMovies}
        featured
      />

      {sections.map((section) => (
        <Section
          key={section.key}
          title={section.title}
          link={section.link}
          loading={loading}
          items={dataMap[section.key]}
        />
      ))}

      {monthlyCategorySections.map((category) => (
        <Section
          key={category.slug}
          title={`Thể loại tháng ${monthIndex + 1}: ${category.label}`}
          link={`/the-loai/${category.slug}`}
          loading={loading}
          items={category.items}
        />
      ))}
    </div>
  );
}

function pickMonthlyCategories(categories, monthIndex, count) {
  return categories
    .map((category, index) => ({
      ...category,
      score: seededScore(monthIndex + 1, index + 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

function seededScore(seed, value) {
  const x = Math.sin(seed * 97 + value * 131) * 10000;
  return x - Math.floor(x);
}

function pickRandomMovies(movieGroups, limit) {
  const uniqueMovies = new Map();

  movieGroups.flat().forEach((movie) => {
    const key = movie?.slug || movie?._id;
    if (key && !uniqueMovies.has(key)) {
      uniqueMovies.set(key, movie);
    }
  });

  return Array.from(uniqueMovies.values())
    .map((movie) => ({ movie, score: Math.random() }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ movie }) => movie);
}

function Section({ title, link, items, loading, featured = false }) {
  return (
    <section className={`space-y-4 ${featured ? "featured-section" : ""}`}>
      <div className="section-header">
        <h3 className="text-xl font-semibold">{title}</h3>
        <Link className="neon-link" to={link}>
          Xem tất cả
        </Link>
      </div>
      {loading ? (
        <div className="scroll-row">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="movie-skeleton flex-shrink-0"
              style={{ width: 260 }}
            />
          ))}
        </div>
      ) : (
        <div className="scroll-row">
          {items?.length ? (
            items.map((movie) => (
              <MovieCard key={movie._id || movie.slug} movie={movie} />
            ))
          ) : (
            <div className="neon-alert w-full">
              Chưa có dữ liệu cho mục này.
            </div>
          )}
        </div>
      )}
    </section>
  );
}
