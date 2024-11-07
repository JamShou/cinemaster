import React, { useState, useEffect } from "react";
import "../styles.css";

export default function MoviesGrid() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
  const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  useEffect(() => {
    // Fetch genres
    fetch(GENRES_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching genres: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setGenres(data.genres || []); // Fallback to empty array if no genres
      })
      .catch((error) => {
        console.error(error);
        setGenres([]); // Optionally, set empty array or show a message
      });
  }, []);

  useEffect(() => {
    // Fetch movies
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching movies: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setMovies(data.results || []); // Fallback to empty array if no movies
      })
      .catch((error) => {
        console.error(error);
        setMovies([]); // Optionally, set empty array or show a message
      });
  }, []);

  const getFirstGenre = (genreIds) => {
    // Return the first genre name based on the first genreId in the genreIds array
    if (genreIds.length > 0) {
      const firstGenre = genres.find((genre) => genre.id === genreIds[0]);
      return firstGenre ? firstGenre.name : "Unknown";
    }
    return "Unknown";
  };

  return (
    <div>
      {(!movies || movies.length === 0) ? (
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
                  {getFirstGenre(movie.genre_ids) || "Genre Not Found"} {/* Display the first genre */}
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
