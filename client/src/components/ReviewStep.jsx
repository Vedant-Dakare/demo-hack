import React from "react";
import { useNavigate } from "react-router-dom";

function ReviewStep({
  description,
  priority,
  location,
  prevStep,
  handleSubmit,
  loading ,
}) {
  const getPriorityStyle = (p) => {
    switch (p?.toLowerCase()) {
      case "high":
        return {
          bg: "bg-gradient-to-r from-red-50 to-rose-50",
          text: "text-red-700",
          badge: "bg-red-500",
          border: "border-red-200/60",
          icon: "🔴",
          ring: "ring-red-100",
        };
      case "medium":
        return {
          bg: "bg-gradient-to-r from-amber-50 to-orange-50",
          text: "text-amber-700",
          badge: "bg-amber-500",
          border: "border-amber-200/60",
          icon: "🟡",
          ring: "ring-amber-100",
        };
      case "low":
        return {
          bg: "bg-gradient-to-r from-emerald-50 to-green-50",
          text: "text-emerald-700",
          badge: "bg-emerald-500",
          border: "border-emerald-200/60",
          icon: "🟢",
          ring: "ring-emerald-100",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-gray-50 to-slate-50",
          text: "text-gray-700",
          badge: "bg-gray-500",
          border: "border-gray-200/60",
          icon: "⚪",
          ring: "ring-gray-100",
        };
    }
  };

  const priorityStyle = getPriorityStyle(priority);
    const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Step Counter Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">3</span>
          </div>
          <p className="text-xs font-bold text-blue-700 tracking-wide">
            Step 3 of 3 — Final Review
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl drop-shadow-sm">✅</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent tracking-tight">
            Review & Submit
          </h2>
        </div>
        <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
          Almost done! Please review all the information below before submitting
          your complaint. 📋
        </p>
      </div>

      {/* Review Card */}
      <div className="relative bg-white/80 backdrop-blur-xl border border-gray-100/80 rounded-[1.5rem] p-6 sm:p-8 shadow-lg shadow-blue-50/50 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-indigo-100/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-violet-100/20 to-blue-100/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative space-y-5">
          {/* Section Title */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-sm">📝</span>
            </div>
            <h3 className="text-base font-extrabold text-gray-900">
              Complaint Summary
            </h3>
          </div>

          {/* Category removed - auto-detected by model */}

          {/* Priority */}
          <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50/80 to-blue-50/30 border border-gray-100/80 hover:border-blue-200/60 hover:shadow-md transition-all duration-300 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span className="text-lg">⚡</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Priority
                </p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  Urgency Level
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${priorityStyle.bg} ${priorityStyle.border} border shadow-sm ring-2 ${priorityStyle.ring}`}
            >
              <span className="text-sm">{priorityStyle.icon}</span>
              <span className={`text-sm font-bold ${priorityStyle.text}`}>
                {priority || "Not set"}
              </span>
            </span>
          </div>

          {/* Description */}
          <div className="group p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50/80 to-blue-50/30 border border-gray-100/80 hover:border-blue-200/60 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Description
                </p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  Issue Details
                </p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 shadow-inner">
              <p className="text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                {description || "No description provided"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="group p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gray-50/80 to-blue-50/30 border border-gray-100/80 hover:border-blue-200/60 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <span className="text-lg">📍</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  Location
                </p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">
                  Issue Address
                </p>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 shadow-inner">
              <div className="flex items-start gap-2.5">
                <span className="text-base mt-0.5 flex-shrink-0">🏠</span>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">
                  {location || "No location selected"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Notice */}
      <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/80 to-violet-50/60 border border-blue-200/50 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200/60 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-sm">ℹ️</span>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-800 mb-1">
              Before You Submit
            </p>
            <p className="text-xs text-blue-700/80 font-medium leading-relaxed">
              Once submitted, your complaint will be reviewed by the municipal
              authorities. You'll receive updates on the progress through your
              dashboard. Make sure all details are accurate. 🏛️
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-4 mt-10 pt-6 border-t border-gray-100">
        <button
          onClick={prevStep}
          className="group flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 border border-gray-200/60 transition-all duration-300 hover:shadow-md text-sm"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Edit
        </button>

        <button 
          onClick={async () => {
            await handleSubmit();
            navigate("/dashboard");
        }}
          className="group relative flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 rounded-xl font-bold text-sm
                     bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600
                     hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700
                     text-white shadow-xl shadow-emerald-500/25
                     hover:shadow-2xl hover:shadow-emerald-500/30
                     hover:-translate-y-0.5 active:translate-y-0
                     transition-all duration-300 ring-1 ring-white/20 overflow-hidden"
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

          <div className="relative flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
              <span className="text-sm">🚀</span>
            </div>
            Submit Complaint
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}

export default ReviewStep;