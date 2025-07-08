import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaDumbbell, FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", options);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedPlans = Array.from(plans);
    const [movedPlan] = reorderedPlans.splice(result.source.index, 1);
    reorderedPlans.splice(result.destination.index, 0, movedPlan);

    setPlans(reorderedPlans);
  };

  if (loading)
    return (
      <div className="px-6 pt-20 text-center text-lg" style={{ color: "var(--color-text)" }}>
        Loading plans...
      </div>
    );

  return (
    <div className="px-6 pt-14 pb-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
          My Plans
        </h1>
        <button
          className="flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] text-white rounded font-semibold hover:bg-[var(--color-accent-dark)] transition shadow-md"
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="plans-list">
            {(provided) => (
              <ul
                className="space-y-6"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {plans.map((plan, index) => (
                  <Draggable key={plan._id} draggableId={plan._id} index={index}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-6 rounded-lg shadow-lg bg-[var(--color-bg-card)] hover:shadow-xl transition transform hover:scale-[1.02] cursor-pointer ${
                          snapshot.isDragging ? "opacity-90 scale-[1.02]" : ""
                        }`}
                        onClick={() => navigate(`/dashboard/my-plans/${plan._id}`)}
                      >
                        <div className="flex flex-col gap-2">
                          <h3
                            className="text-2xl font-semibold"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {plan.title}
                          </h3>
                          <p className="text-lg" style={{ color: "var(--color-text)" }}>
                            {plan.description || <em>No description provided</em>}
                          </p>
                          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                            Difficulty:{" "}
                            <span style={{ color: "var(--color-accent)" }}>
                              {plan.difficulty}
                            </span>
                          </p>
                          <p className="flex items-center gap-1 text-sm text-[var(--color-text)]">
                            <FaDumbbell /> Exercises: {plan.exercises.length}
                          </p>

                          <div className="mt-3">
                            <h4
                              className="font-semibold mb-2 flex items-center gap-2"
                              style={{ color: "var(--color-accent)" }}
                            >
                              <FaCalendarAlt /> Workout Dates
                            </h4>
                            {plan.dates && plan.dates.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {plan.dates.map((date) => (
                                  <span
                                    key={date}
                                    className="px-3 py-1 rounded-full text-sm font-semibold bg-[var(--color-accent)] text-white shadow transition transform hover:scale-105"
                                    title={new Date(date).toLocaleString()}
                                  >
                                    {formatDate(date)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="italic text-[var(--color-muted)]">
                                No workout dates set
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}

export default MyPlans;
