import React, { useEffect, useState } from "react";
import API from "../services/apiService";

function WorkerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [statusMessage, setStatusMessage] = useState("");

  async function fetchComplaints() {
    try {
      const res = await API.get("/worker/tasks", {
        withCredentials: true,
      });
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching worker tasks", error);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleFileChange = (id, e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFiles((prev) => ({
      ...prev,
      [id]: file,
    }));
  };

  const handleStartWork = async (id) => {
    try {
      const res = await API.post(
        "/worker/start",
        { complaintId: id },
        { withCredentials: true }
      );

      setStatusMessage(
        res.data?.message || "Status updated to In Progress. Work started successfully."
      );
      fetchComplaints();
    } catch (error) {
      console.error(error);
      setStatusMessage("Failed to start work. Please try again.");
    }
  };

  const markCompleted = async (id) => {
    try {
      const selectedFile = selectedFiles[id];
      if (!selectedFile) {
        alert("Please upload completion photo before completing.");
        return;
      }

      let imageUrl = "";

      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      imageUrl = uploadRes.data.url;

      await API.post(
        `/worker/complete`,
        {
          complaintId: id,
          proofImageUrl: imageUrl,
        },
        { withCredentials: true }
      );

      setSelectedFiles((prev) => ({
        ...prev,
        [id]: null,
      }));
      fetchComplaints();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Worker Panel</h1>

        {statusMessage && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {statusMessage}
          </div>
        )}

        {complaints.map((c) => (
          <div
            key={c._id}
            className="bg-white p-5 rounded-lg border mb-4 shadow-sm"
          >
            <h3 className="font-semibold text-lg">{c.category}</h3>
            <p className="text-slate-600 mt-1">{c.description}</p>
            <p className="text-sm text-slate-400 mt-1">Location: {c.location?.address || c.location}</p>

            <p className="mt-2 text-sm font-semibold">Status: {c.status}</p>

            {c.status === "Assigned" && (
              <button
                onClick={() => handleStartWork(c._id)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Start Work
              </button>
            )}

            {c.status === "In Progress" && (
              <div className="mt-3 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(c._id, e)}
                  className="block"
                />

                <button
                  onClick={() => markCompleted(c._id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                >
                  Upload & Complete
                </button>
              </div>
            )}

            {(c.proofImageUrl || c.completionImage) && (
              <img
                src={c.proofImageUrl || c.completionImage}
                alt="Completed Work"
                className="mt-4 w-40 rounded-lg border"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkerDashboard;
