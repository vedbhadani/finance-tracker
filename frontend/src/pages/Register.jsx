import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.register({ name, email, password });
      setSuccess(true);
      // Automatically redirect after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Registration failed. Try a different email.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="container"
        style={{ maxWidth: "400px", marginTop: "10vh" }}
      >
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#4caf50" }}>Success!</h2>
          <p>Your account has been created. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "10vh" }}>
      <div className="card">
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          Create Account
        </h2>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "0.8rem",
              borderRadius: "4px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "1rem",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "0.9rem",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
