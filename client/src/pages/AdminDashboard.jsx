import React, { useEffect, useRef, useState } from "react";
import API from "../services/apiService";
import MapView from "../components/MapView";

const STATUS_OPTIONS = ["Submitted", "In Progress", "Completed", "Approved", "Rejected"];

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedComplaints, setSelectedComplaints] = useState({});
  const [bulkWorkerId, setBulkWorkerId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const previousStatusRef = useRef({});

  async function fetchComplaints() {
    try {
      const res = await API.get("/complaints", { withCredentials: true });
      const nextComplaints = res.data;
      const movedToInProgress = [];
      const nextStatusMap = {};

      nextComplaints.forEach((complaint) => {
        const previousStatus = previousStatusRef.current[complaint._id];
        if (
          previousStatus &&
          previousStatus !== "In Progress" &&
          complaint.status === "In Progress"
        ) {
          movedToInProgress.push(complaint);
        }

        nextStatusMap[complaint._id] = complaint.status;
      });

      previousStatusRef.current = nextStatusMap;

      if (movedToInProgress.length === 1) {
        const complaint = movedToInProgress[0];
        const workerName = complaint.assignedWorker?.name || "Worker";
        setStatusMessage(
          `${workerName} started work. Status updated to In Progress.`
        );
      } else if (movedToInProgress.length > 1) {
        setStatusMessage(
          `${movedToInProgress.length} complaints were updated to In Progress.`
        );
      }

      const existingIds = new Set(nextComplaints.map((c) => c._id));
      setSelectedComplaints((prev) => {
        const next = {};
        Object.entries(prev).forEach(([id, isSelected]) => {
          if (isSelected && existingIds.has(id)) {
            next[id] = true;
          }
        });
        return next;
      });

      setComplaints(nextComplaints);
    } catch (error) {
      console.error("Error fetching complaints", error);
    }
  }

  async function fetchWorkers() {
    try {
      const res = await API.get("/admin/workers", { withCredentials: true });
      setWorkers(res.data);
    } catch (error) {
      console.error("Error fetching workers", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComplaints();
    fetchWorkers();

    const intervalId = setInterval(() => {
      fetchComplaints();
    }, 8000);

    return () => clearInterval(intervalId);
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const body = { status: newStatus };

      await API.patch(`/complaints/${id}/status`, body, { withCredentials: true });
      fetchComplaints();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const filteredComplaints =
    filterStatus === "All"
      ? complaints
      : complaints.filter((c) => c.status === filterStatus);

  const selectedComplaintIds = Object.entries(selectedComplaints)
    .filter(([, isSelected]) => isSelected)
    .map(([id]) => id);

  const allFilteredSelected =
    filteredComplaints.length > 0 &&
    filteredComplaints.every((complaint) => selectedComplaints[complaint._id]);

  const toggleComplaintSelection = (complaintId) => {
    setSelectedComplaints((prev) => ({
      ...prev,
      [complaintId]: !prev[complaintId],
    }));
  };

  const toggleSelectAllFiltered = () => {
    setSelectedComplaints((prev) => {
      const next = { ...prev };
      filteredComplaints.forEach((complaint) => {
        next[complaint._id] = !allFilteredSelected;
      });
      return next;
    });
  };

  const assignBulkTasks = async () => {
    try {
      if (!bulkWorkerId) {
        alert("Please select a worker for bulk assignment.");
        return;
      }

      if (selectedComplaintIds.length === 0) {
        alert("Please select at least one complaint.");
        return;
      }

      const res = await API.post(
        "/admin/assign",
        {
          workerId: bulkWorkerId,
          complaintIds: selectedComplaintIds,
        },
        { withCredentials: true }
      );

      setStatusMessage(
        res.data?.message || `Assigned ${selectedComplaintIds.length} tasks successfully.`
      );
      setSelectedComplaints({});
      fetchComplaints();
    } catch (error) {
      console.error("Error assigning tasks in bulk", error);
      setStatusMessage("Bulk assignment failed. Please try again.");
    }
  };

  const total = complaints.length;
  const submitted = complaints.filter((c) => c.status === "Submitted").length;
  const assigned = complaints.filter((c) => c.status === "Assigned").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const completed = complaints.filter((c) => c.status === "Completed").length;
  const approved = complaints.filter((c) => c.status === "Approved").length;
  const rejected = complaints.filter((c) => c.status === "Rejected").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-amber-50 text-amber-700";
      case "Assigned":
        return "bg-indigo-50 text-indigo-700";
      case "In Progress":
        return "bg-blue-50 text-blue-700";
      case "Completed":
        return "bg-green-50 text-green-700";
      case "Approved":
        return "bg-emerald-50 text-emerald-700";
      case "Rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Admin Complaint Management
        </h1>

        {statusMessage && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total", value: total },
            { label: "Submitted", value: submitted },
            { label: "Assigned", value: assigned },
            { label: "In Progress", value: inProgress },
            { label: "Completed", value: completed },
            { label: "Approved", value: approved },
            { label: "Rejected", value: rejected },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg border shadow-sm">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {["All", ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === status
                  ? "bg-slate-900 text-white"
                  : "bg-white border text-slate-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="mb-6 rounded-lg border bg-white p-4">
          <p className="text-sm font-semibold text-slate-800 mb-3">
            Bulk Assign Tasks ({selectedComplaintIds.length} selected)
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <select
              value={bulkWorkerId}
              onChange={(e) => setBulkWorkerId(e.target.value)}
              className="border px-3 py-2 rounded-lg text-sm"
            >
              <option value="">Select worker for selected complaints</option>
              {workers.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name} ({w.email})
                </option>
              ))}
            </select>

            <button
              onClick={assignBulkTasks}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
            >
              Assign Selected
            </button>
          </div>
        </div>

        <MapView complaints={filteredComplaints} />

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleSelectAllFiltered}
                  />
                </th>
                <th className="p-3 text-left">Citizen</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Completed Photo</th>
                <th className="p-3 text-left">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedComplaints[c._id])}
                      onChange={() => toggleComplaintSelection(c._id)}
                    />
                  </td>
                  <td className="p-3">{c.user?.name || "Unknown"}</td>
                  <td className="p-3">{c.description}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {c.proofImageUrl || c.completionImage ? (
                      <a
                        href={c.proofImageUrl || c.completionImage}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        View Photo
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">Not uploaded</span>
                    )}
                  </td>
                  <td className="p-3">
                    <select
                      value={c.status}
                      onChange={(e) => updateStatus(c._id, e.target.value)}
                      className="border px-3 py-1 rounded-lg text-sm"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-6 text-slate-400">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
