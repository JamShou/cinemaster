// ExpandedCard.js
import React from "react";

export default function ExpandedCard({ movie }) {
  return (
    <div
      className="expanded-card-overlay"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div>
        <h2>{movie.title}</h2>
      </div>
      <p>{movie.overview}</p>
      <button
        className="trailer-button"
        onClick={() =>
          window.open(
            `https://www.youtube.com/results?search_query=${movie.title}+trailer`,
            "_blank"
          )
        }
      >
        Find Trailer on YouTube
      </button>
    </div>
  );
}
