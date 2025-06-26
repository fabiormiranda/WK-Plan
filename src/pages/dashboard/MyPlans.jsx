import React from "react";

const samplePlans = [
  { id: 1, name: "Beginner Plan", description: "3 workouts per week" },
  { id: 2, name: "Strength Plan", description: "Focus on weightlifting" },
];

function MyPlans() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Plans</h1>
      {samplePlans.length === 0 ? (
        <p>You have no workout plans yet.</p>
      ) : (
        <ul>
          {samplePlans.map((plan) => (
            <li key={plan.id} className="mb-4 bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p>{plan.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyPlans;
