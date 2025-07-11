import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL;

function EditPlan() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [allExercises, setAllExercises] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/workout-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const plan = res.data;
        setTitle(plan.title);
        setDescription(plan.description || "");
        setDifficulty(plan.difficulty || "easy");
        setSelectedExercises(plan.exercises.map((ex) => ex._id));

        const exRes = await axios.get(`${API_URL}/exercises`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllExercises(exRes.data);
      } catch {
        toast.error("Failed to load plan data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/workout-plans/${planId}`,
        { title, description, difficulty, exercises: selectedExercises },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Workout plan updated successfully!");
      navigate(`/dashboard/my-plans/${planId}`);
    } catch {
      toast.error("Failed to update the workout plan.");
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(allExercises.map((ex) => ex.category))).sort();

  const filteredExercises = categoryFilter
    ? allExercises.filter((ex) => ex.category.toLowerCase() === categoryFilter.toLowerCase())
    : allExercises;

  if (loading) return <Loading />;

  return (
    <div
      className="max-w-2xl mx-auto mt-8 px-6 py-8 rounded-lg shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-[var(--color-accent)]">
        Edit Workout Plan
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        {[{ label: "Title:", value: title, setter: setTitle, required: true, placeholder: "Plan title" },
          { label: "Description:", value: description, setter: setDescription, placeholder: "Description" }].map((field, idx) => (
          <div key={idx}>
            <label className="block font-semibold mb-1 text-sm">{field.label}</label>
            <input
              className="block w-full p-3 rounded bg-white text-black border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              required={field.required || false}
            />
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1 text-sm">Difficulty:</label>
          <select
            className="block w-full p-3 rounded bg-white text-black border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm">Filter Exercises by Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full p-3 rounded bg-white text-black border border-gray-300 focus:border-[var(--color-accent)] outline-none transition"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <span className="font-semibold text-[var(--color-accent)] text-sm">Select Exercises:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 max-h-56 overflow-y-auto rounded border border-gray-300 p-2 bg-[var(--color-bg-card)]">
            {filteredExercises.map((ex) => (
              <label
                key={ex._id}
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition text-sm"
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
            className="flex-1 px-5 py-2 rounded font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition shadow"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/my-plans/${planId}`)}
            className="flex-1 px-5 py-2 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPlan;
