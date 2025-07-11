import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaDumbbell, FaCalendarAlt, FaPlusCircle } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

function MyPlans() {
  // State to store fetched plans and loading status
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch workout plans on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${API_URL}/workout-plans`, {
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

  // Format dates to readable short format
  const formatDate = (dateStr) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  // Handle drag and drop reordering of plans locally
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedPlans = Array.from(plans);
    const [movedPlan] = reorderedPlans.splice(result.source.index, 1);
    reorderedPlans.splice(result.destination.index, 0, movedPlan);
    setPlans(reorderedPlans);
  };

  return (
    <div className="px-6 pt-14 pb-8 max-w-6xl mx-auto">
      {/* Header with title and Create New Plan button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-1 sm:gap-50">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-accent)" }}>
          My Plans
        </h1>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded font-semibold border border-[var(--color-accent)] text-[var(--color-accent)] bg-white hover:bg-[var(--color-accent)] hover:text-white transition shadow sm:ml-6"
          onClick={() => navigate("/dashboard/create-plan")}
        >
          <FaPlusCircle /> Create New Plan
        </button>
      </div>

      {/* If no plans, show an empty state */}
      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-24 text-center text-[var(--color-muted)] italic">
          <FaDumbbell size={48} className="mx-auto mb-4" />
          You have no workout plans yet.
        </div>
      ) : (
        // Drag and drop context for reordering plans locally
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="plans-list" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {plans.map((plan, index) => (
                  <Draggable key={plan._id} draggableId={plan._id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-6 rounded-lg shadow-lg bg-[var(--color-bg-card)] hover:shadow-2xl transition transform hover:scale-105 cursor-pointer ${
                          snapshot.isDragging ? "opacity-90 scale-105" : ""
                        }`}
                        onClick={() => navigate(`/dashboard/my-plans/${plan._id}`)}
                      >
                        <div className="flex flex-col gap-2">
                          {/* Plan Title */}
                          <h3
                            className="text-2xl font-semibold"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {plan.title}
                          </h3>

                          {/* Plan Description */}
                          <p className="text-lg" style={{ color: "var(--color-text)" }}>
                            {plan.description || <em>No description provided</em>}
                          </p>

                          {/* Difficulty */}
                          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                            Difficulty:{" "}
                            <span style={{ color: "var(--color-accent)" }}>
                              {plan.difficulty}
                            </span>
                          </p>

                          {/* Exercise count */}
                          <p className="flex items-center gap-1 text-sm text-[var(--color-text)]">
                            <FaDumbbell /> Exercises: {plan.exercises.length}
                          </p>

                          {/* Workout dates */}
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
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
export default MyPlans;
