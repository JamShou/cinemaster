// MoviesGrid.js
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
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
  const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  if (!API_KEY) console.error("API key is missing!");

  useEffect(() => {
    const fetchAllData = async () => {
      const genreData = await fetchData(GENRES_URL);
      const movieData = await fetchData(API_URL);
      if (genreData) setGenres(genreData.genres || []);
      if (movieData) setMovies(movieData.results || []);
    };
    fetchAllData();
  }, [API_URL, GENRES_URL]);

  const handleCardClick = (movie) => {
    setSelectedMovie((prevState) =>
      prevState && prevState.id === movie.id ? null : movie
    );
  };

  return (
    <div>
      {movies.length === 0 ? (
        <p className="error-message">
          Check API Key: Movies could not be loaded
        </p>
      ) : (
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
      )}
    </div>
  );
}
