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
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", options);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put(
      `http://localhost:5000/api/workout-plans/${planId}`,
      {
        title,
        description,
        difficulty,
        exercises: selectedExercises,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
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

  if (!plan)
    return (
      <div className="p-6" style={{ color: "var(--color-text)" }}>
        Loading plan...
      </div>
    );

  return (
    <div
      className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1
        className="text-3xl font-extrabold mb-6"
        style={{ color: "var(--color-accent)" }}
      >
        Workout Plan Details
      </h1>

      {!editMode ? (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
              {plan.title}
            </h2>
            <p className="mt-1 text-lg" style={{ color: "var(--color-text)" }}>
              {plan.description || <em>No description provided.</em>}
            </p>
            <p className="mt-2 text-sm" style={{ color: "var(--color-muted)" }}>
              Difficulty:{" "}
              <span
                className={`font-semibold text-${plan.difficulty === 'easy' ? 'green' : plan.difficulty === 'medium' ? 'yellow' : 'red'}-500`}
                style={{ color: "var(--color-accent)" }}
              >
                {plan.difficulty}
              </span>
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
              Exercises
            </h3>
            <ul className="list-disc list-inside max-h-48 overflow-y-auto">
              {plan.exercises.map((ex) => (
                <li key={ex._id} className="mb-1" style={{ color: "var(--color-text)" }}>
                  <strong>{ex.name}</strong>{" "}
                  <span className="text-sm text-[var(--color-muted)]">({ex.category})</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
              Workout Date
            </h3>
            {plan.dates && plan.dates.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {plan.dates.map((date) => (
                  <span
                    key={date}
                    className="px-4 py-1 rounded-full text-sm font-semibold bg-[var(--color-accent)] text-white shadow"
                    title={new Date(date).toLocaleString()}
                  >
                    {formatDate(date)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[var(--color-muted)] italic">No workout dates set</p>
            )}
          </section>

          <div className="flex gap-4">
            <button
              className="px-6 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition"
              onClick={() => setEditMode(true)}
            >
              Edit
            </button>
            <button
              className="px-6 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800 transition"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <label className="block mb-4" style={{ color: "var(--color-text)" }}>
            Title:
            <input
              className="block w-full p-3 rounded border border-gray-700 bg-[var(--color-bg)] text-[var(--color-text)]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className="block mb-4" style={{ color: "var(--color-text)" }}>
            Description:
            <input
              className="block w-full p-3 rounded border border-gray-700 bg-[var(--color-bg)] text-[var(--color-text)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <label className="block mb-4" style={{ color: "var(--color-text)" }}>
            Difficulty:
            <select
              className="block w-full p-3 rounded border border-gray-700 bg-[var(--color-bg)] text-[var(--color-text)]"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <div className="mb-6">
            <span className="font-semibold text-[var(--color-accent)]">
              Select Exercises:
            </span>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 max-h-56 overflow-y-auto rounded border border-gray-700 p-4 bg-[var(--color-bg-card)]"
            >
              {allExercises.map((ex) => (
                <label
                  key={ex._id}
                  className="flex items-center gap-3 p-2 rounded bg-[var(--color-bg)] cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(ex._id)}
                    onChange={() => handleCheckboxChange(ex._id)}
                    className="accent-[var(--color-accent)]"
                  />
                  <span>
                    {ex.name}{" "}
                    <span className="text-sm text-[var(--color-muted)]">
                      ({ex.category})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition"
            >
              Save
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded bg-[var(--color-bg-card)] text-[var(--color-text)] font-semibold hover:bg-[var(--color-bg)] transition"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MyPlanDetail;
