import API from "../api/axios";
// import axios from 'axios'
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.jpeg';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // console.log('Attempting login with:', { email: form.email });
      const res = await API.post("http://localhost:5000/api/admin/login", form);
      // console.log('Login response:', res.data);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      // console.error('Login error:', err.message);
      // console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <img src={logo} alt="Logo" className="login-logo" />
            <h1 className="login-title">The Quick Point</h1>
           
          </div>
          
          <h2>Admin Login</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={submit}>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
