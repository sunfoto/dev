export default function MovieCard({ movie }) {
  return (
    <div className="w-[140px] flex-shrink-0">
      <img
        src={movie.poster_url}
        className="rounded-2xl w-full aspect-[2/3] object-cover"
      />

      <h3 className="mt-2 text-sm line-clamp-2">
        {movie.name}
      </h3>
    </div>
  );
}