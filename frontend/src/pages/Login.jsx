import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-center">Welcome Back</h2>

        {error && <p className="mb-3 text-center text-red-500">{error}</p>}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={onChange}
            required
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            required
            className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300"
          />

          <button
            type="submit"
            className="w-full py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-700">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
