import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../api/ophim";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        if (!active) {
          return;
        }
        setCategories(Array.isArray(data) ? data : []);
        setError("");
      } catch {
        if (!active) {
          return;
        }
        setError("Khong the tai danh sach the loai.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
          Danh muc
        </p>
        <h2 className="text-2xl md:text-3xl font-semibold glow-text">
          The loai
        </h2>
      </div>

      {error && <div className="neon-alert">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="movie-skeleton h-14" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((item) => (
            <Link
              key={item._id}
              to={`/the-loai/${item.slug}`}
              className="neon-card px-4 py-3 flex items-center justify-between"
            >
              <span className="font-semibold text-emerald-100">
                {item.name}
              </span>
              <span className="chip">Xem</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
