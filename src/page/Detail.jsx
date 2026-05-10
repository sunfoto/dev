import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetail } from "../api/ophim";
import { buildPosterUrl } from "../utils/media";
import VideoPlayer from "../components/VideoPlayer";

export default function Detail() {
  const { slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [expandedServer, setExpandedServer] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetail(slug);
        if (!active) {
          return;
        }
        setMovie(data?.data?.item ?? null);
        setError("");
      } catch {
        if (!active) {
          return;
        }
        setError("Không thể tải chi tiết phim.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="movie-skeleton h-[320px]" />;
  }

  if (error) {
    return <div className="neon-alert">{error}</div>;
  }

  if (!movie) {
    return <div className="neon-alert">Không tìm thấy phim.</div>;
  }

  const poster = buildPosterUrl(movie.poster_url || movie.thumb_url, movie.__cdn);
  const showImage = poster && !imgError;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="detail-card">
        <div className="detail-glow" />
        <div className="relative z-10 grid gap-6 lg:grid-cols-[200px_1fr] items-start">
          {/* Poster */}
          <div className="movie-poster detail-poster h-fit sticky top-4">
            {showImage ? (
              <img
                src={poster}
                alt={movie.name}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="poster-fallback">Không có ảnh</div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Chi tiết phim
              </p>
              <h2 className="text-2xl font-semibold glow-text">{movie.name}</h2>
              <p className="text-sm text-emerald-100/70">
                {movie.origin_name || "Đang cập nhật"}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="chip">{movie.year || "Năm ?"}</span>
              {movie.type && <span className="chip">{movie.type}</span>}
              {movie.quality && <span className="chip">{movie.quality}</span>}
              {movie.lang && <span className="chip">{movie.lang}</span>}
            </div>

            {/* Description */}
            {movie.content && (
              <div className="text-sm text-emerald-50/70 leading-relaxed line-clamp-3">
                <div
                  className="content-html"
                  dangerouslySetInnerHTML={{ __html: movie.content }}
                />
              </div>
            )}

            {/* Watch Button */}
            {movie.episodes?.length > 0 && (
              <button
                onClick={() => {
                  const firstEpisode = movie.episodes[0].server_data?.[0];
                  if (firstEpisode) setSelectedEpisode(firstEpisode);
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-emerald-500/50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <polygon points="5 3 5 17 17 10" />
                </svg>
                Xem Phim
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Episodes Section */}
      {movie.episodes?.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold glow-text">Tập phim</h3>
          <div className="space-y-2">
            {movie.episodes.map((server) => (
              <div key={server.server_name} className="neon-card">
                {/* Server Header */}
                <button
                  onClick={() =>
                    setExpandedServer(
                      expandedServer === server.server_name ? null : server.server_name
                    )
                  }
                  className="w-full px-4 py-2 flex items-center justify-between hover:bg-emerald-900/20 transition"
                >
                  <p className="text-sm font-semibold text-emerald-100">
                    {server.server_name}
                  </p>
                  <svg
                    className={`w-4 h-4 text-emerald-400 transition-transform ${
                      expandedServer === server.server_name ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Episode List */}
                {expandedServer === server.server_name && (
                  <div className="px-4 py-3 border-t border-emerald-900/30 flex flex-wrap gap-2">
                    {server.server_data?.map((episode) => (
                      <button
                        key={episode.name}
                        onClick={() => setSelectedEpisode(episode)}
                        className="px-3 py-1.5 bg-emerald-900/40 hover:bg-emerald-600 text-emerald-100 text-xs rounded transition flex items-center gap-1.5 group"
                      >
                        <svg className="w-3.5 h-3.5 group-hover:scale-110 transition" fill="currentColor" viewBox="0 0 20 20">
                          <polygon points="5 3 5 17 17 10" />
                        </svg>
                        {episode.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Video Player Modal */}
      {selectedEpisode && (
        <VideoPlayer
          episode={selectedEpisode}
          onClose={() => setSelectedEpisode(null)}
        />
      )}
    </div>
  );
};
