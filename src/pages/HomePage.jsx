import React from "react";
import { Link } from "react-router-dom";
import { FaDumbbell, FaCalendarAlt, FaMobileAlt } from "react-icons/fa";

// HomePage component for the public landing page of WK-Plan
function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="max-w-2xl w-full rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center bg-[var(--color-bg-card)]">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-[var(--color-accent)]">
          Welcome to WK-Plan
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-center mb-8 text-[var(--color-muted)] max-w-xl">
          Organize your gym workouts, create custom training plans, and reach your fitness goals with simplicity and motivation!
        </p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full justify-center">
          <Link
            to="/signup"
            className="px-8 sm:px-10 py-3 rounded-xl font-semibold text-lg shadow bg-[var(--color-accent)] text-white text-center transition hover:bg-[var(--color-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 sm:px-10 py-3 rounded-xl font-semibold text-lg border border-[var(--color-accent)] text-[var(--color-accent)] bg-[var(--color-bg-card)] text-center transition hover:bg-[var(--color-accent)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          >
            Log In
          </Link>
        </div>

        {/* Feature cards */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
          <Feature
            icon={<FaDumbbell size={36} className="text-white" />}
            title="Personalized Plans"
            desc="Build workout plans tailored for you"
          />
          <Feature
            icon={<FaCalendarAlt size={36} className="text-white" />}
            title="Easy Scheduling"
            desc="Plan your sessions effortlessly"
          />
          <Feature
            icon={<FaMobileAlt size={36} className="text-white" />}
            title="Access Anywhere"
            desc="Use on mobile & desktop seamlessly"
          />
        </div>
      </div>
    </div>
  );
}

// Feature card component for the HomePage
function Feature({ icon, title, desc }) {
  return (
    <div
      className="
        flex flex-col items-center rounded-xl p-5 sm:p-6 flex-1 shadow
        bg-[var(--color-bg-card)] text-[var(--color-text)]
        border border-transparent
        transition-transform transform hover:scale-105 hover:shadow-[0_0_10px_var(--color-accent)] hover:border-[var(--color-accent)]
      "
    >
      {/* Icon */}
      <div className="mb-3">{icon}</div>

      {/* Feature title */}
      <div className="font-semibold mb-2 text-[var(--color-accent)] text-center text-base sm:text-lg">
        {title}
      </div>

      {/* Feature description */}
      <div className="text-xs sm:text-sm text-[var(--color-muted)] text-center max-w-[180px]">
        {desc}
      </div>
    </div>
  );
}

export default HomePage;
