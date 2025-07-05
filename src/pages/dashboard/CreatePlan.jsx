import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Loading from "../../components/Loading";

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
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/exercises")
      .then((res) => {
        setExercises(res.data);
        setFilteredExercises(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Error fetching exercises");
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

  const uniqueCategories = Array.from(
    new Set(exercises.map((ex) => ex.category))
  ).sort();

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
      alert("Please enter all fields and select at least one exercise.");
      return;
    }

    if (selectedDates.length === 0) {
      alert("Please select at least one workout date.");
      return;
    }

    try {
      setLoadingSubmit(true);

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/workout-plans",
        {
          title: planName,
          description,
          difficulty,
          exercises: selectedExercises,
          dates: selectedDates,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMsg("Plan created successfully!");
      setPlanName("");
      setDescription("");
      setDifficulty("easy");
      setSelectedExercises([]);
      setSelectedDates([]);
      setCategoryFilter("");

      setTimeout(() => {
        setLoadingSubmit(false);
        navigate("/dashboard/my-plans");
      }, 1800);
    } catch (err) {
      setLoadingSubmit(false);
      const msg =
        err.response?.data?.message || "Error creating plan!";
      alert(msg);
    }
  };

  if (loading || loadingSubmit) {
    return <Loading />;
  }

  return (
    <div
      className="p-6 max-w-6xl mx-auto rounded-xl shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      {successMsg && (
        <div className="mb-4 text-green-500 font-semibold text-center">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-12">
        {/* Left side: form + exercises */}
        <div className="flex flex-col gap-4 flex-1 max-w-xl">
          <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--color-accent)" }}>
            Create New Workout Plan
          </h1>

          {/* Plan Name */}
          <label className="block">
            <span className="font-semibold mb-1 block">Plan Name:</span>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
              required
              disabled={loadingSubmit}
              style={{ cursor: loadingSubmit ? "not-allowed" : "auto" }}
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="font-semibold mb-1 block">Description:</span>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
              disabled={loadingSubmit}
              style={{ cursor: loadingSubmit ? "not-allowed" : "auto" }}
            />
          </label>

          {/* Difficulty */}
          <label className="block">
            <span className="font-semibold mb-1 block">Difficulty:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
              required
              disabled={loadingSubmit}
              style={{ cursor: loadingSubmit ? "not-allowed" : "auto" }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          {/* Filter Exercises */}
          <label className="block">
            <span className="font-semibold mb-1 block">Filter Exercises by Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full p-3 rounded border border-transparent bg-[#18181b] focus:border-[var(--color-accent)] outline-none transition"
              disabled={loadingSubmit}
              style={{ cursor: loadingSubmit ? "not-allowed" : "auto" }}
            >
              <option value="">All</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          {/* Select Exercises */}
          <div
            className="mb-4 max-h-72 overflow-y-auto rounded border border-gray-700 bg-[var(--color-bg)] p-2"
            style={{ opacity: loadingSubmit ? 0.6 : 1 }}
          >
            {filteredExercises.length === 0 && (
              <p className="text-[var(--color-muted)] text-center">No exercises found.</p>
            )}
            {filteredExercises.map((ex) => (
              <label
                key={ex._id}
                className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-[var(--color-accent)] hover:text-white transition"
                style={{
                  backgroundColor: selectedExercises.includes(ex._id)
                    ? "var(--color-accent)"
                    : "var(--color-bg-card)",
                  color: selectedExercises.includes(ex._id)
                    ? "white"
                    : "var(--color-text)",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedExercises.includes(ex._id)}
                  onChange={() => handleCheckboxChange(ex._id)}
                  className="accent-[var(--color-accent)]"
                  disabled={loadingSubmit}
                />
                <span>
                  {ex.name} <span className="text-[var(--color-muted)] text-xs">({ex.category})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Right side: calendar */}
        <div className="flex flex-col w-120">
          <div className="mb-17 pl-30" style={{ color: "var(--color-accent)" }}>
            <h2 className="text-2xl font-bold">Select Workout Dates</h2>
          </div>
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
            height={400}
            themeSystem="standard"
            locale="en"
          />
          <button
            type="submit"
            className="mt-6 py-3 rounded font-semibold shadow"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "white",
              cursor: loadingSubmit ? "not-allowed" : "pointer",
            }}
            disabled={loadingSubmit}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-accent-dark)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-accent)")
            }
          >
            Create Plan
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePlan;
