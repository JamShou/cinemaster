import "./App.css";
import "./styles.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MoviesGrid from "./components/MoviesGrid";
import Watchlist from "./components/Watchlist";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

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

function App() {
  const [page, setPage] = useState(1); // Track current page

  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  if (!API_KEY) console.error("API key is missing!");

  const GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const genreData = await fetchData(GENRES_URL);
      const movieData = await fetchData(API_URL);
      if (genreData) {
        setGenres(genreData.genres || []);
      }
      if (movieData) {
        setMovies(movieData.results || []);
      }
    };
    fetchAllData();
  }, [API_URL, GENRES_URL, page]);

  const toggleWatchlist = (movieId) => {
    setWatchlist((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // Go to next page
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1); // Prevent going to page 0
  };

  return (
    <div className="App">
      <div className="container">
        <Header />
        <Router>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/watchlist">Watchlist</Link>
              </li>
            </ul>
          </nav>
          {/* Check for movies and show an error message if empty */}
          {movies && movies.length === 0 ? (
            <p className="error-message">
              Check API Key: Movies could not be loaded
            </p>
          ) : (
            <Routes>
              <Route
                path="/"
                element={
                  <MoviesGrid
                    movies={movies}
                    genres={genres}
                    watchlist={watchlist}
                    toggleWatchlist={toggleWatchlist}
                  />
                }
              />
              <Route
                path="/watchlist"
                element={
                  <Watchlist
                    movies={movies}
                    watchlist={watchlist}
                    genres={genres}
                    toggleWatchlist={toggleWatchlist}
                  />
                }
              />
            </Routes>
          )}
        </Router>
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>

      <Footer />
    </div>
  );
}

export default App;
