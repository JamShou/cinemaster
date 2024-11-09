import React from "react";
import "../styles.css";

export default function Header() {

  const logo = process.env.PUBLIC_URL + "/images/logo.png"

  return (
    <div className="header">
      <img className="logo" src={logo} alt="moviedux " />
      <h2 className="app-subtitle">
        It's time for popcorn! Find your next movie here!
      </h2>
    </div>
  );
}
