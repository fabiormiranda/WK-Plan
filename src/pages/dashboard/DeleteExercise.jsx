import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function DeleteExercise() {
  const { exerciseId } = useParams(); // Get exerciseId from URL parameters
  const [exercise, setExercise] = useState(null); // Store the exercise to display
  const [loading, setLoading] = useState(false); // Loading while fetching data
  const [deleting, setDeleting] = useState(false); // Loading while deleting
  const navigate = useNavigate();

  // Fetch exercise details on component mount
  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/exercises/${exerciseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercise(res.data);
      } catch (error) {
        toast.error("Error fetching exercise data.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  // Handle the delete confirmation
  const handleDelete = async () => {
    setDeleting(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Exercise deleted successfully!");
      setTimeout(() => {
        navigate("/dashboard/exercises");
        setDeleting(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete exercise.");
      setDeleting(false);
    }
  };

  // Show loading spinner while fetching or deleting
  if (loading || deleting) return <Loading />;

  // If no exercise found, display message
  if (!exercise) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center text-[var(--color-text)]">
        Exercise not found.
      </div>
    );
  }

  return (
    <div
      className="max-w-lg mx-auto mt-16 p-6 rounded-lg shadow-lg text-center"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-accent)" }}>
        Delete Exercise
      </h1>

      {/* Confirmation Text */}
      <p className="mb-6">
        Are you sure you want to delete the exercise{" "}
        <span className="font-semibold text-[var(--color-accent)]">{exercise.name}</span>?
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded font-semibold bg-[var(--color-accent)] text-white hover:opacity-90 transition shadow"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => navigate("/dashboard/exercises")}
          className="px-4 py-2 rounded font-semibold bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteExercise;
