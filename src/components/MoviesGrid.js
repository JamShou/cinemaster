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

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  if (!API_KEY) console.error("API key is missing!");

  // Dynamic API URL based on the page
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

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

  return (
    <div>
      {movies.length === 0 ? (
        <p className="error-message">
          Check API Key: Movies could not be loaded
        </p>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map((movie) => (
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
  );
}
