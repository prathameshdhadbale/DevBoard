import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/auth";
import "./LoginPage.css";




const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: wire to auth.api.js
      const data = isLogin
        ? await loginUser(formData.email, formData.password)
        : await registerUser(formData.name, formData.email, formData.password);
      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");

      }

      console.log("Form submitted:", formData);
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="login-brand">
          <div className="brand-dot" />
          DevBoard
        </div>
        <div className="login-tagline">
          Track every <em>opportunity.</em>
        </div>
        <p className="login-desc">
          Your internship hunt, organised. One board to see it all.
        </p>
        <div className="login-stats-preview">
          <div className="preview-stat">
            <span className="preview-num">18</span>
            <span className="preview-label">Applications</span>
          </div>
          <div className="preview-divider" />
          <div className="preview-stat">
            <span className="preview-num">4</span>
            <span className="preview-label">Interviews</span>
          </div>
          <div className="preview-divider" />
          <div className="preview-stat">
            <span className="preview-num">1</span>
            <span className="preview-label">Offer</span>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-card-eyebrow">
            {isLogin ? "Welcome back" : "Get started"}
          </div>
          <h1 className="login-card-title">
            {isLogin ? "Login to DevBoard" : "Create your account"}
          </h1>

          <form className="login-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="field">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Aadik"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              className="btn-primary full-width"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="login-toggle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button className="toggle-btn" onClick={toggleMode}>
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
