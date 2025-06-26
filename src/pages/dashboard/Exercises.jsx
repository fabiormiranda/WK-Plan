import React from "react";

function Exercises() {
  // Depois buscar os exercícios do backend
  const exercises = [
    { id: 1, name: "Push-up", muscle: "Chest" },
    { id: 2, name: "Squat", muscle: "Legs" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exercises</h1>
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id} className="mb-3 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">{ex.name}</h2>
            <p>Muscle group: {ex.muscle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exercises;
