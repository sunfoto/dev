import { useState } from "react";

export default function VideoPlayer({ episode, onClose }) {
  const [videoError, setVideoError] = useState(false);

  if (!episode?.link_m3u8 && !episode?.link_embed) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="neon-card p-6 max-w-md text-center">
          <p className="text-emerald-100 mb-4">Không tìm thấy link phim</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white transition"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-emerald-100 hover:text-emerald-300 text-2xl font-bold z-10"
        >
          ✕
        </button>

        {/* Video container */}
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {!videoError && episode?.link_embed ? (
            <iframe
              src={episode.link_embed}
              className="w-full h-full"
              allowFullScreen
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onError={() => setVideoError(true)}
            />
          ) : !videoError && episode?.link_m3u8 ? (
            <video
              src={episode.link_m3u8}
              controls
              autoPlay
              className="w-full h-full"
              onError={() => setVideoError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-emerald-100">Không thể tải video</p>
            </div>
          )}
        </div>

        {/* Episode info */}
        <div className="mt-4 text-center">
          <p className="text-emerald-100 font-semibold">{episode?.name}</p>
        </div>
      </div>
    </div>
  );
}
