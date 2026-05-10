import { Link } from "react-router-dom";
import { useState } from "react";
import { buildPosterUrl } from "../utils/media";

export default function MovieCard({ movie, size = "md", variant = "scroll" }) {
  const [imgError, setImgError] = useState(false);
  const poster = buildPosterUrl(movie?.poster_url || movie?.thumb_url, movie?.__cdn);
  const isGrid = variant === "grid";
  const cardSize = !isGrid ? (size === "lg" ? "w-[320px]" : "w-[260px]") : "";
  const showImage = poster && !imgError;

  return (
    <Link
      to={`/movie/${movie.slug}`}
      className={`movie-card ${isGrid ? "movie-card-grid" : "movie-card-scroll"} ${cardSize}`}
    >
      <div className="movie-poster">
        {showImage ? (
          <img
            src={poster}
            alt={movie?.name}
            loading="lazy"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="poster-fallback">Không có ảnh</div>
        )}
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold line-clamp-2">
          {movie?.name}
        </h3>
        <p className="text-xs text-emerald-200/80">
          {movie?.year ? `Năm ${movie.year}` : "Đang cập nhật"}
        </p>
      </div>
    </Link>
  );
}
