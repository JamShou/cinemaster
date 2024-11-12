import React, { useState } from "react";
import MovieCard from "./MovieCard/MovieCard";
import "../styles.css";

export default function MoviesGrid({ movies, genres }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [genre, setGenre] = useState("All Genres");
  const [rating, setRating] = useState("All Ratings");

  const handleCardClick = (movie) => {
    setSelectedMovie((prevState) =>
      prevState && prevState.id === movie.id ? null : movie
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const genreMap = genres.reduce((map, g) => {
    map[g.name.toLowerCase()] = g.id;
    return map;
  }, {});

  const matchesGenre = (movie, genre) => {
    if (genre === "All Genres") return true;

    const genreId = genreMap[genre.toLowerCase()];
    return genreId && movie.genre_ids.includes(genreId);
  };

  const matchesRating = (movie, rating) => {
    switch (rating) {
      case "All Ratings":
        return true;

      case "Good":
        return movie.vote_average >= 8;

      case "Ok":
        return movie.vote_average >= 6 && movie.vote_average < 8;

      case "Bad":
        return movie.vote_average < 6;

      default:
        return false;
    }
  };

  const matchesSearchTerm = (movie) => {
    return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredMovies = movies.filter(
    (movie) =>
      matchesSearchTerm(movie) &&
      matchesGenre(movie, genre) &&
      matchesRating(movie, rating)
  );

  return (
    <div>
      <input
        type="text"
        className="search-input"
        placeholder="What do you want to watch?"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        <div className="filter-bar">
          <div className="filter-slot">
            <label>Genre</label>
            <select
              className="filter-dropdown"
              value={genre}
              onChange={handleGenreChange}
            >
              <option value="All Genres">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-slot">
            <label>Rating</label>
            <select
              className="filter-dropdown"
              value={rating}
              onChange={handleRatingChange}
            >
              <option>All Ratings</option>
              <option>Good</option>
              <option>Ok</option>
              <option>Bad</option>
            </select>
          </div>
        </div>
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              genres={genres}
              isSelected={selectedMovie && selectedMovie.id === movie.id}
              onClick={handleCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
