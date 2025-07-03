import React, { useEffect, useState } from "react";
import axios from "axios";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(""); // categoria selecionada

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exercises")
      .then((res) => {
        setExercises(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        alert("Error fetching exercises");
      });
  }, []);

  // Extrair categorias únicas dos exercícios
  const categories = Array.from(new Set(exercises.map((ex) => ex.category))).sort();

  // Filtrar exercícios conforme categoria
  const filteredExercises = filter
    ? exercises.filter((ex) => ex.category === filter)
    : exercises;

  if (loading)
    return (
      <div className="p-6" style={{ color: "var(--color-text)" }}>
        Loading exercises...
      </div>
    );

  return (
    <div className="p-6" style={{ color: "var(--color-text)", backgroundColor: "var(--color-bg)" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-accent)" }}>
        Exercises
      </h1>

      {/* Dropdown para filtrar por categoria */}
      <div className="mb-6">
        <label htmlFor="filter" className="mr-2 font-semibold" style={{ color: "var(--color-text)" }}>
          Filter by category:
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text)",
            borderColor: "var(--color-accent)",
          }}
        >
          <option value="" style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}>
            All
          </option>
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
              style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
            >
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex) => (
          <div
            key={ex._id}
            className="rounded-xl shadow-md p-4 flex flex-col items-center"
            style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
          >
            <img
              src={ex.mediaUrl}
              alt={ex.name}
              className="w-full h-32 object-cover rounded mb-3"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=Exercise";
              }}
            />
            <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--color-accent)" }}>
              {ex.name}
            </h2>
            <p className="font-medium mb-1" style={{ color: "var(--color-accent)" }}>
              {ex.category}
            </p>
            <p className="text-sm text-center" style={{ color: "var(--color-text)" }}>
              {ex.description}
            </p>
            {ex.duration && (
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                Duration: {ex.duration}
                {typeof ex.duration === "number" && ex.category === "Cardio" ? " min" : " sec"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exercises;
