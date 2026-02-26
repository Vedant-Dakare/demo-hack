import React from "react";

const categories = [
  { name: "Road", icon: "🚗" },
  { name: "Electricity", icon: "💡" },
  { name: "Water", icon: "🗑️" },
  { name: "Sanitation", icon: "🚰" },
  { name: "Other", icon: "🌊" },
];

function CategoryStep({ category, setCategory, nextStep }) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

      {/* Step Counter Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 shadow-sm">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-bold text-white">1</span>
          </div>
          <p className="text-xs font-bold text-blue-700 tracking-wide">
            Step 1 of 4
          </p>
        </div>
      </div>

      {/* Title Section */}
      <div className="mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3 tracking-tight">
          Tell Us About the Issue
        </h2>
        <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-lg">
          Please select the type of problem you encountered. This helps us route your complaint to the right department. 🎯
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 mb-12">

        {categories.map((item) => (
          <div
            key={item.name}
            onClick={() => setCategory(item.name)}
            className={`
              group relative p-5 sm:p-7 rounded-2xl cursor-pointer text-center 
              transition-all duration-500 ease-out overflow-hidden
              border-2
              ${
                category === item.name
                  ? "border-blue-400 bg-gradient-to-br from-blue-50 via-indigo-50/80 to-violet-50/60 shadow-xl shadow-blue-200/30 scale-[1.02] ring-4 ring-blue-100/50"
                  : "border-gray-100 bg-white/80 backdrop-blur-sm hover:border-blue-200/60 hover:shadow-lg hover:shadow-blue-100/20 hover:-translate-y-1 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30"
              }
            `}
          >
            {/* Background Decoration */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${
              category === item.name ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            }`}>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-indigo-200/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-tr from-violet-200/20 to-blue-200/10 rounded-full blur-lg"></div>
            </div>

            {/* Content */}
            <div className="relative">
              {/* Icon */}
              <div className={`text-4xl sm:text-5xl mb-4 transition-all duration-500 drop-shadow-sm ${
                category === item.name 
                  ? "scale-110 -rotate-3" 
                  : "group-hover:scale-110 group-hover:rotate-3"
              }`}>
                {item.icon}
              </div>

              {/* Category Name */}
              <p className={`text-sm sm:text-base font-bold tracking-wide transition-colors duration-300 ${
                category === item.name 
                  ? "bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent" 
                  : "text-gray-600 group-hover:text-gray-800"
              }`}>
                {item.name}
              </p>

              {/* Subtle Description Line */}
              <div className={`mt-2 mx-auto w-8 h-0.5 rounded-full transition-all duration-500 ${
                category === item.name
                  ? "bg-gradient-to-r from-blue-400 to-indigo-400 w-12"
                  : "bg-gray-200 group-hover:bg-blue-200 group-hover:w-10"
              }`}></div>
            </div>

            {/* Selected Indicator - Checkmark */}
            {category === item.name && (
              <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 ring-2 ring-white animate-[bounceIn_0.4s_ease-out]">
                <svg className="w-4 h-4 text-white drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            )}

            {/* Unselected Hover Ring Indicator */}
            {category !== item.name && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            )}
          </div>
        ))}

      </div>

      {/* Selection Summary */}
      {category && (
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Selected Category</p>
            <p className="text-sm font-extrabold text-emerald-700">{category}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
        <button
          className="group flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 hover:text-gray-700 border border-gray-200/60 transition-all duration-300 hover:shadow-md text-sm"
        >
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <button
          disabled={!category}
          onClick={nextStep}
          className={`
            group flex items-center gap-2 px-7 sm:px-8 py-3 rounded-xl font-semibold text-sm
            transition-all duration-300
            ${
              category
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 ring-1 ring-white/20"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }
          `}
        >
          Continue
          {category && (
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}

export default CategoryStep;