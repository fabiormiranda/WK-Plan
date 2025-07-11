import React from "react";

/**
 * DashboardHome component
 * Displays a quick overview grid of exercises on the dashboard homepage.
 * Accepts a prop `exercises` (array of exercise objects) for listing.
 */
function DashboardHome({ exercises }) {
  return (
    <div style={{ color: "var(--color-text)" }}>
      {/* Page Title */}
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: "var(--color-accent)" }}
      >
        Exercises
      </h1>

      {/* Grid displaying exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {exercises && exercises.length > 0 ? (
          exercises.map((ex) => (
            <div
              key={ex._id || ex.id}
              className="p-4 rounded shadow"
              style={{ backgroundColor: "var(--color-bg-card)" }}
            >
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--color-accent)" }}
              >
                {ex.name}
              </h3>
              <p>{ex.description || "No description provided."}</p>
            </div>
          ))
        ) : (
          <p>No exercises found.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardHome;
