import React, { useState, useRef, useCallback } from "react";

function DetailsStep({
  description,
  setDescription,
  priority,
  setPriority,
  image,
  setImage,
  nextStep,
  prevStep,
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Open Camera ---
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      alert("Camera access denied or not available.");
      console.error(err);
    }
  };

  // --- Capture Photo ---
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `photo-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        setImage(file);
        setPreview(URL.createObjectURL(file));
        closeCamera();
      },
      "image/jpeg",
      0.8
    );
  }, [setImage]);

  // --- Close Camera ---
  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  };

  // --- Handle File Upload ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // --- Remove Image ---
  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800">
          Provide Details
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Help us understand the issue better by adding details and a photo.
        </p>
      </div>

      <div className="space-y-10">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            placeholder="Describe the issue clearly and in detail..."
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl
                       bg-gray-50 focus:bg-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition resize-none text-sm shadow-sm"
          />
        </div>

        {/* Camera / Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Add Photo (Optional)
          </label>

          {/* ---- Live Camera View ---- */}
          {isCameraOpen ? (
            <div className="rounded-2xl overflow-hidden border-2 border-blue-400 
                            bg-black relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-[400px] object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex justify-center gap-4 p-4 bg-gray-900/70">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-6 py-3 bg-white text-gray-800 font-medium
                             rounded-xl hover:bg-gray-100 transition
                             flex items-center gap-2"
                >
                  📸 Capture
                </button>
                <button
                  type="button"
                  onClick={closeCamera}
                  className="px-6 py-3 bg-red-500 text-white font-medium
                             rounded-xl hover:bg-red-600 transition
                             flex items-center gap-2"
                >
                  ✖ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* ---- Choose Options (no camera open) ---- */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Take Picture — now opens webcam */}
                <button
                  type="button"
                  onClick={openCamera}
                  className="flex flex-col items-center justify-center
                             border-2 border-dashed border-gray-300
                             rounded-2xl p-8 cursor-pointer
                             hover:border-blue-500 hover:bg-blue-50
                             transition-all duration-300 text-center
                             bg-white"
                >
                  <span className="text-3xl">📷</span>
                  <p className="mt-3 font-medium text-gray-700">
                    Take Picture
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Open camera
                  </p>
                </button>

                {/* Upload From Device — stays the same */}
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center
                             border-2 border-dashed border-gray-300
                             rounded-2xl p-8 cursor-pointer
                             hover:border-blue-500 hover:bg-blue-50
                             transition-all duration-300 text-center"
                >
                  <span className="text-3xl">🖼️</span>
                  <p className="mt-3 font-medium text-gray-700">
                    Upload Image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    From gallery
                  </p>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  id="fileUpload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </>
          )}

          {/* ---- Image Preview ---- */}
          {preview && !isCameraOpen && (
            <div className="mt-5 p-4 bg-green-50 border border-green-200 
                            rounded-xl flex items-center gap-4">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <p className="text-sm text-green-700 font-medium">
                  {image?.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Photo ready to upload
                </p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="text-red-500 hover:text-red-700 text-sm 
                           font-medium transition"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-14">
        <button
          onClick={prevStep}
          className="px-8 py-3 rounded-xl border border-gray-300 
                     text-gray-700 hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          className="px-10 py-3 rounded-xl bg-blue-600
                     text-white font-medium
                     hover:bg-blue-700 transition shadow-md"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default DetailsStep;