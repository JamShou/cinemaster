import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard/MovieCard";
import "../styles.css";

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default function MoviesGrid() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [page, setPage] = useState(1); // Track current page
  const [searchTerm, setSearchTerm] = useState("");

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  if (!API_KEY) console.error("API key is missing!");

  // Dynamic API URL based on the page
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

  const [genre, setGenre] = useState("All Genres");
  const [rating, setRating] = useState("All");

  useEffect(() => {
    const fetchAllData = async () => {
      const genreData = await fetchData(GENRES_URL);
      const movieData = await fetchData(API_URL);
      if (genreData) setGenres(genreData.genres || []);
      if (movieData) setMovies(movieData.results || []);
    };
    fetchAllData();
  }, [API_URL, GENRES_URL, page]); // Dependency on page for API call

  const handleCardClick = (movie) => {
    setSelectedMovie((prevState) =>
      prevState && prevState.id === movie.id ? null : movie
    );
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // Go to next page
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1); // Prevent going to page 0
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
      case "All":
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

  const matchesSearchTerm = (movie, genre) => {
    return movie.title.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredMovies = movies.filter(
    (movie) =>
      matchesSearchTerm(movie, searchTerm) &&
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
        {movies.length === 0 ? (
          <p className="error-message">
            Check API Key: Movies could not be loaded
          </p>
        ) : (
          <>
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
                  <option>All</option>
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

            {/* Pagination controls */}
            <div className="pagination">
              <button onClick={handlePrevPage} disabled={page === 1}>
                Previous
              </button>
              <span>Page {page}</span>
              <button onClick={handleNextPage}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
