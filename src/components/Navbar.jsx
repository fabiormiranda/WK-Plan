import { Link, useLocation } from "react-router-dom";
import logo from "../assets/wk-plan-logo.png";

function Navbar() {
  const location = useLocation();

  // Esconder navbar em páginas do dashboard
  if (location.pathname.startsWith("/dashboard")) {
    return null;
  }

  const links = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
  ];

  return (
    <nav
      className="shadow flex items-center justify-between px-6 py-3 sticky top-0 z-50"
      style={{
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-bg-card)",
      }}
    >
      <div className="flex items-center gap-3">
        <Link to="/">
          <img
            src={logo}
            alt="WK-Plan logo"
            className="w-12 md:w-14 h-auto object-contain"
            style={{ display: "block", cursor: "pointer" }}
          />
        </Link>
      </div>

      <div className="flex gap-4">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={
              location.pathname === link.to
                ? {
                    background: "var(--color-accent)",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                    borderRadius: "8px",
                    padding: "7px 20px",
                  }
                : {
                    color: "var(--color-accent)",
                    borderRadius: "8px",
                    padding: "7px 20px",
                    transition: "background 0.2s, color 0.2s",
                  }
            }
            onMouseOver={(e) => {
              e.currentTarget.style.background = "var(--color-accent)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              if (location.pathname !== link.to) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-accent)";
              }
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
