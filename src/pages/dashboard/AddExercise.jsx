import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

function AddExercise() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [guide, setGuide] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/exercises", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cats = Array.from(new Set(res.data.map((ex) => ex.category))).sort();
        setCategories(cats);
      })
      .catch(() => {
        toast.error("Error fetching categories.");
      });
  }, []);

  const handleAddExercise = async (e) => {
    e.preventDefault();

    if (!name || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      let mediaUrl = "";

      if (mediaFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          mediaUrl = reader.result;
          await sendExercise(mediaUrl);
        };
        reader.readAsDataURL(mediaFile);
      } else {
        await sendExercise(mediaUrl);
      }
    } catch (error) {
      console.error(error);
      setTimeout(() => {
        toast.error("Failed to add exercise.");
        setLoading(false);
      }, 2000);
    }
  };

  const sendExercise = async (mediaUrl) => {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/exercises",
      { name, category, guide, mediaUrl },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setTimeout(() => {
      toast.success("Exercise added successfully!");
      navigate("/dashboard/exercises");
      setLoading(false);
    }, 2000);
  };

  if (loading) return <Loading />;

  return (
    <div
      className="max-w-lg mx-auto mt-12 p-6 rounded-lg shadow-lg relative"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard/exercises")}
        className="absolute top-4 left-4 text-[var(--color-accent)] hover:text-white transition text-sm"
      >
        ← Back
      </button>

      <h1
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: "var(--color-accent)" }}
      >
        Add New Exercise
      </h1>

      <form onSubmit={handleAddExercise} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise name"
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
          <input
            type="text"
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
            placeholder="Guide (optional)"
            className="block w-full p-3 rounded bg-white text-black border border-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block font-semibold mb-1 text-sm">Upload Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMediaFile(e.target.files[0])}
            className="block w-full p-3 rounded bg-white text-black border border-[var(--color-accent)] focus:outline-none transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow-md"
        >
          Add Exercise
        </button>
      </form>
    </div>
  );
}

export default AddExercise;
