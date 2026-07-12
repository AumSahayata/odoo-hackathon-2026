import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import "../common.css";
import Toast from "../components/Toast";
import { useAuth } from "../context/AuthContext";

const roles = [
  {
    name: "FLEET_MANAGER",
    scope: "Fleet · Maintenance",
    label: "Fleet Manager",
  },
  { name: "DISPATCHER", scope: "Dashboard · Trips", label: "Dispatcher" },
  {
    name: "SAFETY_OFFICER",
    scope: "Drivers · Compliance",
    label: "Safety Officer",
  },
  {
    name: "FINANCIAL_ANALYST",
    scope: "Fuel & Expenses · Analytics",
    label: "Financial Analyst",
  },
];

const roleOptions = roles.map((r) => ({ value: r.name, label: r.label }));

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(10, 13, 16, 0.6)",
    borderColor: state.isFocused ? "#F28C0F" : "rgba(255, 255, 255, 0.08)",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(242, 140, 15, 0.15), 0 0 10px rgba(242, 140, 15, 0.1)"
      : "none",
    borderRadius: "8px",
    padding: "0.08rem 0.1rem",
    outline: "none",
    "&:hover": {
      borderColor: state.isFocused ? "#F28C0F" : "rgba(255, 255, 255, 0.15)",
    },
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#111419",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#F28C0F"
      : state.isFocused
        ? "rgba(255, 255, 255, 0.04)"
        : "transparent",
    color: state.isSelected ? "#0E1013" : "#AEB5C2",
    cursor: "pointer",
    fontSize: "0.92rem",
    padding: "0.65rem 0.9rem",
    "&:active": {
      backgroundColor: state.isSelected
        ? "#F28C0F"
        : "rgba(255, 255, 255, 0.08)",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#F5F7FA",
    fontSize: "0.92rem",
  }),
  input: (provided) => ({
    ...provided,
    color: "#F5F7FA",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#646C7A",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: state.isFocused ? "#F28C0F" : "#AEB5C2",
    "&:hover": {
      color: "#F5F7FA",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};

const Signup = () => {
  const [showPass, setShowPass] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [signUp, setSignUp] = useState({
    email: "",
    password: "",
    role: "DISPATCHER",
  });

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signUp.email || !signUp.password || !signUp.role) {
      setToast({ message: "Please fill in all fields.", type: "error" });
      return;
    }
    if (signUp?.password !== confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      await register(signUp?.email, signUp?.password, signUp?.role);
      setToast({
        message: "Account created successfully! Redirecting to login...",
        type: "success",
      });
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

  const handldeInputChange = useCallback((name, value) => {
    setSignUp((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
          {roles?.map((r) => (
            <div
              key={r?.name}
              className={`to-role-item ${signUp.role === r?.name ? "active" : ""}`}
              onClick={() => handldeInputChange("role", r?.name)}
            >
              <span className="to-role-dot"></span>
              {r?.label}
              <span className="to-role-scope mono">{r?.scope}</span>
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
                placeholder="Enter your email"
                autoComplete="email"
                value={signUp.email}
                onChange={(e) => handldeInputChange("email", e.target.value)}
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
                  value={signUp.password}
                  onChange={(e) =>
                    handldeInputChange("password", e.target.value)
                  }
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
              <Select
                id="role"
                options={roleOptions}
                value={roleOptions.find((o) => o.value === signUp.role)}
                onChange={(option) =>
                  handldeInputChange("role", option ? option?.value : "")
                }
                isDisabled={loading}
                styles={customSelectStyles}
                isSearchable={false}
              />
            </div>

            <button
              type="submit"
              className="to-signin-btn"
              style={{ marginTop: "0.25rem" }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <div
            style={{
              marginTop: "1rem",
              textAlign: "center",
              fontSize: "0.85rem",
              color: "var(--text-mid)",
            }}
          >
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
