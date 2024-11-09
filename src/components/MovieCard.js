// MovieCard.js
import React from "react";
import ExpandedCard from "./ExpandedCard"; 

const getGenreName = (genreIds, genres) => {
  if (genreIds.length > 0) {
    const genre = genres.find((genre) => genre.id === genreIds[0]);
    return genre ? genre.name : "Unknown";
  }
  return "Unknown";
};

export default function MovieCard({ movie, genres, isSelected, onClick }) {
  return (
    <div
      className={`movie-card ${isSelected ? "expanded" : ""}`}
      onClick={() => onClick(movie)} // Handle click to expand the card
    >
      <img
        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
        alt={movie.title}
      />
      <div className="movie-card-info">
        <h3 className="movie-card-title">{movie.title}</h3>
        <p className="movie-card-genre">
          {getGenreName(movie.genre_ids, genres) || "Genre Not Found"}
        </p>
        <p className="movie-card-rating">
          {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </p>
      </div>
      {isSelected && <ExpandedCard movie={movie} />} {/* Render ExpandedCard here */}
    </div>
  );
}
