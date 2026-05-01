import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Update login status whenever the location (URL) changes
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link
          to="/"
          style={{ fontWeight: "bold", fontSize: "1.2rem", color: "inherit" }}
        >
          Fisher
        </Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/reports">Reports</Link>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                border: "1px solid #444",
                color: "white",
                padding: "0.4rem 0.8rem",
                borderRadius: "4px",
                cursor: "pointer",
                marginLeft: "1rem",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
