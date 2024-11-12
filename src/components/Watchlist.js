import React, { useState } from "react";
import "../styles.css";
import MovieCard from "./MovieCard/MovieCard";

export default function Watchlist({
  movies,
  genres,
  watchlist,
  toggleWatchlist,
}) {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleCardClick = (movie) => {
    setSelectedMovie((prevState) =>
      prevState && prevState.id === movie.id ? null : movie
    );
  };

  return (
    <div>
      <h1 className="title">Your Watchlist</h1>
      <div className="watchlist">
        {watchlist.map((id) => {
          const movie = movies.find((movie) => movie.id === id);
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              genres={genres}
              isSelected={selectedMovie && selectedMovie.id === movie.id}
              onClick={handleCardClick}
              isWatchlisted={true}
              toggleWatchlist={toggleWatchlist}
            ></MovieCard>
          );
        })}
      </div>
    </div>
  );
}
