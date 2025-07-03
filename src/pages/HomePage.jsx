import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/wk-plan-logo.png";

function HomePage() {
  return (
    <div
      className="min-h-[80vh] flex flex-col justify-center items-center px-4"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div
        className="max-w-2xl w-full rounded-2xl shadow-xl p-10 flex flex-col items-center"
        style={{
          background: "var(--color-bg-card)",
          color: "var(--color-text)",
        }}
      >
        <img
  src={logo}
  alt="WK-Plan icon"
  className="w- h-10 mb-4 mx-auto"
/>
        <h1
          className="text-4xl font-extrabold mb-3 text-center"
          style={{ color: "var(--color-accent)" }}
        >
          Welcome to WK-Plan
        </h1>
        <p className="text-lg text-center mb-6 text-[var(--color-muted)]">
          Organize your gym workouts, create custom training plans and reach your fitness goals with simplicity and motivation!
        </p>
        <div className="flex gap-4 mb-8">
          <Link
            to="/signup"
            className="px-8 py-3 rounded-xl font-bold text-lg shadow"
            style={{
              background: "var(--color-accent)",
              color: "#fff",
              transition: "background 0.2s",
            }}
            onMouseOver={e => (e.target.style.background = "var(--color-accent-dark)")}
            onMouseOut={e => (e.target.style.background = "var(--color-accent)")}
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 rounded-xl font-bold text-lg border"
            style={{
              borderColor: "var(--color-accent)",
              color: "var(--color-accent)",
              background: "var(--color-bg-card)",
            }}
            onMouseOver={e => {
              e.target.style.background = "var(--color-accent)";
              e.target.style.color = "#fff";
            }}
            onMouseOut={e => {
              e.target.style.background = "var(--color-bg-card)";
              e.target.style.color = "var(--color-accent)";
            }}
          >
            Log In
          </Link>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-4 justify-between">
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
      className="flex flex-col items-center rounded-xl p-4 flex-1 shadow-sm"
      style={{
        background: "rgba(36, 36, 36, 0.88)",
        color: "var(--color-text)",
      }}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div
        className="font-semibold mb-1"
        style={{ color: "var(--color-accent)" }}
      >
        {title}
      </div>
      <div className="text-sm text-[var(--color-muted)] text-center">{desc}</div>
    </div>
  );
}

export default HomePage;
