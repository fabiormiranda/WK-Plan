import React, { useEffect, useState } from "react";
import axios from "axios";

function CreatePlan() {
  const [exercises, setExercises] = useState([]);
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  // Buscar exercícios do backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exercises")
      .then((res) => {
        setExercises(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Error fetching exercises");
      });
  }, []);

  const handleCheckboxChange = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName || !difficulty || selectedExercises.length === 0) {
      alert("Please enter all fields and select at least one exercise.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/workout-plans",
        {
          title: planName,
          description,
          difficulty,
          exercises: selectedExercises,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMsg("Plan created successfully!");
      setPlanName("");
      setDescription("");
      setDifficulty("easy");
      setSelectedExercises([]);
    } catch (err) {
      alert("Error creating plan!");
    }
  };

  if (loading)
    return (
      <div className="p-6" style={{ color: "var(--color-text)" }}>
        Loading exercises...
      </div>
    );

  return (
    <div
      className="p-6 max-w-2xl mx-auto rounded-xl shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-accent)" }}>
        Create New Workout Plan
      </h1>
      {successMsg && (
        <div className="mb-4 text-green-500 font-semibold">{successMsg}</div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="font-semibold mb-1 block">Plan Name:</span>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
            required
          />
        </label>
        <label className="block">
          <span className="font-semibold mb-1 block">Description:</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
          />
        </label>
        <label className="block">
          <span className="font-semibold mb-1 block">Difficulty:</span>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <div className="mb-4">
          <span className="font-semibold">Select Exercises:</span>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto rounded"
            style={{ backgroundColor: "var(--color-bg)" }}
          >
            {exercises.map((ex) => (
              <label
                key={ex._id}
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition"
                style={{
                  backgroundColor: selectedExercises.includes(ex._id)
                    ? "var(--color-accent)"
                    : "var(--color-bg-card)",
                  color: selectedExercises.includes(ex._id)
                    ? "white"
                    : "var(--color-text)",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedExercises.includes(ex._id)}
                  onChange={() => handleCheckboxChange(ex._id)}
                  className="accent-[var(--color-accent)]"
                />
                <span>
                  {ex.name} <span className="text-[var(--color-muted)] text-xs">({ex.category})</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="py-3 rounded font-semibold shadow"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = "var(--color-accent-dark)")}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = "var(--color-accent)")}
        >
          Create Plan
        </button>
      </form>
    </div>
  );
}

export default CreatePlan;
