import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { getCategories } from "../api/ophim";

const navItems = [
  { label: "Trang chủ", to: "/" },
  { label: "Phim mới", to: "/list/phim-moi" },
  { label: "Phim bộ", to: "/list/phim-bo" },
  { label: "Phim lẻ", to: "/list/phim-le" },
  { label: "TV Shows", to: "/list/tv-shows" },
  { label: "Hoạt hình", to: "/list/hoat-hinh" },
  { label: "Thể loại", to: "/the-loai" },
];

export default function Layout() {
  const [keyword, setKeyword] = useState("");
  const [isCompact, setIsCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);
  const monthTheme = useMemo(() => getMonthTheme(new Date()), []);
  const headerCategories = useMemo(
    () => (Array.isArray(categories) ? categories.slice(0, 10) : []),
    [categories]
  );

  // Đóng menu khi đổi route
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  // Khoá scroll body khi mobile menu mở
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Compact header chỉ áp dụng trên desktop (>= 1024px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 1024) {
        setIsCompact(window.scrollY > 120);
      }
      setShowScrollTop(window.scrollY > 420);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset compact khi resize về mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCompact(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    applyTheme(monthTheme);
  }, [monthTheme]);

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

  // F8 toggle chỉ trên desktop
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "F8" && window.innerWidth >= 1024) {
        event.preventDefault();
        setIsCompact((prev) => !prev);
      }
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = keyword.trim();
    if (!value) return;
    navigate(`/search?keyword=${encodeURIComponent(value)}`);
    setKeyword("");
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-bg">
      {/* ── Header ── */}
      <header className={`site-header ${isCompact ? "site-header-compact" : ""}`}>
        <div className="mx-auto w-full max-w-6xl px-4 py-2 flex items-center justify-between gap-3">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0" aria-label="Trang chủ Neon Stream">
            <div className="logo-badge">NS</div>
            {!isCompact && (
              <div className="hidden sm:block">
                <h1 className="header-title">Neon Stream</h1>
                <p className="header-subtitle">Rạp phim neon</p>
              </div>
            )}
          </NavLink>

          {/* Compact search — desktop */}
          {isCompact && (
            <form
              onSubmit={handleSubmit}
              className="search-bar hidden lg:flex flex-1 max-w-sm"
            >
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm phim..."
                className="search-input"
                aria-label="Tìm kiếm phim"
              />
              <button type="submit" className="search-button">Tìm</button>
            </form>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search icon button — mobile only */}
            <button
              type="button"
              className="icon-button lg:hidden"
              aria-label="Tìm kiếm"
              onClick={() => {
                setSearchFocused((v) => !v);
                setMobileMenuOpen(false);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="icon-button lg:hidden"
              aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                setMobileMenuOpen((v) => !v);
                setSearchFocused(false);
              }}
            >
              {mobileMenuOpen ? (
                /* X icon */
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                /* Hamburger icon */
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  aria-hidden="true">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search bar mở rộng — mobile */}
        {searchFocused && (
          <div className="lg:hidden px-4 pb-3">
            <form onSubmit={handleSubmit} className="search-bar w-full">
              <input
                ref={searchInputRef}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm phim..."
                className="search-input"
                aria-label="Tìm kiếm phim"
              />
              <button type="submit" className="search-button">Tìm</button>
            </form>
          </div>
        )}

        {/* Nav bar — desktop (hiển thị khi không compact) */}
        {!isCompact && (
          <nav className="hidden lg:block border-t border-emerald-400/10" aria-label="Điều hướng chính">
            <div className="nav-row mx-auto w-full max-w-6xl px-4 py-3 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-link-active" : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="nav-row nav-row-secondary mx-auto w-full max-w-6xl px-4 pb-3 flex flex-wrap gap-2">
              {headerCategories.length > 0 ? (
                headerCategories.map((item) => (
                  <NavLink
                    key={item._id}
                    to={`/the-loai/${item.slug}`}
                    className="nav-chip"
                  >
                    {item.name}
                  </NavLink>
                ))
              ) : (
                <span className="text-xs text-emerald-200/60">
                  Dang tai the loai...
                </span>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* ── Mobile drawer overlay ── */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-overlay lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      <nav
        className={`mobile-drawer lg:hidden ${mobileMenuOpen ? "mobile-drawer-open" : ""}`}
        aria-label="Menu điều hướng"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-inner">
          {/* Nav chính */}
          <div className="mobile-drawer-section">
            <p className="mobile-drawer-label">Danh mục</p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? "mobile-nav-link-active" : ""}`
                }
                tabIndex={mobileMenuOpen ? 0 : -1}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Divider */}
          <div className="mobile-drawer-divider" />

          {/* Thể loại */}
          <div className="mobile-drawer-section">
            <p className="mobile-drawer-label">Thể loại</p>
            <div className="mobile-chips-grid">
              {categories.length > 0 ? (
                categories.map((item) => (
                  <NavLink
                    key={item._id}
                    to={`/the-loai/${item.slug}`}
                    className="nav-chip"
                    tabIndex={mobileMenuOpen ? 0 : -1}
                  >
                    {item.name}
                  </NavLink>
                ))
              ) : (
                <span className="text-xs text-emerald-200/60">
                  Dang tai the loai...
                </span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main content ── */}
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      {showScrollTop && (
        <button
          type="button"
          className="scroll-top-button"
          aria-label="Lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ── Utilities (không thay đổi) ──

function getMonthTheme(date) {
  const palettes = [
    { neon: "#2bff77", neonSoft: "#8bffc1", bg0: "#050807", bg1: "#0b1411", bg2: "#0f1f18" },
    { neon: "#34f3ff", neonSoft: "#9ff7ff", bg0: "#03090b", bg1: "#071b20", bg2: "#0a2a30" },
    { neon: "#ffd447", neonSoft: "#ffe7a0", bg0: "#0a0804", bg1: "#161107", bg2: "#251a08" },
    { neon: "#ff6adf", neonSoft: "#ffb4ef", bg0: "#10060f", bg1: "#1c0b1a", bg2: "#2a0e24" },
    { neon: "#7dfffd", neonSoft: "#bffefc", bg0: "#020b0b", bg1: "#082020", bg2: "#0c2e2e" },
    { neon: "#a4ff6a", neonSoft: "#d7ffb0", bg0: "#060b05", bg1: "#0d160a", bg2: "#13200e" },
    { neon: "#ff7a5c", neonSoft: "#ffc1b1", bg0: "#0e0503", bg1: "#1f0c07", bg2: "#2f120a" },
    { neon: "#6a8bff", neonSoft: "#b4c7ff", bg0: "#05060c", bg1: "#0c1020", bg2: "#121836" },
    { neon: "#7dffb2", neonSoft: "#c8ffe2", bg0: "#050a07", bg1: "#0d1812", bg2: "#122317" },
    { neon: "#ff9f43", neonSoft: "#ffd3a6", bg0: "#100804", bg1: "#1d0f07", bg2: "#2a1508" },
    { neon: "#52ff9c", neonSoft: "#aefed0", bg0: "#040907", bg1: "#0a1710", bg2: "#0f2216" },
    { neon: "#ff5e7a", neonSoft: "#ffb7c4", bg0: "#0e0407", bg1: "#1a0b10", bg2: "#2a1018" },
  ];
  return palettes[date.getMonth() % palettes.length];
}

function applyTheme(theme) {
  const root = document.documentElement;
  const rgb = hexToRgb(theme.neon);
  root.style.setProperty("--neon", theme.neon);
  root.style.setProperty("--neon-soft", theme.neonSoft);
  if (rgb) {
    root.style.setProperty("--neon-rgb", rgb.join(","));
    root.style.setProperty("--neon-dim", `rgba(${rgb.join(",")}, 0.15)`);
  }
  root.style.setProperty("--bg-0", theme.bg0);
  root.style.setProperty("--bg-1", theme.bg1);
  root.style.setProperty("--bg-2", theme.bg2);
}

function hexToRgb(hex) {
  if (!hex?.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) return null;
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const bigint = parseInt(normalized.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
