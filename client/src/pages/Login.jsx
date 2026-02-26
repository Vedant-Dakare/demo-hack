import React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      }, { withCredentials: true });

      const token = res.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);
      setUser(decoded);

      toast.success("Login successful!");
      setTimeout(() => {
        if (decoded.role === "admin") {
          navigate("/admin");
        } else if (decoded.role === "worker") {
          navigate("/worker");
        } else {
          navigate("/dashboard");
        }
      }, 2500);

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4ff] px-6 relative overflow-hidden">

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-52 -left-52 w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-teal-200/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-52 -right-52 w-[600px] h-[600px] bg-gradient-to-tl from-blue-200/40 to-indigo-200/20 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-violet-200/15 to-pink-200/15 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-200/80 shadow-xl rounded-2xl p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to continue to Smart Urban Governance
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
                         bg-gray-50 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
                         bg-gray-50 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500 transition"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-emerald-600 hover:bg-emerald-700 
                       text-white py-3 rounded-xl font-medium 
                       shadow-sm transition duration-300"
          >
            Login
          </button>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
