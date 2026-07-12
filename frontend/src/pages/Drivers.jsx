import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Toast from "../components/Toast";
import PageToolbar from "../components/PageToolbar";
import PageTable from "../components/PageTable";
import DriverAddEditModal from "../modals/DriverAddEditModal";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum.js";


const columns = [
  {
    key: "full_name",
    label: "Driver",
    cellStyle: { fontWeight: "600" },
  },
  {
    key: "license_number",
    label: "License No",
    className: "mono",
  },
  {
    key: "license_category",
    label: "Category",
  },
  {
    key: "license_expiry_date",
    label: "Expiry",
    render: (val) => {
      const isExpired = val ? new Date(val) < new Date() : false;
      return (
        <>
          <span className="mono">{val}</span>
          {isExpired && <span className="to-expiry-expired">EXPIRED</span>}
        </>
      );
    },
  },
  {
    key: "contact_number",
    label: "Contact",
    className: "mono",
    cellStyle: { color: "#646C7A" },
  },
  {
    key: "safety_score",
    label: "Safety",
    className: "mono",
    render: (val) => `${val}/100`,
  },
  {
    key: "status",
    label: "Status",
    render: (val) => {
      const badgeClass = val ? val.toLowerCase().replace("_", "") : "";
      const displayLabel = val ? val.replace("_", " ") : "";
      return (
        <span className={`to-badge ${badgeClass}`}>
          {displayLabel}
        </span>
      );
    },
  },
];

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const fetchDrivers = async () => {
    try {
      const result = await apiCall(MasterAPI?.DriversList, METHOD?.Get);
      if (result && Array.isArray(result)) {
        setTimeout(() => {
          setDrivers(result);
        }, 0);
      }
    } catch (error) {
      setToast({
        message: error?.message || "Failed to load drivers.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleRowDoubleClick = (driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleDeleteDriver = (driver) => {
    Swal.fire({
      title: "Remove Driver?",
      text: `Are you sure you want to remove driver "${driver.full_name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "No, cancel",
      background: "#111419",
      color: "#AEB5C2",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#1F2937",
      iconColor: "#F59E0B",
      customClass: {
        popup: "to-swal-popup",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const deleteUrl = MasterAPI?.DriversDelete.replace("{id}", driver.id);
          await apiCall(deleteUrl, METHOD?.Delete);
          setToast({ message: `Driver "${driver.full_name}" removed successfully.`, type: "success" });
          fetchDrivers();
        } catch (err) {
          console.error("Failed to delete driver on server:", err);
          setToast({ message: "Failed to delete driver on server.", type: "error" });
        }
      }
    });
  };

  const handleSaveDriver = (successMessage) => {
    fetchDrivers();
    if (successMessage) {
      setToast({ message: successMessage, type: "success" });
    }
  };

  const filteredDrivers = filter === "All" 
    ? drivers 
    : drivers.filter(d => d.status === filter);

  return (
    <div>
      <PageToolbar
        title="Drivers Grid"
        onAddClick={() => {
          setEditingDriver(null);
          setIsModalOpen(true);
        }}
        addButtonText="Add Driver"
        onRefreshClick={() => {
          fetchDrivers();
          setFilter("All");
          setToast({ message: "Drivers database reloaded.", type: "success" });
        }}
      />

      <PageTable
        columns={columns}
        data={filteredDrivers}
        emptyMessage="No drivers matching active filter specifications."
        onDelete={handleDeleteDriver}
        onRowDoubleClick={handleRowDoubleClick}
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
            className={`to-stats-btn available ${filter === "AVAILABLE" ? "active" : ""}`}
            onClick={() => setFilter("AVAILABLE")}
          >
            Available
          </button>
          <button 
            className={`to-stats-btn ontrip ${filter === "ON_TRIP" ? "active" : ""}`}
            onClick={() => setFilter("ON_TRIP")}
          >
            On Trip
          </button>
          <button 
            className={`to-stats-btn offduty ${filter === "OFF_DUTY" ? "active" : ""}`}
            onClick={() => setFilter("OFF_DUTY")}
          >
            Off Duty
          </button>
          <button 
            className={`to-stats-btn suspended ${filter === "SUSPENDED" ? "active" : ""}`}
            onClick={() => setFilter("SUSPENDED")}
          >
            Suspended
          </button>
        </div>
        <div className="to-rules-note">
          Rule: Expired license or Suspended status → blocked from trip assignment
        </div>
      </div>

      {isModalOpen && (
        <DriverAddEditModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          driverToEdit={editingDriver}
          onSave={handleSaveDriver}
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

export default Drivers;
