import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaDumbbell, FaCalendarAlt, FaPlusCircle } from "react-icons/fa";

function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/workout-plans", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="px-6 pt-6 text-center" style={{ color: "var(--color-text)" }}>
        Loading plans...
      </div>
    );

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div className="px-6 pt-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
          My Plans
        </h1>
        <button
          className="flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] text-white rounded font-semibold hover:bg-[var(--color-accent-dark)] transition"
          onClick={() => navigate("/dashboard/create-plan")}
        >
          <FaPlusCircle /> Create New Plan
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="text-center text-[var(--color-muted)] italic mt-20">
          <FaDumbbell size={48} className="mx-auto mb-4" />
          You have no workout plans yet.
        </div>
      ) : (
        <ul className="space-y-8">
          {plans.map((plan) => (
            <li
              key={plan._id}
              className="p-6 rounded-lg shadow-lg bg-[var(--color-bg-card)] hover:shadow-xl transition cursor-pointer"
              onClick={() => navigate(`/dashboard/my-plans/${plan._id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="max-w-3xl">
                  <h3
                    className="text-2xl font-semibold mb-2"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {plan.title}
                  </h3>
                  <p className="text-lg mb-2" style={{ color: "var(--color-text)" }}>
                    {plan.description || <em>No description provided</em>}
                  </p>
                  <p className="text-sm mb-2" style={{ color: "var(--color-muted)" }}>
                    Difficulty:{" "}
                    <span style={{ color: "var(--color-accent)" }}>{plan.difficulty}</span>
                  </p>
                  <p className="flex items-center gap-1 text-sm text-[var(--color-text)] mb-3">
                    <FaDumbbell /> Exercises: {plan.exercises.length}
                  </p>

                  <div>
                    <h4
                      className="font-semibold mb-2 flex items-center gap-2"
                      style={{ color: "var(--color-accent)" }}
                    >
                      <FaCalendarAlt /> Workout Dates
                    </h4>
                    {plan.dates && plan.dates.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {plan.dates.map((date) => (
                          <span
                            key={date}
                            className="px-4 py-1 rounded-full text-sm font-semibold bg-[var(--color-accent)] text-white shadow-md transition transform hover:scale-105"
                            title={new Date(date).toLocaleString()}
                          >
                            {formatDate(date)}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="italic text-[var(--color-muted)]">No workout dates set</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyPlans;
