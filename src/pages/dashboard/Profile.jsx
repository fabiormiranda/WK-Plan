import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

function Profile() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plansCount, setPlansCount] = useState(0);
  const [recentPlans, setRecentPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/workout-plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userPlans = res.data.filter(
          plan => plan.user === user._id || plan.user?._id === user._id
        );
        setPlansCount(userPlans.length);
        setRecentPlans(userPlans.slice(-3).reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlans();
  }, [user]);

  if (!user) return null;

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.name
  )}&background=FF6B00&color=fff&size=128`;

  return (
    <div className="px-6 pt-8 pb-10 max-w-xl mx-auto" style={{ color: "var(--color-text)" }}>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-20 h-20 rounded-full border-2 border-[var(--color-accent)] object-cover"
        />
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-[var(--color-accent)]">Your Profile</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Welcome back to WK-Plan, {user.name.split(" ")[0]}!
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-1 text-sm">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-semibold text-[var(--color-accent)] mb-2">Your Stats</h2>
        <p>You have created <strong>{plansCount}</strong> workout plan{plansCount !== 1 && "s"}.</p>
      </div>

      {recentPlans.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[var(--color-accent)] mb-2">Recent Plans</h2>
          <ul className="list-disc ml-5 space-y-1 text-sm">
            {recentPlans.map(plan => (
              <li key={plan._id}>
                <button
                  onClick={() => navigate(`/dashboard/my-plans/${plan._id}`)}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {plan.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate("/dashboard/change-password")}
          className="bg-[var(--color-accent)] text-white px-4 py-2 rounded hover:bg-[var(--color-accent-dark)] text-sm"
        >
          Change Password
        </button>
        <button
          onClick={logoutUser}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
