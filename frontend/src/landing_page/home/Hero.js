import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <img
          src="media/images/homeHero.png"
          alt="Hero Image"
          className="mb-5 img-fluid mx-auto"
          style={{ maxWidth: "800px" }}
        />
        <h1 className="mt-5">Invest in everything</h1>
        <p className="text-muted">
          Online platform to invest in stocks, derivatives, mutual funds, and
          more
        </p>
        <Link
          to="/signup"
          className="p-2 btn btn-primary fs-5 mb-5"
          style={{ width: "20%", minWidth: "180px", margin: "0 auto", backgroundColor: "#387ed1", borderColor: "#387ed1" }}
        >
          Signup Now
        </Link>
      </div>
    </div>
  );
}

export default Hero;
