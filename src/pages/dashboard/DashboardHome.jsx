import React from "react";

const sampleExercises = [
  { id: 1, name: "Push-ups", description: "Great chest exercise" },
  { id: 2, name: "Squats", description: "Strengthen your legs" },
  { id: 3, name: "Plank", description: "Core stability" },
  { id: 4, name: "Lunges", description: "Improve balance and legs" },
  { id: 5, name: "Burpees", description: "Full body workout" },
  { id: 6, name: "Crunches", description: "Core muscle exercise" },
];

function DashboardHome() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Exercises</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sampleExercises.map((ex) => (
          <div key={ex.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{ex.name}</h3>
            <p>{ex.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardHome;
