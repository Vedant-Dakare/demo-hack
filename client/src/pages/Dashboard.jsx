import React from "react";
import { useEffect, useState, useContext } from "react";
import API from "../services/apiService";
import { AuthContext } from "../context/AuthContext";
import ComplaintCard from "../components/ComplaintCard";
import { Link, Navigate } from "react-router-dom";

function Dashboard() {
  const { user } = useContext(AuthContext);

  // Admins cannot access user dashboard
  if (user && user.role === "admin") {
    return <Navigate to="/admin" />;
  }
  const [complaints, setComplaints] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    fetchComplaints();
    fetchUserProfile();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUserName(res.data.name);
    } catch (error) {
      // Fallback: try localStorage
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.name) setUserName(user.name);
      } catch (e) {
        console.error("Error getting user info");
      }
    }
  }

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === "Pending").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;

  const categoryStats = complaints.reduce((acc, complaint) => {
    const category = complaint.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const categoryIcons = {
    Roads: "🛣️",
    Water: "💧",
    Electricity: "⚡",
    Garbage: "🗑️",
    Sewage: "🚰",
    "Street Lights": "💡",
    Parks: "🌳",
    Traffic: "🚦",
    Noise: "🔊",
    Other: "📋",
  };

  const filteredComplaints =
    activeFilter === "all"
      ? complaints
      : activeFilter === "pending"
      ? complaints.filter((c) => c.status === "Pending")
      : complaints.filter((c) => c.status === "Resolved");

  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Welcome, {userName} 👋
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Overview of all civic complaints and their status
            </p>
          </div>
          <Link to="/submit" className="flex-shrink-0">
            <button className="group inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Report
            </button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">
                Total Reports
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{total}</p>
            <p className="text-xs text-slate-400 mt-1">All complaints</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">
                Pending
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{pending}</p>
            <p className="text-xs text-slate-400 mt-1">Awaiting action</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">
                Resolved
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{resolved}</p>
            <p className="text-xs text-slate-400 mt-1">Completed</p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">
                Resolution Rate
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-violet-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {resolvedPercent}%
            </p>
            <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${resolvedPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 xl:col-span-3 space-y-5">
            {complaints.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-5">
                  Resolution Progress
                </h3>
                <div className="flex justify-center mb-5">
                  <div className="relative w-28 h-28">
                    <svg
                      className="w-28 h-28 -rotate-90"
                      viewBox="0 0 112 112"
                    >
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="8"
                        strokeDasharray={`${
                          (resolvedPercent / 100) * 301.6
                        } 301.6`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-800">
                        {resolvedPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        resolved
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                      <span className="text-sm text-slate-600">Resolved</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {resolved}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <span className="text-sm text-slate-600">Pending</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">
                      {pending}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {complaints.length > 0 &&
              Object.keys(categoryStats).length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(categoryStats).map(([category, count]) => {
                      const icon = categoryIcons[category] || "📋";
                      const percent =
                        total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div
                          key={category}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-lg">{icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-slate-700 truncate">
                                {category}
                              </span>
                              <span className="text-xs font-semibold text-slate-500 ml-2">
                                {count}
                              </span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            <div className="bg-indigo-600 rounded-xl p-5 text-white">
              <h3 className="text-sm font-semibold mb-3">Quick Tips</h3>
              <div className="space-y-2.5">
                {[
                  "📸 Attach photos for faster resolution",
                  "📍 Add exact location details",
                  "📝 Describe the issue clearly",
                ].map((tip, i) => (
                  <p
                    key={i}
                    className="text-xs text-indigo-100 leading-relaxed"
                  >
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            {complaints.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm py-20 px-8 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <svg
                      className="w-7 h-7 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    No reports yet
                  </h3>
                  <p className="text-slate-400 mb-8 text-sm leading-relaxed">
                    Be the first to make a difference — report a civic issue in
                    your area.
                  </p>
                  <Link to="/submit">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all duration-200">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Submit First Report
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-800">
                      All Complaints
                      <span className="text-slate-400 font-normal ml-2 text-sm">
                        ({filteredComplaints.length})
                      </span>
                    </h2>
                    <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                      {[
                        { key: "all", label: "All" },
                        { key: "pending", label: "Pending" },
                        { key: "resolved", label: "Resolved" },
                      ].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setActiveFilter(f.key)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                            activeFilter === f.key
                              ? "bg-white text-slate-800 shadow-sm"
                              : "text-slate-500 hover:text-slate-700"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {filteredComplaints.length === 0 ? (
                  <div className="py-16 text-center">
                    <svg
                      className="w-10 h-10 text-slate-200 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-sm text-slate-400 font-medium">
                      No {activeFilter !== "all" ? activeFilter : ""} complaints
                      found
                    </p>
                  </div>
                ) : (
                  <div className="p-5 grid grid-cols-1 xl:grid-cols-2 gap-4 max-h-[700px] overflow-y-auto">
                    {filteredComplaints.map((c) => (
                      <ComplaintCard key={c._id} complaint={c} />
                    ))}
                  </div>
                )}

                {filteredComplaints.length > 0 && (
                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      {filteredComplaints.length} complaint
                      {filteredComplaints.length !== 1 ? "s" : ""} · Synced with
                      authorities
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">
                        Live
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;