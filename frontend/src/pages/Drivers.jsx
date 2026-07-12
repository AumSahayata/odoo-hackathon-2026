import { useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import Toast from "../components/Toast";
import PageToolbar from "../components/PageToolbar";
import PageTable from "../components/PageTable";

const initialDrivers = [
  {
    id: 1,
    name: "Alex",
    license: "DL-88213",
    category: "LMV",
    expiry: "12/2028",
    contact: "98765xxxxx",
    tripCompletion: "96%",
    safety: "Available",
    status: "Available",
  },
  {
    id: 2,
    name: "John",
    license: "DL-44120",
    category: "HMV",
    expiry: "03/2025",
    isExpired: true,
    contact: "98220xxxxx",
    tripCompletion: "81%",
    safety: "Suspended",
    status: "Suspended",
  },
  {
    id: 3,
    name: "Priya",
    license: "DL-77031",
    category: "LMV",
    expiry: "08/2027",
    contact: "99110xxxxx",
    tripCompletion: "99%",
    safety: "On Trip",
    status: "On Trip",
  },
  {
    id: 4,
    name: "Suresh",
    license: "DL-90045",
    category: "HMV",
    expiry: "01/2027",
    contact: "97440xxxxx",
    tripCompletion: "88%",
    safety: "Available",
    status: "Off Duty",
  },
];

const categoryOptions = [
  { value: "LMV", label: "LMV" },
  { value: "HMV", label: "HMV" },
];

const safetyOptions = [
  { value: "Available", label: "Available" },
  { value: "On Trip", label: "On Trip" },
  { value: "Suspended", label: "Suspended" },
];

const statusOptions = [
  { value: "Available", label: "Available" },
  { value: "On Trip", label: "On Trip" },
  { value: "Off Duty", label: "Off Duty" },
  { value: "Suspended", label: "Suspended" },
];

const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(10, 13, 16, 0.6)",
    borderColor: state.isFocused ? "#F28C0F" : "rgba(255, 255, 255, 0.08)",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(242, 140, 15, 0.15), 0 0 10px rgba(242, 140, 15, 0.1)"
      : "none",
    borderRadius: "8px",
    padding: "0.08rem 0.1rem",
    outline: "none",
    "&:hover": {
      borderColor: state.isFocused ? "#F28C0F" : "rgba(255, 255, 255, 0.15)",
    },
    cursor: "pointer",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#111419",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#F28C0F"
      : state.isFocused
        ? "rgba(255, 255, 255, 0.04)"
        : "transparent",
    color: state.isSelected ? "#0E1013" : "#AEB5C2",
    cursor: "pointer",
    fontSize: "0.92rem",
    padding: "0.65rem 0.9rem",
    "&:active": {
      backgroundColor: state.isSelected
        ? "#F28C0F"
        : "rgba(255, 255, 255, 0.08)",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#F5F7FA",
    fontSize: "0.92rem",
  }),
  input: (provided) => ({
    ...provided,
    color: "#F5F7FA",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#646C7A",
    fontSize: "0.92rem",
  }),
};

const columns = [
  {
    key: "name",
    label: "Driver",
    cellStyle: { fontWeight: "600" },
  },
  {
    key: "license",
    label: "License No",
    className: "mono",
  },
  {
    key: "category",
    label: "Category",
  },
  {
    key: "expiry",
    label: "Expiry",
    render: (val, item) => (
      <>
        <span className="mono">{val}</span>
        {item.isExpired && <span className="to-expiry-expired">EXPIRED</span>}
      </>
    ),
  },
  {
    key: "contact",
    label: "Contact",
    className: "mono",
    cellStyle: { color: "#646C7A" },
  },
  {
    key: "tripCompletion",
    label: "Trip Compl.",
    className: "mono",
  },
  {
    key: "safety",
    label: "Safety",
    render: (val) => (
      <span className={`to-badge ${val.toLowerCase().replace(" ", "")}`}>
        {val}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (val) => (
      <span className={`to-badge ${val.toLowerCase().replace(" ", "")}`}>
        {val}
      </span>
    ),
  },
];

const Drivers = () => {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDriverId, setEditingDriverId] = useState(null);
  const [newDriver, setNewDriver] = useState({
    name: "",
    license: "",
    category: "LMV",
    expiry: "",
    contact: "",
    tripCompletion: "100%",
    safety: "Available",
    status: "Available",
  });

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.license || !newDriver.expiry || !newDriver.contact) {
      alert("Please fill in all required fields.");
      return;
    }
    
    // Check if license is expired (simple check for MM/YYYY format)
    let isExpired = false;
    try {
      const [month, year] = newDriver.expiry.split("/");
      if (month && year) {
        const expiryDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        isExpired = expiryDate < new Date();
      }
    } catch {
      isExpired = false;
    }

    const createdDriver = {
      id: isEditMode ? editingDriverId : drivers.length + 1,
      ...newDriver,
      isExpired
    };

    setDrivers((prev) => {
      const exists = prev.some((d) => d.id === createdDriver.id);
      if (exists) {
        return prev.map((d) => (d.id === createdDriver.id ? createdDriver : d));
      } else {
        return [...prev, createdDriver];
      }
    });

    setIsModalOpen(false);
    setToast({
      message: isEditMode
        ? `Driver "${newDriver.name}" updated successfully.`
        : `Driver "${newDriver.name}" added successfully.`,
      type: "success",
    });
    
    handleClearForm();
  };

  const handleClearForm = () => {
    setNewDriver({
      name: "",
      license: "",
      category: "LMV",
      expiry: "",
      contact: "",
      tripCompletion: "100%",
      safety: "Available",
      status: "Available",
    });
    setIsEditMode(false);
    setEditingDriverId(null);
  };

  const handleRowDoubleClick = (driver) => {
    setNewDriver(driver);
    setEditingDriverId(driver.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteDriver = (driver) => {
    Swal.fire({
      title: "Remove Driver?",
      text: `Are you sure you want to remove driver "${driver.name}"?`,
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
    }).then((result) => {
      if (result.isConfirmed) {
        setDrivers((prev) => prev.filter((d) => d.id !== driver.id));
        setToast({ message: `Driver "${driver.name}" removed successfully.`, type: "success" });
      }
    });
  };

  // Filter logic
  const filteredDrivers = filter === "All" 
    ? drivers 
    : drivers.filter(d => d.status === filter || d.safety === filter);

  return (
    <div>
      {/* ============ TOOLBAR HEADER STRIP ============ */}
      <PageToolbar
        title="Drivers Grid"
        onAddClick={() => {
          handleClearForm();
          setIsModalOpen(true);
        }}
        addButtonText="Add Driver"
        onRefreshClick={() => {
          setDrivers(initialDrivers);
          setFilter("All");
          setToast({ message: "Drivers database reloaded.", type: "success" });
        }}
      />

      {/* ============ REUSABLE COMMON GRID TABLE ============ */}
      <PageTable
        columns={columns}
        data={filteredDrivers}
        emptyMessage="No drivers matching active filter specifications."
        onDelete={handleDeleteDriver}
        onRowDoubleClick={handleRowDoubleClick}
      />

      {/* ============ TOGGLE STAT CONTROLS ============ */}
      <div className="to-stats-bar">
        <div className="to-stats-label">Toggle Stat</div>
        <div className="to-stats-row">
          <button 
            className={`to-stats-btn ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            Show All
          </button>
          <button 
            className={`to-stats-btn available ${filter === "Available" ? "active" : ""}`}
            onClick={() => setFilter("Available")}
          >
            Available
          </button>
          <button 
            className={`to-stats-btn ontrip ${filter === "On Trip" ? "active" : ""}`}
            onClick={() => setFilter("On Trip")}
          >
            On Trip
          </button>
          <button 
            className={`to-stats-btn offduty ${filter === "Off Duty" ? "active" : ""}`}
            onClick={() => setFilter("Off Duty")}
          >
            Off Duty
          </button>
          <button 
            className={`to-stats-btn suspended ${filter === "Suspended" ? "active" : ""}`}
            onClick={() => setFilter("Suspended")}
          >
            Suspended
          </button>
        </div>
        <div className="to-rules-note">
          Rule: Expired license or Suspended status → blocked from trip assignment
        </div>
      </div>

      {/* ============ ADD DRIVER MODAL ============ */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "#12161A",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "2rem",
            width: "100%",
            maxWidth: "480px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "700", fontFamily: "'Space Grotesk', sans-serif" }}>
                {isEditMode ? "Edit Operator" : "Add New Operator"}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  handleClearForm();
                }}
                style={{ background: "none", border: "none", color: "#646C7A", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddDriver}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>Driver Name</label>
                <input 
                  type="text" 
                  className="to-input"
                  placeholder="e.g. Alex"
                  required
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({...newDriver, name: e.target.value})}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>License Number</label>
                  <input 
                    type="text" 
                    className="to-input"
                    placeholder="DL-XXXXX"
                    required
                    value={newDriver.license}
                    onChange={(e) => setNewDriver({...newDriver, license: e.target.value})}
                  />
                </div>
                <div style={{ width: "150px" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>Category</label>
                  <Select
                    options={categoryOptions}
                    styles={customSelectStyles}
                    value={categoryOptions.find((opt) => opt.value === newDriver.category)}
                    onChange={(val) => setNewDriver({ ...newDriver, category: val.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>Expiry Date (MM/YYYY)</label>
                  <input 
                    type="text" 
                    className="to-input"
                    placeholder="e.g. 12/2028"
                    required
                    value={newDriver.expiry}
                    onChange={(e) => setNewDriver({...newDriver, expiry: e.target.value})}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>Contact No</label>
                  <input 
                    type="text" 
                    className="to-input"
                    placeholder="e.g. 98765xxxxx"
                    required
                    value={newDriver.contact}
                    onChange={(e) => setNewDriver({...newDriver, contact: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>Safety Rating</label>
                  <Select
                    options={safetyOptions}
                    styles={customSelectStyles}
                    value={safetyOptions.find((opt) => opt.value === newDriver.safety)}
                    onChange={(val) => setNewDriver({ ...newDriver, safety: val.value })}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.75rem", textTransform: "uppercase", color: "#646C7A", marginBottom: "0.4rem" }}>Status</label>
                  <Select
                    options={statusOptions}
                    styles={customSelectStyles}
                    value={statusOptions.find((opt) => opt.value === newDriver.status)}
                    onChange={(val) => setNewDriver({ ...newDriver, status: val.value })}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsModalOpen(false);
                    handleClearForm();
                  }}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#AEB5C2",
                    padding: "0.7rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #F28C0F 0%, #D86B00 100%)",
                    border: "none",
                    color: "#0E1013",
                    padding: "0.7rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  {isEditMode ? "Save Changes" : "Save Operator"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
