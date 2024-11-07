import React, { useState, useEffect } from "react";
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
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  if (!API_KEY) {
    console.error("API key is missing!");
  }

  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
  const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  useEffect(() => {
    const fetchAllData = async () => {
      const genreData = await fetchData(GENRES_URL);
      const movieData = await fetchData(API_URL);
      if (genreData) setGenres(genreData.genres || []);
      if (movieData) setMovies(movieData.results || []);
    };
    fetchAllData();
  }, [API_URL, GENRES_URL]);

  const getFirstGenre = (genreIds) => {
    if (genreIds.length > 0) {
      const firstGenre = genres.find((genre) => genre.id === genreIds[0]);
      return firstGenre ? firstGenre.name : "Unknown";
    }
    return "Unknown";
  };

  return (
    <div>
      {movies.length === 0 ? (
        <p className="error-message">Check API Key: Movies could not be loaded</p>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-genre">
                  {getFirstGenre(movie.genre_ids) || "Genre Not Found"}
                </p>
                <p className="movie-card-rating">
                  {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
