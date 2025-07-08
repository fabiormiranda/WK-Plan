import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/exercises", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Error fetching exercises");
      });
  }, []);

  const categories = Array.from(new Set(exercises.map((ex) => ex.category))).sort();

  const filteredExercises = filter
    ? exercises.filter((ex) => ex.category === filter)
    : exercises;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center text-[var(--color-text)]">
        Loading exercises...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pb-4 pt-10">
      <div
        className="min-h-[80vh] max-h-[80vh] overflow-y-auto overflow-x-hidden my-scrollbar px-4 sm:px-6"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <h1
          className="text-4xl font-extrabold mb-6 text-left"
          style={{ color: "var(--color-accent)" }}
        >
          Exercises
        </h1>

        <div className="mb-6 mt-4 flex flex-wrap items-center gap-2">
          <label
            htmlFor="filter"
            className="font-medium text-left"
            style={{ color: "var(--color-text)" }}
          >
            Filter by Category:
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-lg border text-sm"
            style={{
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text)",
              borderColor: "var(--color-accent)",
            }}
          >
            <option
              value=""
              style={{
                backgroundColor: "var(--color-bg-card)",
                color: "var(--color-text)",
              }}
            >
              All
            </option>
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
                style={{
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text)",
                }}
              >
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((ex) => (
            <Link
              key={ex._id}
              to={`/dashboard/exercises/${ex.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-xl shadow-md p-4 flex flex-col items-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "#181818", color: "var(--color-text)" }}
            >
              <img
                src={ex.mediaUrl}
                alt={ex.name}
                className="w-full h-48 object-cover rounded-xl mb-3 transition-opacity"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Exercise";
                }}
              />
              <h2 className="text-lg font-semibold mb-1 text-white text-center">
                {ex.name}
              </h2>
              <p className="text-sm text-[var(--color-accent)] text-center">
                {ex.category}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Exercises;
