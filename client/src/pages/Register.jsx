import React, { useState } from "react";
import API from "../services/apiService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // 🚨 Prevent page refresh

    console.log("Sending:", { name, email, password });

    if (!name || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
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
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Join Smart Urban Governance today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
                         bg-gray-50 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
                         bg-gray-50 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 
                         bg-gray-50 text-gray-800
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 
                         focus:border-emerald-500 transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 
                       text-white py-3 rounded-xl font-medium 
                       shadow-sm transition duration-300"
          >
            Register
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium transition"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;