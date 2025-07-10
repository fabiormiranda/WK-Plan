import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ExerciseDetailPage = () => {
  const { exerciseSlug } = useParams();
  const [exercise, setExercise] = useState(null);
  const [exercises, setExercises] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.exercises) {
      setExercises(location.state.exercises);
      const foundExercise = location.state.exercises.find(
        (ex) => ex.name.toLowerCase().replace(/\s+/g, "-") === exerciseSlug
      );
      setExercise(foundExercise);
    } else {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:5000/api/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setExercises(data);
          const foundExercise = data.find(
            (ex) => ex.name.toLowerCase().replace(/\s+/g, "-") === exerciseSlug
          );
          setExercise(foundExercise);
        })
        .catch(() => console.error("Error fetching exercise details"));
    }
  }, [exerciseSlug, location.state]);

  if (!exercise) return null;

  const currentIndex = exercises.findIndex(
    (ex) => ex.name.toLowerCase().replace(/\s+/g, "-") === exerciseSlug
  );

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % exercises.length;
    navigate(
      `/dashboard/exercises/${exercises[nextIndex].name.toLowerCase().replace(/\s+/g, "-")}`,
      { state: { exercise: exercises[nextIndex], exercises } }
    );
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + exercises.length) % exercises.length;
    navigate(
      `/dashboard/exercises/${exercises[prevIndex].name.toLowerCase().replace(/\s+/g, "-")}`,
      { state: { exercise: exercises[prevIndex], exercises } }
    );
  };

  const renderGuide = (text) => {
    if (!text || text.trim() === "") {
      return "No guide provided for this exercise.";
    }
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const numbered = lines.filter((line) => /^\d+\./.test(line.trim()));
    if (numbered.length > 0) {
      return (
        <ol className="list-decimal list-inside space-y-3 text-[16px] leading-relaxed max-w-prose">
          {lines.map((line, idx) => (
            <li key={idx}>{line.replace(/^\d+\.\s*/, "")}</li>
          ))}
        </ol>
      );
    }
    return (
      <p className="text-[16px] leading-relaxed whitespace-pre-line max-w-prose">
        {text}
      </p>
    );
  };

  const videoSrc = `/assets/gifs/${exercise.name.replace(/\s+/g, "-")}.mov`;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-12 pb-6 text-[var(--color-text)]">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Video */}
        <div className="flex flex-col items-start w-full lg:w-[40%]">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-[360px] rounded-lg object-contain"
            onError={(e) => {
              e.target.style.display = "none";
              const placeholder = document.createElement("p");
              placeholder.textContent = "No video available for this exercise.";
              placeholder.className = "text-center text-sm text-gray-400 p-4";
              e.target.parentNode.appendChild(placeholder);
            }}
          />
          <button
            onClick={() => navigate("/dashboard/exercises")}
            className="mt-6 ml-1 text-sm text-[var(--color-accent)] hover:text-white transition"
          >
            ← Back to Exercises
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-6 max-w-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1
              className="text-3xl font-extrabold mb-2 sm:mb-0"
              style={{ color: "var(--color-accent)" }}
            >
              {exercise.name}
            </h1>
            <div className="mt-2 sm:mt-0 sm:ml-4">
              <h2 className="font-semibold text-base text-[var(--color-accent)]">
                Target Muscle
              </h2>
              <p className="uppercase tracking-wide text-sm">
                {exercise.category || "Not specified"}
              </p>
            </div>
          </div>

          {/* Guide */}
          <div>
            <h2 className="font-semibold mb-2 text-base text-[var(--color-accent)]">
              Guide
            </h2>
            {renderGuide(exercise.guide)}
          </div>

          {/* Navigation Buttons */}
          {exercises.length > 1 && (
            <div className="flex justify-center gap-35 mt-10">
              <button
                onClick={handlePrev}
                className="px-5 py-2 rounded bg-[var(--color-accent)] text-white hover:opacity-90 transition shadow"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded bg-[var(--color-accent)] text-white hover:opacity-90 transition shadow"
              >
                Next →
              </button>
            </div>
          )}

          {/* Edit/Delete Buttons aligned right */}
          <div className="flex justify-end gap-5 mt-30">
            <button
              onClick={() => navigate(`/dashboard/edit-exercise/${exercise._id}`)}
              className="px-4 py-2 rounded bg-white text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition shadow"
            >
              Edit Exercise
            </button>
            <button
              onClick={() => navigate(`/dashboard/delete-exercise/${exercise._id}`)}
              className="px-4 py-2 rounded bg-red-600 text-white hover:opacity-90 transition shadow"
            >
              Delete Exercise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailPage;
