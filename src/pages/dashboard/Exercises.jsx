import React, { useEffect, useState } from "react";

function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(""); // categoria selecionada

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
    <div
      className="min-h-[80vh] max-h-[80vh] overflow-y-auto my-scrollbar px-4 py-6 max-w-6xl mx-auto"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <h1
        className="text-3xl font-bold mb-8 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Exercises
      </h1>

      <div className="mb-8 flex justify-center">
        <label
          htmlFor="filter"
          className="mr-3 font-semibold"
          style={{ color: "var(--color-text)" }}
        >
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
          <option
            value=""
            style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
          >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExercises.map((ex) => (
          <div
            key={ex._id}
            className="rounded-xl shadow-md p-6 flex flex-col items-center"
            style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
          >
            <img
              src={ex.mediaUrl}
              alt={ex.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150?text=Exercise";
              }}
            />
            <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--color-accent)" }}>
              {ex.name}
            </h2>
            <p className="font-medium mb-2" style={{ color: "var(--color-accent)" }}>
              {ex.category}
            </p>
            <p className="text-sm text-center mb-2" style={{ color: "var(--color-text)" }}>
              {ex.description}
            </p>
            {ex.duration && (
              <p className="text-xs mt-auto" style={{ color: "var(--color-muted)" }}>
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
