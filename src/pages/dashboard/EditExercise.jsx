import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL;

function EditExercise() {
  const { exerciseId } = useParams();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [guide, setGuide] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${API_URL}/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const { name, category, guide, mediaUrl } = res.data;
        setName(name);
        setCategory(category);
        setGuide(guide || "");
        setMediaUrl(mediaUrl || "");
      })
      .catch(() => toast.error("Error fetching exercise data."));

    axios.get(`${API_URL}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cats = Array.from(new Set(res.data.map((ex) => ex.category))).sort();
        setCategories(cats);
      })
      .catch(() => {
        toast.error("Error fetching categories.");
      });
  }, [exerciseId]);

  const handleEditExercise = async (e) => {
    e.preventDefault();

    if (!name || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/exercises/${exerciseId}`,
        { name, category, guide, mediaUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        toast.success("Exercise updated successfully!");
        navigate(`/dashboard/exercises/${name.toLowerCase().replace(/\s+/g, "-")}`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        toast.error("Failed to update exercise.");
        setLoading(false);
      }, 1000);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      className="max-w-lg mx-auto mt-12 p-6 rounded-lg shadow-lg relative"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(`/dashboard/exercises/${name.toLowerCase().replace(/\s+/g, "-")}`)}
        className="absolute top-4 left-4 text-[var(--color-accent)] hover:text-white transition text-sm"
      >
        ← Back
      </button>

      <h1
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Edit Exercise
      </h1>

      <form onSubmit={handleEditExercise} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise Name"
            required
            className="block w-full p-3 rounded bg-white text-black border border-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Category*</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="block w-full p-3 rounded bg-white text-black border border-[var(--color-accent)] focus:outline-none transition"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Guide */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Guide</label>
          <textarea
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
            placeholder="Guide (optional)"
            className="block w-full p-3 rounded bg-white text-black border border-[var(--color-accent)] focus:outline-none transition"
            rows={4}
          />
        </div>

        {/* Media URL */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Media URL (optional)</label>
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder="Media URL"
            className="block w-full p-3 rounded bg-white text-black border border-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow-md"
        >
          Update Exercise
        </button>
      </form>
    </div>
  );
}

export default EditExercise;
