import { useEffect, useState } from "react";
import Toast from "../components/Toast";
import PageToolbar from "../components/PageToolbar";
import PageTable from "../components/PageTable";
import TripAddModal from "../modals/TripAddModal";
import TripCompleteModal from "../modals/TripCompleteModal";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum.js";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [completingTrip, setCompletingTrip] = useState(null);

  const fetchTrips = async () => {
    try {
      const result = await apiCall(MasterAPI?.TripsList, METHOD?.Get);
      if (result && Array.isArray(result)) {
        setTimeout(() => {
          setTrips(result);
        }, 0);
      }
    } catch (error) {
      setToast({
        message: error?.message || "Failed to load trips.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAction = async (trip, actionName, apiUrlTemplate, payload = null) => {
    try {
      const url = apiUrlTemplate.replace("{id}", trip.id);
      await apiCall(url, METHOD?.Post, payload);
      setToast({ message: `Trip ${actionName} successfully.`, type: "success" });
      fetchTrips();
    } catch (error) {
      console.error(error);
      setToast({ message: `Failed to ${actionName.toLowerCase()} trip.`, type: "error" });
    }
  };

  const handleDispatch = (trip) => handleAction(trip, "Dispatched", MasterAPI?.TripsDispatch);
  const handleCancel = (trip) => handleAction(trip, "Cancelled", MasterAPI?.TripsCancel);

  const handleComplete = (trip) => {
    setCompletingTrip(trip);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteSubmit = (trip, payload) => {
    handleAction(trip, "Completed", MasterAPI?.TripsComplete, payload);
    setIsCompleteModalOpen(false);
  };

  const handleSaveTrip = (successMessage) => {
    fetchTrips();
    if (successMessage) {
      setToast({ message: successMessage, type: "success" });
    }
  };

  const columns = [
    {
      key: "origin",
      label: "Origin",
      cellStyle: { fontWeight: "600" },
    },
    {
      key: "destination",
      label: "Destination",
      cellStyle: { fontWeight: "600" },
    },
    {
      key: "cargo_weight",
      label: "Cargo (kg)",
      className: "mono",
    },
    {
      key: "planned_distance",
      label: "Dist (km)",
      className: "mono",
    },
    {
      key: "departure_time",
      label: "Departure",
      render: (val) => {
        if (!val) return "";
        const date = new Date(val);
        return <span className="mono">{date.toLocaleString()}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const badgeClass = val ? val.toLowerCase() : "";
        const displayLabel = val ? val.replace("_", " ") : "";
        // reuse same badge styling concepts
        return (
          <span className={`to-badge ${badgeClass}`}>
            {displayLabel}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      align: "center",
      width: "250px",
      render: (_, trip) => (
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          {trip.status === "DRAFT" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDispatch(trip);
              }}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10B981",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(16, 185, 129, 0.2)")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(16, 185, 129, 0.1)")}
            >
              Dispatch
            </button>
          )}
          {trip.status === "DISPATCHED" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleComplete(trip);
              }}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "1px solid rgba(59, 130, 246, 0.2)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3B82F6",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(59, 130, 246, 0.2)")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(59, 130, 246, 0.1)")}
            >
              Complete
            </button>
          )}
          {["DRAFT", "DISPATCHED"].includes(trip.status) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel(trip);
              }}
              style={{
                padding: "0.3rem 0.8rem",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#EF4444",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(239, 68, 68, 0.2)")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(239, 68, 68, 0.1)")}
            >
              Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  const filteredTrips = filter === "All" 
    ? trips 
    : trips.filter((t) => t.status === filter);

  return (
    <div>
      <PageToolbar
        title="Trips Grid"
        onAddClick={() => setIsModalOpen(true)}
        addButtonText="Schedule Trip"
        onRefreshClick={() => {
          fetchTrips();
          setFilter("All");
          setToast({ message: "Trips database reloaded.", type: "success" });
        }}
      />

      <PageTable
        columns={columns}
        data={filteredTrips}
        emptyMessage="No trips matching active filter specifications."
      />

      <div className="to-stats-bar">
        <div className="to-stats-label">Filter Status</div>
        <div className="to-stats-row">
          <button 
            className={`to-stats-btn ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            Show All
          </button>
          <button 
            className={`to-stats-btn draft ${filter === "DRAFT" ? "active" : ""}`}
            onClick={() => setFilter("DRAFT")}
            style={filter === "DRAFT" ? { backgroundColor: "rgba(100, 108, 122, 0.15)", color: "#AEB5C2", border: "1px solid rgba(255,255,255,0.1)" } : { color: "#AEB5C2" }}
          >
            Draft
          </button>
          <button 
            className={`to-stats-btn dispatched ${filter === "DISPATCHED" ? "active" : ""}`}
            onClick={() => setFilter("DISPATCHED")}
            style={filter === "DISPATCHED" ? { backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10B981", border: "1px solid rgba(16, 185, 129, 0.3)" } : { color: "#10B981" }}
          >
            Dispatched
          </button>
          <button 
            className={`to-stats-btn completed ${filter === "COMPLETED" ? "active" : ""}`}
            onClick={() => setFilter("COMPLETED")}
            style={filter === "COMPLETED" ? { backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#3B82F6", border: "1px solid rgba(59, 130, 246, 0.3)" } : { color: "#3B82F6" }}
          >
            Completed
          </button>
          <button 
            className={`to-stats-btn cancelled ${filter === "CANCELLED" ? "active" : ""}`}
            onClick={() => setFilter("CANCELLED")}
            style={filter === "CANCELLED" ? { backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.3)" } : { color: "#EF4444" }}
          >
            Cancelled
          </button>
        </div>
      </div>

      {isModalOpen && (
        <TripAddModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          onSave={handleSaveTrip}
        />
      )}

      {isCompleteModalOpen && (
        <TripCompleteModal
          isModalOpen={isCompleteModalOpen}
          setIsModalOpen={setIsCompleteModalOpen}
          trip={completingTrip}
          onCompleteSubmit={handleCompleteSubmit}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Trips;
