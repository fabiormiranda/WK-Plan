import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL;

function MyPlanDetail() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/workout-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(res.data);
      } catch {
        toast.error("Failed to load plan data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  if (loading) return <Loading />;

  return (
    <div
      className="max-w-4xl mx-auto mt-8 px-6 pt-12 pb-12 rounded-lg shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-[var(--color-accent)]">
        Workout Plan Details
      </h1>

      {/* Plan Info */}
      <section className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 text-[var(--color-accent)]">{plan.title}</h2>
        <p className="text-base mb-1 text-[var(--color-muted)] italic">{plan.description || "No description provided."}</p>
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
                className="flex items-center gap-3 bg-[var(--color-bg)] rounded-lg p-3 shadow"
              >
                <img
                  src={ex.mediaUrl || "/assets/placeholder.png"}
                  alt={ex.name}
                  onError={(e) => (e.target.src = "/assets/placeholder.png")}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex flex-col justify-center">
                  <p className="text-base font-medium">{ex.name}</p>
                  <p className="text-sm text-[var(--color-muted)]">{ex.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="italic text-[var(--color-muted)]">No exercises added to this plan.</p>
        )}
      </section>

      {/* Dates */}
      <section className="mb-8">
        <h3 className="text-lg sm:text-xl font-semibold mb-3 text-[var(--color-accent)]">Workout Dates</h3>
        {plan.dates && plan.dates.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {plan.dates.map((date) => (
              <span
                key={date}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-accent)] text-white shadow"
              >
                {formatDate(date)}
              </span>
            ))}
          </div>
        ) : (
          <p className="italic text-[var(--color-muted)]">No workout dates set.</p>
        )}
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="flex items-center justify-center gap-2 px-5 py-2 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow-md w-full sm:w-auto"
          onClick={() => navigate(`/dashboard/edit-plan/${planId}`)}
        >
          <FaEdit size={14} /> Edit Plan
        </button>
        <button
          className="flex items-center justify-center gap-2 px-5 py-2 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow-md w-full sm:w-auto"
          onClick={() => navigate(`/dashboard/delete-plan/${planId}`)}
        >
          <FaTrash size={14} /> Delete Plan
        </button>
      </div>
    </div>
  );
}

export default MyPlanDetail;
