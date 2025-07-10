import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaDumbbell,
  FaClipboardList,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

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
        const res = await axios.get(`${API_URL}/workout-plans`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userPlans = res.data.filter(
          (plan) => plan.user === user._id || plan.user?._id === user._id
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
    <div
      className="mt-20 px-6 pb-10 max-w-md mx-auto rounded-lg shadow-lg"
      style={{ backgroundColor: "var(--color-bg-card)", color: "var(--color-text)" }}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-6 text-center mt-4">
        <div className="rounded-full border-4 border-white p-1.5 shadow">
          <img
            src={avatarUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold mb-1 text-[var(--color-accent)] flex items-center gap-2 mt-3">
          <FaUser /> Your Profile
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          Welcome back to WK-Plan, {user.name.split(" ")[0]}!
        </p>
      </div>

      {/* User Info */}
      <div className="mb-6 space-y-2 text-sm">
        <p className="flex items-center gap-2">
          <FaUser className="text-[var(--color-accent)]" /> <strong>Name:</strong> {user.name}
        </p>
        <p className="flex items-center gap-2">
          <FaEnvelope className="text-[var(--color-accent)]" /> <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <h2 className="text-base font-semibold text-[var(--color-accent)] mb-2 flex items-center gap-2">
          <FaDumbbell /> Your Stats
        </h2>
        <p>
          You have created{" "}
          <span className="text-[var(--color-accent)] font-semibold">{plansCount}</span>{" "}
          workout plan{plansCount !== 1 && "s"}.
        </p>
      </div>

      {/* Recent Plans */}
      {recentPlans.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-semibold text-[var(--color-accent)] mb-2 flex items-center gap-2">
            <FaClipboardList /> Recent Plans
          </h2>
          <ul className="list-none space-y-2">
            {recentPlans.map((plan) => (
              <li key={plan._id}>
                <button
                  onClick={() => navigate(`/dashboard/my-plans/${plan._id}`)}
                  className="w-full text-left px-3 py-2 rounded bg-[var(--color-bg)] hover:bg-[var(--color-accent)] hover:text-white transition text-sm shadow"
                >
                  {plan.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={() => navigate("/dashboard/change-password")}
          className="flex items-center justify-center gap-2 bg-white text-[var(--color-accent)] border border-[var(--color-accent)] px-4 py-2 rounded-lg hover:bg-[var(--color-accent)] hover:text-white text-sm shadow transition w-full sm:w-auto"
        >
          <FaLock /> Change Password
        </button>

        <button
          onClick={logoutUser}
          className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm shadow transition w-full sm:w-auto"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;