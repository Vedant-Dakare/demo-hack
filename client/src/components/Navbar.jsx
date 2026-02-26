import React from "react";
import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    setTimeout(() => {
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    }, 1500);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100/80 shadow-[0_1px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-[4.5rem]">

          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-xl group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105 ring-1 ring-white/20">
                <svg
                  className="w-5.5 h-5.5 text-white drop-shadow-sm"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              </div>
              {/* Active Status Dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>

            <div className="hidden sm:block">
              <span className="text-lg font-extrabold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent group-hover:from-emerald-700 group-hover:via-emerald-600 group-hover:to-teal-600 transition-all duration-300 tracking-tight">
                Smart Urban
              </span>
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] -mt-0.5">
                Governance Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">

            {user && (
              <>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 border border-transparent hover:border-blue-100/80"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300">
                      <span className="text-sm">⚙️</span>
                    </div>
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 border border-transparent hover:border-blue-100/80"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300">
                        <span className="text-sm">📊</span>
                      </div>
                      Dashboard
                    </Link>

                    <Link
                      to="/submit"
                      className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700 transition-all duration-300 border border-transparent hover:border-emerald-100/80"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors duration-300">
                        <span className="text-sm">📝</span>
                      </div>
                      Report Issue
                    </Link>
                  </>
                )}

                {/* User Badge */}
                <div className="mx-2 h-8 w-px bg-gray-200/80"></div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/60">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm ring-1 ring-white/20">
                    <span className="text-xs font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-600 hidden lg:block max-w-[80px] truncate">
                    {user?.name || "User"}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="group flex items-center gap-2 ml-1 px-4 py-2.5 border border-gray-200/80 text-sm font-semibold text-gray-500 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:border-red-200/80 hover:text-red-600 transition-all duration-300 hover:shadow-md hover:shadow-red-100/30"
                >
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/"
                  className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200/60"
                >
                  <div className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors duration-300">
                    <span className="text-sm">🔑</span>
                  </div>
                  Login
                </Link>

                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ring-1 ring-white/20"
                >
                  <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <span className="text-xs">✨</span>
                  </div>
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${mobileOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileOpen ? "max-h-[500px] opacity-100 pb-5" : "max-h-0 opacity-0"}`}>
          <div className="pt-3 space-y-1.5 border-t border-gray-100/80">

            {user && (
              <>
                {/* User Info Mobile */}
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/60">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md ring-1 ring-white/20">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{user?.name || "User"}</p>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      {user?.role === "admin" ? "Administrator" : "Citizen"}
                    </p>
                  </div>
                </div>

                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                  >
                    <span className="text-base">⚙️</span>
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-300"
                    >
                      <span className="text-base">📊</span>
                      Dashboard
                    </Link>

                    <Link
                      to="/submit"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-300"
                    >
                      <span className="text-base">📝</span>
                      Report Issue
                    </Link>
                  </>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-200/80 text-sm font-bold text-red-600 rounded-xl bg-red-50/50 hover:bg-red-50 transition-all duration-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all duration-300"
                >
                  <span className="text-base">🔑</span>
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 ring-1 ring-white/20"
                >
                  <span className="text-sm">✨</span>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;