import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function Exercises() {
  // State to store exercises fetched from the backend
  const [exercises, setExercises] = useState([]);
  // State for category filter
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  // Fetch exercises on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_URL}/exercises`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setExercises(data);
      })
      .catch(() => {
        alert("Error fetching exercises");
      });
  }, []);

  // Extract and sort unique categories for the filter dropdown
  const categories = Array.from(new Set(exercises.map((ex) => ex.category))).sort();

  // Filter exercises by selected category if filter is set
  const filteredExercises = filter
    ? exercises.filter((ex) => ex.category === filter)
    : exercises;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-4 pt-10">
      <div
        className="min-h-[80vh] max-h-[80vh] overflow-y-auto overflow-x-hidden my-scrollbar px-4 sm:px-6 relative"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        {/* Sticky Header with title and add button */}
        <div
          className="sticky top-0 z-10 py-4"
          style={{ backgroundColor: "var(--color-bg)" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h1
              className="text-4xl font-extrabold text-left"
              style={{ color: "var(--color-accent)" }}
            >
              Exercises
            </h1>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded font-semibold border border-[var(--color-accent)] text-[var(--color-accent)] bg-white hover:bg-[var(--color-accent)] hover:text-white transition shadow"
              onClick={() => navigate("/dashboard/add-exercise")}
            >
              <FaPlusCircle />
              Add Exercise
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
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
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
