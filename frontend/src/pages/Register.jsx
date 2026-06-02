import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
    adminCode: "",
  });

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, form);

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-section">
      <span className="eyebrow">Create account</span>
      <h2>Register</h2>

      <form onSubmit={registerUser}>
        <label>
          Full name
          <input
            placeholder="Enter full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            placeholder="Enter email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>

        <label>
          Account type
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="citizen">Citizen</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {form.role === "admin" && (
          <label>
            Admin code
            <input
              type="password"
              placeholder="Enter admin code"
              value={form.adminCode}
              onChange={(e) => setForm({ ...form, adminCode: e.target.value })}
              required
            />
          </label>
        )}

        <button type="submit">Register</button>
      </form>

      <p className="auth-link">
        Already have account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default Register;
