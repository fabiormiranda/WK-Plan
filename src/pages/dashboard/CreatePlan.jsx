import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Loading from "../../components/Loading";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function CreatePlan() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [planName, setPlanName] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/exercises`)
      .then((res) => {
        setExercises(res.data);
        setFilteredExercises(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Error fetching exercises.");
      });
  }, []);

  useEffect(() => {
    if (categoryFilter === "") {
      setFilteredExercises(exercises);
    } else {
      setFilteredExercises(
        exercises.filter(
          (ex) => ex.category.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }
    setSelectedExercises([]);
  }, [categoryFilter, exercises]);

  const uniqueCategories = Array.from(new Set(exercises.map((ex) => ex.category))).sort();

  const handleCheckboxChange = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const handleDateClick = (arg) => {
    const dateStr = arg.dateStr;
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!planName || !difficulty || selectedExercises.length === 0) {
      toast.error("Please enter all fields and select at least one exercise.");
      return;
    }
    if (selectedDates.length === 0) {
      toast.error("Please select at least one workout date.");
      return;
    }

    try {
      setLoadingSubmit(true);
      const token = localStorage.getItem("token");

      await axios.post(`${API_URL}/workout-plans`,
        {
          title: planName,
          description,
          difficulty,
          exercises: selectedExercises,
          dates: selectedDates,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Workout plan created successfully!");

      setPlanName("");
      setDescription("");
      setDifficulty("easy");
      setSelectedExercises([]);
      setSelectedDates([]);
      setCategoryFilter("");

      setTimeout(() => {
        setLoadingSubmit(false);
        navigate("/dashboard/my-plans");
      }, 1200);
    } catch (err) {
      setLoadingSubmit(false);
      const msg = err.response?.data?.message || "Error creating plan!";
      toast.error(msg);
    }
  };

  if (loading || loadingSubmit) {
    return <Loading />;
  }

  return (
    <div
      className="mt-8 px-4 pt-8 pb-10 max-w-5xl mx-auto rounded-lg shadow-lg"
      style={{
        backgroundColor: "var(--color-bg-card)",
        color: "var(--color-text)",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        {/* Left: Form and Exercises */}
        <div className="flex flex-col gap-4 flex-1">
          <h1 className="text-2xl font-bold mb-4 text-[var(--color-accent)]">
            Create New Workout Plan
          </h1>

          {[
            {
              label: "Plan Name:",
              value: planName,
              onChange: setPlanName,
              placeholder: "Enter your plan name",
            },
            {
              label: "Description:",
              value: description,
              onChange: setDescription,
              placeholder: "Short description (optional)",
            },
          ].map((field, idx) => (
            <label key={idx}>
              <span className="font-semibold mb-1 block">{field.label}</span>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="block w-full p-3 rounded bg-white text-black placeholder-gray-400 border border-gray-300 focus:border-[var(--color-accent)] focus:outline-none transition"
                disabled={loadingSubmit}
              />
            </label>
          ))}

          <label>
            <span className="font-semibold mb-1 block">Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="block w-full p-3 rounded bg-white text-black border border-gray-300 focus:border-[var(--color-accent)] focus:outline-none transition"
              required
              disabled={loadingSubmit}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label>
            <span className="font-semibold mb-1 block">Filter Exercises by Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full p-3 rounded bg-white text-black border border-gray-300 focus:border-[var(--color-accent)] focus:outline-none transition"
              disabled={loadingSubmit}
            >
              <option value="">All</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <div className="max-h-72 overflow-y-auto rounded border border-gray-700 bg-[var(--color-bg)] p-2">
            {filteredExercises.length === 0 ? (
              <p className="text-center text-[var(--color-muted)]">No exercises found.</p>
            ) : (
              filteredExercises.map((ex) => (
                <label
                  key={ex._id}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                    selectedExercises.includes(ex._id)
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-bg-card)] text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(ex._id)}
                    onChange={() => handleCheckboxChange(ex._id)}
                    className="accent-[var(--color-accent)]"
                    disabled={loadingSubmit}
                  />
                  <span>
                    {ex.name}{" "}
                    <span className="text-[var(--color-muted)] text-xs">
                      ({ex.category})
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Right: Calendar */}
        <div className="flex flex-col w-full lg:w-[45%]">
          <h2 className="text-2xl font-bold mb-4 text-[var(--color-accent)]">
            Select Workout Dates
          </h2>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable={true}
            dayMaxEvents={true}
            weekends={true}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,dayGridWeek",
            }}
            dateClick={handleDateClick}
            validRange={{ start: new Date() }}
            dayCellClassNames={(arg) => {
              if (selectedDates.includes(arg.dateStr)) {
                return "bg-[var(--color-accent)] text-white rounded";
              }
              return "";
            }}
            height={420}
            themeSystem="standard"
            locale="en"
          />
          <button
            type="submit"
            className="mt-6 py-3 rounded font-semibold shadow hover:opacity-90 transition bg-[var(--color-accent)] text-white"
            disabled={loadingSubmit}
          >
            Create Plan
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePlan;
