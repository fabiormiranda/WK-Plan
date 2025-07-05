import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/wk-plan-logo.png";

function HomePage() {
  return (
    <div
      className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-[var(--color-bg)] text-[var(--color-text)]"
    >
      <div
        className="max-w-2xl w-full rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center bg-[var(--color-bg-card)] text-[var(--color-text)]"
      >
        <img
          src={logo}
          alt="WK-Plan icon"
          className="w-24 sm:w-28 mb-6 mx-auto"
        />
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-[var(--color-accent)]"
        >
          Welcome to WK-Plan
        </h1>
        <p className="text-base sm:text-lg text-center mb-8 text-[var(--color-muted)] max-w-xl">
          Organize your gym workouts, create custom training plans and reach your fitness goals with simplicity and motivation!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center">
          <Link
            to="/signup"
            className="px-10 py-3 rounded-xl font-bold text-lg shadow bg-[var(--color-accent)] text-white text-center transition-colors duration-200 hover:bg-[var(--color-accent-dark)]"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-10 py-3 rounded-xl font-bold text-lg border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-bg-card)] text-center transition-colors duration-200 hover:bg-[var(--color-accent)] hover:text-white"
          >
            Log In
          </Link>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-6 justify-between">
          <Feature icon="💪" title="Personalized Plans" desc="Build workout plans tailored for you" />
          <Feature icon="📅" title="Easy Scheduling" desc="Plan your sessions and track progress" />
          <Feature icon="📱" title="Access Anywhere" desc="Responsive design for mobile & desktop" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl p-6 flex-1 shadow-sm bg-[rgba(36,36,36,0.88)] text-[var(--color-text)]"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-semibold mb-2 text-[var(--color-accent)] text-center">{title}</div>
      <div className="text-sm text-[var(--color-muted)] text-center">{desc}</div>
    </div>
  );
}

export default HomePage;
