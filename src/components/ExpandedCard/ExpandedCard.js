import React from "react";
import ".//ExpandedCard.css";

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

      {/* Button container to align buttons side-by-side */}
      <div className="button-container">
        {/* YouTube Button with Logo */}
        <button
          className="trailer-button youtube"
          onClick={() =>
            window.open(
              `https://www.youtube.com/results?search_query=${movie.title}+trailer`,
              "_blank"
            )
          }
        >
          YouTube
        </button>

        {/* Amazon Button with Logo */}
        <button
          className="trailer-button amazon"
          onClick={() =>
            window.open(
              `https://www.amazon.com/s?k=${encodeURIComponent(
                movie.title
              )}+Movie&ref=nb_sb_noss`,
              "_blank"
            )
          }
        >
          Amazon
        </button>

        {/* Google Play Store Button with Logo */}
        <button
          className="trailer-button google"
          onClick={() =>
            window.open(
              `https://play.google.com/store/search?q=${encodeURIComponent(
                movie.title
              )}&c=movies&hl=en_US`,
              "_blank"
            )
          }
        >
          Google Play Store
        </button>
      </div>
    </div>
  );
}
