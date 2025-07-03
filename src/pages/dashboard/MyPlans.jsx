import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/workout-plans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <div className="p-6" style={{ color: "var(--color-text)" }}>
        Loading plans...
      </div>
    );

  return (
    <div className="p-6" style={{ color: "var(--color-text)" }}>
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--color-accent)" }}
      >
        My Plans
      </h1>
      {plans.length === 0 ? (
        <p>You have no workout plans yet.</p>
      ) : (
        <ul>
          {plans.map((plan) => (
            <li
              key={plan._id}
              className="mb-4 p-4 rounded shadow"
              style={{ backgroundColor: "var(--color-bg-card)" }}
            >
              <h3
                className="text-xl font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {plan.title}
              </h3>
              <p style={{ color: "var(--color-text)" }}>{plan.description}</p>
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                Difficulty:{" "}
                <span style={{ color: "var(--color-accent)" }}>
                  {plan.difficulty}
                </span>
              </p>
              <p style={{ color: "var(--color-text)" }}>
                Exercises: {plan.exercises.length}
              </p>
              <button
                className="mt-2 px-4 py-1 rounded"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "#fff",
                }}
                onClick={() => navigate(`/dashboard/my-plans/${plan._id}`)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-accent-dark)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--color-accent)")
                }
              >
                View / Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyPlans;
