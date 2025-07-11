import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL;

function DeletePlan() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/workout-plans/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(res.data);
      } catch (error) {
        toast.error("Error fetching plan data.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  const handleDelete = async () => {
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/workout-plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Workout plan deleted successfully!");
      setTimeout(() => {
        navigate("/dashboard/my-plans");
        setDeleting(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete workout plan.");
      setDeleting(false);
    }
  };

  if (loading || deleting) return <Loading />;

  if (!plan) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center text-[var(--color-text)]">
        Workout plan not found.
      </div>
    );
  }

  return (
    <div
      className="max-w-lg mx-auto mt-16 p-6 rounded-lg shadow-lg text-center"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-accent)" }}>
        Delete Workout Plan
      </h1>

      <p className="mb-6">
        Are you sure you want to delete the workout plan {" "}
        <span className="font-semibold text-[var(--color-accent)]">{plan.title}</span>?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition shadow"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/dashboard/my-plans")}
          className="px-4 py-2 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeletePlan;