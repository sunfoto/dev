import { useEffect, useState } from "react";
import { getNewMovies } from "../api/ophim";
import MovieCard from "../components/MovieCard";

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const data = await getNewMovies();
    setMovies(data.data.items);
  };

  return (
    <div className="p-4">

      <h1 className="text-2xl font-bold mb-4">
        Phim mới
      </h1>

      <div className="flex gap-4 overflow-x-auto">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
          />
        ))}
      </div>

    </div>
  );
}