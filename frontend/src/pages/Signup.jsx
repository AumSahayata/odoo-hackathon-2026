import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../common.css";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const roles = [
  { name: "Fleet Manager", scope: "Fleet · Maintenance" },
  { name: "Dispatcher", scope: "Dashboard · Trips" },
  { name: "Safety Officer", scope: "Drivers · Compliance" },
  { name: "Financial Analyst", scope: "Fuel & Expenses · Analytics" },
];

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("Dispatcher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await register(email, password, role);
      setToast({ message: "Account created successfully! Redirecting to login...", type: "success" });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setToast({
        message: error.message || "Registration failed. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="to-stage">
      <aside className="to-brand">
        <svg
          className="to-route-svg"
          viewBox="0 0 400 700"
          preserveAspectRatio="none"
        >
          <path
            d="M -20 620 C 80 600, 60 480, 160 460 S 260 380, 220 300 S 340 180, 300 80"
            fill="none"
            stroke="#3A4552"
            strokeWidth="2"
            strokeDasharray="1 10"
            strokeLinecap="round"
          />
          <circle cx="-20" cy="620" r="4" fill="#3A4552" />
          <circle cx="300" cy="80" r="4" fill="#CC7A0E" />
        </svg>

        <div className="to-mark">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ECEEF1"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 16V7a1 1 0 0 1 1-1h9v10" />
            <path d="M13 10h4l3 3v3h-2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>

        <div className="to-brand-name">TransitOps</div>
        <div className="to-brand-tag">Smart Transport Operations Platform</div>

        <div className="to-role-block">
          <div className="to-role-eyebrow">Choose your operational role</div>
          {roles.map((r) => (
            <div
              key={r.name}
              className={`to-role-item ${role === r.name ? "active" : ""}`}
              onClick={() => setRole(r.name)}
            >
              <span className="to-role-dot"></span>
              {r.name}
              <span className="to-role-scope mono">{r.scope}</span>
            </div>
          ))}
        </div>

        <div className="to-brand-foot">
          <span>© 2026 TransitOps</span>
          <span className="mono">RBAC ENABLED</span>
        </div>
      </aside>

      <main className="to-auth">
        <div className="to-auth-card">
          <span className="to-session-chip mono">
            <span className="to-session-dot"></span> Account · Registration
          </span>

          <div className="to-auth-title">Create your account</div>
          <div className="to-auth-sub">Register to access the platform.</div>

          <form onSubmit={handleSubmit}>
            <div className="to-field">
              <label className="to-field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="to-input"
                placeholder="raven.k@transitops.in"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="to-field">
              <label className="to-field-label" htmlFor="password">
                Password
              </label>
              <div className="to-pass-wrap">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="to-input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="to-pass-toggle mono"
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>

            <div className="to-field">
              <label className="to-field-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPass ? "text" : "password"}
                className="to-input"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="to-field">
              <label className="to-field-label" htmlFor="role">
                Role (RBAC)
              </label>
              <select
                id="role"
                className="to-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                {roles.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="to-signin-btn" style={{ marginTop: "0.25rem" }} disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <div style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-mid)" }}>
            Already have an account?{" "}
            <Link to="/" className="to-forgot-link">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Signup;
