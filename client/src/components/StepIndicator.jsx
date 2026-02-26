import React from "react";

function StepIndicator({ step }) {
  const steps = ["Details", "Location", "Review"];
  const progressWidth = ((step - 1) / (steps.length - 1)) * 100;

  const stepIcons = ["✏️", "📍", "✅"];

  return (
    <div className="relative mb-16 px-2 sm:px-4">

      {/* Background Card */}
      <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-100/80 shadow-lg shadow-blue-50/50">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
            Step {step} of {steps.length}
          </p>
          <h3 className="text-lg font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 bg-clip-text text-transparent">
            {steps[step - 1]}
          </h3>
        </div>

        {/* Progress Track */}
        <div className="relative mb-6">

          {/* Background Line */}
          <div className="absolute top-5 left-[12%] right-[12%] h-[3px] bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full"></div>

          {/* Active Progress Line */}
          <div
            className="absolute top-5 left-[12%] h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out shadow-sm shadow-blue-500/20"
            style={{ width: `${progressWidth * 0.76}%` }}
          ></div>

          {/* Animated Glow on Progress Line */}
          <div
            className="absolute top-[18px] left-[12%] h-[5px] bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-violet-400/0 rounded-full blur-sm transition-all duration-700 ease-out"
            style={{ width: `${progressWidth * 0.76}%` }}
          ></div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((label, index) => {
              const isActive = step === index + 1;
              const isCompleted = step > index + 1;

              return (
                <div key={index} className="flex flex-col items-center group" style={{ width: `${100 / steps.length}%` }}>

                  {/* Circle Container */}
                  <div className="relative">

                    {/* Pulse Ring for Active */}
                    {isActive && (
                      <div className="absolute inset-0 -m-1.5 rounded-full bg-blue-400/20 animate-ping"></div>
                    )}

                    {/* Outer Glow for Active */}
                    {isActive && (
                      <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-blue-200/50 to-indigo-200/50 blur-sm"></div>
                    )}

                    {/* Circle */}
                    <div
                      className={`
                        relative w-10 h-10 flex items-center justify-center rounded-full
                        text-sm font-bold transition-all duration-500 ease-out
                        ${
                          isCompleted
                            ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-white shadow-lg shadow-blue-500/30 ring-[3px] ring-blue-100 scale-100"
                            : isActive
                            ? "bg-white text-blue-600 shadow-xl shadow-blue-200/50 ring-[3px] ring-blue-400/60 scale-110"
                            : "bg-gray-50 text-gray-300 ring-2 ring-gray-200 scale-95"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={`${isActive ? "text-base" : "text-sm"} transition-all duration-300`}>
                          {stepIcons[index]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <p
                      className={`text-[11px] sm:text-xs font-bold tracking-wide transition-all duration-500 ${
                        isCompleted
                          ? "text-blue-600"
                          : isActive
                          ? "text-indigo-700"
                          : "text-gray-300"
                      }`}
                    >
                      {label}
                    </p>
                    {isCompleted && (
                      <p className="text-[9px] text-emerald-500 font-semibold mt-0.5 tracking-wider uppercase">
                        Done
                      </p>
                    )}
                    {isActive && (
                      <p className="text-[9px] text-blue-400 font-semibold mt-0.5 tracking-wider uppercase">
                        Current
                      </p>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
            <span className="text-[11px] font-extrabold text-indigo-600">
              {Math.round(progressWidth)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progressWidth}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StepIndicator;