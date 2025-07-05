import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function DashboardLayout() {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex bg-[var(--color-bg)] min-h-screen">
      <aside
        className="w-64 p-6 flex flex-col bg-[var(--color-bg-card)] text-[var(--color-text)]"
        style={{ maxHeight: "fit-content" }}
      >
        <h2
          className="text-xl font-bold mb-8 text-center"
          style={{ color: "var(--color-accent)" }}
        >
          WK-Plan Dashboard
        </h2>
        <nav className="flex flex-col gap-4 flex-grow">
          <Link
            to="/dashboard/exercises"
            className={`p-3 rounded font-semibold transition ${
              isActive("/dashboard/exercises")
                ? "bg-[var(--color-accent)] text-white shadow-lg"
                : "text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white"
            }`}
          >
            Exercises
          </Link>
          <Link
            to="/dashboard/my-plans"
            className={`p-3 rounded font-semibold transition ${
              isActive("/dashboard/my-plans")
                ? "bg-[var(--color-accent)] text-white shadow-lg"
                : "text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white"
            }`}
          >
            My Plans
          </Link>
          <Link
            to="/dashboard/profile"
            className={`p-3 rounded font-semibold transition ${
              isActive("/dashboard/profile")
                ? "bg-[var(--color-accent)] text-white shadow-lg"
                : "text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white"
            }`}
          >
            Profile
          </Link>

          <div className="flex-grow" />

          <Link
            to="/dashboard/create-plan"
            className="p-3 rounded font-semibold text-center cursor-pointer bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] transition shadow-lg"
          >
            Create Plan
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-7 p-3 rounded font-semibold cursor-pointer bg-red-600 hover:bg-red-700 text-white transition"
        >
          Logout
        </button>
      </aside>

      <main
        className="flex-grow pt-8 px-8 pb-0 overflow-y-auto"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
