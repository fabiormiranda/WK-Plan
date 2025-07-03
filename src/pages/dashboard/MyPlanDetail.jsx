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
    axios
      .get("http://localhost:5000/api/exercises")
      .then((res) => setAllExercises(res.data));
  }, [planId]);

  const handleCheckboxChange = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
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
      className="max-w-2xl mx-auto p-6 rounded"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1
        className="text-2xl font-bold mb-4"
        style={{ color: "var(--color-accent)" }}
      >
        Workout Plan Details
      </h1>
      {!editMode ? (
        <>
          <h2 className="text-xl font-semibold" style={{ color: "var(--color-accent)" }}>
            {plan.title}
          </h2>
          <p style={{ color: "var(--color-text)" }}>{plan.description}</p>
          <p className="mb-2" style={{ color: "var(--color-muted)" }}>
            Difficulty:{" "}
            <span style={{ color: "var(--color-accent)" }}>{plan.difficulty}</span>
          </p>
          <h3 className="mt-4 font-bold" style={{ color: "var(--color-accent)" }}>
            Exercises:
          </h3>
          <ul className="mb-4" style={{ color: "var(--color-text)" }}>
            {plan.exercises.map((ex) => (
              <li key={ex._id}>
                {ex.name}{" "}
                <span style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>
                  ({ex.category})
                </span>
              </li>
            ))}
          </ul>
          <button
            className="px-4 py-1 rounded mr-2"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
            }}
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
          <button
            className="px-4 py-1 rounded"
            style={{
              backgroundColor: "#b91c1c",
              color: "#fff",
            }}
            onClick={handleDelete}
          >
            Delete
          </button>
        </>
      ) : (
        <form onSubmit={handleUpdate}>
          <label className="block mb-2" style={{ color: "var(--color-text)" }}>
            Title:
            <input
              className="block w-full p-2 rounded border"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            />
          </label>
          <label className="block mb-2" style={{ color: "var(--color-text)" }}>
            Description:
            <input
              className="block w-full p-2 rounded border"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            />
          </label>
          <label className="block mb-2" style={{ color: "var(--color-text)" }}>
            Difficulty:
            <select
              className="block w-full p-2 rounded border"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
          <div className="mb-4">
            <span className="font-semibold" style={{ color: "var(--color-accent)" }}>
              Select Exercises:
            </span>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto"
              style={{ backgroundColor: "var(--color-bg-card)" }}
            >
              {allExercises.map((ex) => (
                <label
                  key={ex._id}
                  className="flex items-center gap-2 p-2 rounded shadow"
                  style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(ex._id)}
                    onChange={() => handleCheckboxChange(ex._id)}
                  />
                  <span>
                    {ex.name}{" "}
                    <span style={{ color: "var(--color-muted)", fontSize: "0.75rem" }}>
                      ({ex.category})
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="mr-2 rounded px-6 py-2 font-semibold"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "#fff",
            }}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded px-6 py-2"
            style={{
              backgroundColor: "var(--color-bg-card)",
              color: "var(--color-text)",
            }}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default MyPlanDetail;
