import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function MyPlanDetail() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:5000/api/workout-plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlan(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
        setDifficulty(res.data.difficulty || "easy");
        setSelectedExercises(res.data.exercises.map((ex) => ex._id));
      });

    axios.get("http://localhost:5000/api/exercises").then((res) => setAllExercises(res.data));
  }, [planId]);

  const handleCheckboxChange = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId]
    );
  };

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/workout-plans/${planId}`,
      { title, description, difficulty, exercises: selectedExercises },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Plan updated!");
    setEditMode(false);
    const res = await axios.get(`http://localhost:5000/api/workout-plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPlan(res.data);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/workout-plans/${planId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Plan deleted!");
    navigate("/dashboard/my-plans");
  };

  const categories = Array.from(new Set(allExercises.map((ex) => ex.category))).sort();

  const filteredExercises = categoryFilter
    ? allExercises.filter((ex) => ex.category.toLowerCase() === categoryFilter.toLowerCase())
    : allExercises;

  if (!plan)
    return (
      <div className="p-6 pt-20 text-center text-base" style={{ color: "var(--color-text)" }}>
        Loading plan...
      </div>
    );

  return (
    <div
      className="max-w-4xl mx-auto mt-8 px-6 pt-12 pb-12 rounded-lg shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-[var(--color-accent)]">
        Workout Plan Details
      </h1>

      {!editMode ? (
        <>
          {/* Plan Info */}
          <section className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 text-[var(--color-accent)]">{plan.title}</h2>
            <p className="text-base mb-1 text-[var(--color-muted)] italic">
              {plan.description || "No description provided."}
            </p>
            <p className="text-sm">
              Difficulty: <span style={{ color: "var(--color-accent)" }}>{plan.difficulty}</span>
            </p>
          </section>

          {/* Exercises */}
          <section className="mb-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[var(--color-accent)]">Exercises</h3>
            {plan.exercises.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plan.exercises.map((ex) => (
                  <div
                    key={ex._id}
                    onClick={() => setSelectedExercise(ex)}
                    className="flex items-center gap-3 bg-[var(--color-bg)] rounded-lg p-3 shadow hover:shadow-md hover:scale-[1.01] transition cursor-pointer"
                  >
                    <img
                      src={ex.mediaUrl || "/assets/placeholder.png"}
                      alt={ex.name}
                      onError={(e) => (e.target.src = "/assets/placeholder.png")}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex flex-col justify-center">
                      <p className="text-base font-medium text-[var(--color-text)]">{ex.name}</p>
                      <p className="text-sm text-[var(--color-muted)]">{ex.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="italic text-[var(--color-muted)]">No exercises added to this plan.</p>
            )}
          </section>

          {/* Workout Dates */}
          <section className="mb-8">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[var(--color-accent)]">Workout Dates</h3>
            {plan.dates && plan.dates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {plan.dates.map((date) => (
                  <span
                    key={date}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)] text-white shadow transition transform hover:scale-105"
                  >
                    {formatDate(date)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="italic text-[var(--color-muted)]">No workout dates set.</p>
            )}
          </section>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              className="px-5 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition text-sm"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
            <button
              className="px-5 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800 transition text-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        /* Edit Mode Form */
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-sm">Title:</label>
            <input
              className="block w-full p-2 rounded border border-gray-700 bg-[var(--color-bg)] text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm">Description:</label>
            <input
              className="block w-full p-2 rounded border border-gray-700 bg-[var(--color-bg)] text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm">Difficulty:</label>
            <select
              className="block w-full p-2 rounded border border-gray-700 bg-[var(--color-bg)] text-sm"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Filter Bar */}
          <div>
            <label className="block font-semibold mb-1 text-sm">Filter Exercises by Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full p-2 rounded border border-gray-700 bg-[var(--color-bg)] text-sm"
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="font-semibold text-[var(--color-accent)] text-sm">Select Exercises:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-56 overflow-y-auto rounded border border-gray-700 p-2 bg-[var(--color-bg-card)]">
              {filteredExercises.map((ex) => (
                <label
                  key={ex._id}
                  className="flex items-center gap-2 p-2 rounded bg-[var(--color-bg)] cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(ex._id)}
                    onChange={() => handleCheckboxChange(ex._id)}
                    className="accent-[var(--color-accent)]"
                  />
                  <span>
                    {ex.name}{" "}
                    <span className="text-xs text-[var(--color-muted)]">({ex.category})</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition text-sm"
            >
              Save
            </button>
            <button
              type="button"
              className="px-5 py-2 rounded bg-[var(--color-bg-card)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-bg)] transition text-sm"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Modal for GIF preview */}
      {selectedExercise && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setSelectedExercise(null)}
        >
          <div
            className="bg-[var(--color-bg-card)] p-4 rounded-lg max-w-md w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-1 text-[var(--color-accent)]">{selectedExercise.name}</h2>
            <p className="text-xs text-[var(--color-muted)] mb-3">{selectedExercise.category}</p>
            <video
              src={`/assets/gifs/${selectedExercise.name.replace(/\s+/g, "-")}.mov`}
              autoPlay
              loop
              muted
              playsInline
              className="w-full rounded mb-3"
            />
            <button
              onClick={() => setSelectedExercise(null)}
              className="px-4 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPlanDetail;
