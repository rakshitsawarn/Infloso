import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [remember, setRemember] = useState(
        localStorage.getItem("mv_remember") === "true"
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        setError(null);

        if (!formData.identifier.trim() || !formData.password) {
            setError("Please enter both username/email and password.");
            return false;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/auth/login`, {
                identifier: formData.identifier,
                password: formData.password,
            });

            if (res.data?.success) {
                const { token, user } = res.data.data;

                if (remember) {
                    localStorage.setItem("mv_token", token);
                    localStorage.setItem("mv_user", JSON.stringify(user));
                    localStorage.setItem("mv_remember", "true");
                } else {
                    sessionStorage.setItem("mv_token", token);
                    sessionStorage.setItem("mv_user", JSON.stringify(user));
                    localStorage.setItem("mv_remember", "false");
                }

                setSuccessMsg("Login successful! Redirecting...");
                alert("User logged in successfully!");

                setTimeout(() => {
                    navigate("/");
                }, 500);
            } else {
                setError(res.data?.message || "Login failed");
            }
        } catch (err) {
            console.error(err);
            const msg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to login. Check your credentials or try again later.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 sm:p-6">
            <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-2xl sm:p-8 lg:p-10">
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                        MelodyVerse
                    </h1>
                    <p className="text-sm text-gray-600 sm:text-base">
                        Login to continue your music journey 🎵
                    </p>
                </div>

                {error && (
                    <div className="px-4 py-3 mb-4 text-red-700 border-l-4 border-red-500 rounded bg-red-50">
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="px-4 py-3 mb-4 text-green-700 border-l-4 border-green-500 rounded bg-green-50">
                        <p className="text-sm font-medium">{successMsg}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="identifier" className="block mb-1 text-sm font-semibold text-gray-700">
                            Username or Email
                        </label>
                        <input
                            id="identifier"
                            name="identifier"
                            type="text"
                            value={formData.identifier}
                            onChange={handleInputChange}
                            placeholder="Enter username or email"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label="Toggle password visibility"
                                className="absolute text-sm font-medium text-indigo-600 -translate-y-1/2 right-3 top-1/2 hover:text-indigo-700 focus:outline-none"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label htmlFor="remember" className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                            />
                            Remember me
                        </label>

                        
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 font-bold text-white transition duration-200 transform rounded-lg shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}