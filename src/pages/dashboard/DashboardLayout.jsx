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
    <div className="bg-[var(--color-bg)] min-h-screen">
      <aside
        className="fixed top-0 left-0 h-screen w-60 p-4 flex flex-col bg-[var(--color-bg-card)] text-[var(--color-text)] border-r border-[var(--color-accent)] overflow-y-auto"
      >
        <h2
          className="text-xl font-bold mb-6 pl-2"
          style={{ color: "var(--color-accent)" }}
        >
          WK-Plan
        </h2>

        <nav className="flex flex-col gap-2 flex-grow">
          {[
            { to: "/dashboard/exercises", label: "📋 Exercises" },
            { to: "/dashboard/my-plans", label: "🗓️ My Plans" },
            { to: "/dashboard/profile", label: "👤 Profile" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`p-3 rounded-md font-medium transition flex items-center gap-2 pl-3 ${
                isActive(item.to)
                  ? "bg-[var(--color-accent)] text-white shadow-inner border-l-4 border-[var(--color-accent)]"
                  : "hover:bg-[var(--color-accent)] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="flex-grow" />

          <Link
            to="/dashboard/create-plan"
            className="p-3 rounded-md font-semibold text-center bg-[var(--color-accent)] text-white hover:opacity-90 transition shadow-md"
          >
            Create Plan
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-4 p-3 rounded-md font-semibold text-center bg-red-600 hover:bg-red-700 text-white transition shadow-md"
        >
          Logout
        </button>
      </aside>

      <main
        className="ml-60 flex-grow px-8 pb-0 overflow-y-auto"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
