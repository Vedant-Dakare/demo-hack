import React, { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

const DEFAULT_CENTER = [20.5937, 78.9629];

const statusColors = {
  Submitted: "#dc2626",
  Assigned: "#facc15",
  "In Progress": "#111827",
  Completed: "#16a34a",
  Approved: "#16a34a",
};

function getStatusIcon(status) {
  const color = statusColors[status] || "#94a3b8";

  return L.divIcon({
    className: "custom-status-marker",
    html: `<div style="width:14px;height:14px;border-radius:999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 2px ${color};"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

function getComplaintAddress(complaint) {
  if (typeof complaint?.location === "string") {
    return complaint.location.trim();
  }

  if (typeof complaint?.location?.address === "string") {
    return complaint.location.address.trim();
  }

  return "";
}

function getStoredCoordinates(complaint) {
  const lat = Number(complaint?.location?.lat);
  const lng = Number(complaint?.location?.lng);

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng };
  }

  return null;
}

function MapView({ complaints = [] }) {
  const [resolvedCoordinates, setResolvedCoordinates] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function resolveMissingCoordinates() {
      const missing = complaints.filter((complaint) => {
        const hasStoredCoordinates = getStoredCoordinates(complaint);
        const alreadyResolved = resolvedCoordinates[complaint._id];
        const address = getComplaintAddress(complaint);
        return !hasStoredCoordinates && !alreadyResolved && Boolean(address);
      });

      if (missing.length === 0) {
        return;
      }

      const resolvedPairs = await Promise.all(
        missing.map(async (complaint) => {
          try {
            const address = getComplaintAddress(complaint);
            const params = new URLSearchParams({
              q: address,
              format: "json",
              limit: "1",
            });

            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?${params.toString()}`
            );

            if (!response.ok) {
              return null;
            }

            const [firstResult] = await response.json();
            if (!firstResult) {
              return null;
            }

            const lat = Number(firstResult.lat);
            const lng = Number(firstResult.lon);

            if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
              return null;
            }

            return [complaint._id, { lat, lng }];
          } catch {
            return null;
          }
        })
      );

      if (cancelled) {
        return;
      }

      const nextCoordinates = {};
      resolvedPairs.forEach((pair) => {
        if (pair) {
          nextCoordinates[pair[0]] = pair[1];
        }
      });

      if (Object.keys(nextCoordinates).length > 0) {
        setResolvedCoordinates((prev) => ({ ...prev, ...nextCoordinates }));
      }
    }

    resolveMissingCoordinates();

    return () => {
      cancelled = true;
    };
  }, [complaints, resolvedCoordinates]);

  const complaintsWithCoordinates = useMemo(() => {
    return complaints
      .map((complaint) => {
        const storedCoordinates = getStoredCoordinates(complaint);
        const fallbackCoordinates = resolvedCoordinates[complaint._id];
        const coordinates = storedCoordinates || fallbackCoordinates;

        if (!coordinates) {
          return null;
        }

        return {
          complaint,
          coordinates,
        };
      })
      .filter(Boolean);
  }, [complaints, resolvedCoordinates]);

  const mapCenter =
    complaintsWithCoordinates.length > 0
      ? [
          Number(complaintsWithCoordinates[0].coordinates.lat),
          Number(complaintsWithCoordinates[0].coordinates.lng),
        ]
      : DEFAULT_CENTER;

  return (
    <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-slate-800">
        Complaint Locations Map
      </h2>

      {/* Legend */}
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center gap-2">
          <div style={{width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#dc2626", border: "2px solid #fff", boxShadow: "0 0 0 2px #dc2626"}}></div>
          <span className="text-xs text-slate-700">Submitted</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#facc15", border: "2px solid #fff", boxShadow: "0 0 0 2px #facc15"}}></div>
          <span className="text-xs text-slate-700">Assigned</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#111827", border: "2px solid #fff", boxShadow: "0 0 0 2px #111827"}}></div>
          <span className="text-xs text-slate-700">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#16a34a", border: "2px solid #fff", boxShadow: "0 0 0 2px #16a34a"}}></div>
          <span className="text-xs text-slate-700">Completed</span>
        </div>
      </div>

      <div className="h-[360px] overflow-hidden rounded-lg border">
        <MapContainer center={mapCenter} zoom={12} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {complaintsWithCoordinates.map(({ complaint, coordinates }) => (
            <Marker
              key={complaint._id}
              position={[Number(coordinates.lat), Number(coordinates.lng)]}
              icon={getStatusIcon(complaint.status)}
            >
              <Popup className="min-w-[250px]">
                <div className="p-2 space-y-2">
                  <div>
                    <p className="font-bold text-sm text-slate-900">{complaint.category || "Complaint"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Description:</p>
                    <p className="text-xs text-slate-700">{complaint.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Reported by:</p>
                    <p className="text-xs text-slate-700">{complaint.user?.name || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Status:</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${
                      complaint.status === "Submitted" ? "bg-red-100 text-red-700" :
                      complaint.status === "Assigned" ? "bg-yellow-100 text-yellow-700" :
                      complaint.status === "In Progress" ? "bg-gray-100 text-gray-800" :
                      complaint.status === "Completed" || complaint.status === "Approved" ? "bg-green-100 text-green-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Assigned Worker:</p>
                    <p className="text-xs text-slate-700">{complaint.assignedWorker?.name || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-semibold">Location:</p>
                    <p className="text-xs text-slate-700">{getComplaintAddress(complaint) || "Address not available"}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapView;
