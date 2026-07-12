import { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum.js";
import Toast from "../components/Toast";

Modal.setAppElement("#root");

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
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
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

const TripAddModal = ({ isModalOpen, setIsModalOpen, onSave }) => {
  const [toast, setToast] = useState(null);
  
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [newTrip, setNewTrip] = useState({
    vehicle_id: "",
    driver_id: "",
    origin: "",
    destination: "",
    cargo_weight: "",
    planned_distance: "",
    departure_time: "",
  });

  useEffect(() => {
    if (isModalOpen) {
      const fetchLookups = async () => {
        try {
          const v = await apiCall(MasterAPI.VehicleList, METHOD.Get);
          if (Array.isArray(v)) {
            setVehicles(v.map(item => ({ value: item.id, label: `${item.registration_number} (${item.model_name})` })));
          }
          const d = await apiCall(MasterAPI.DriversList, METHOD.Get);
          if (Array.isArray(d)) {
            setDrivers(d.map(item => ({ value: item.id, label: `${item.full_name} (${item.license_number})` })));
          }
        } catch (e) {
          console.error("Failed to fetch lookups", e);
        }
      };
      fetchLookups();
      
      setTimeout(() => {
        setNewTrip({
          vehicle_id: "",
          driver_id: "",
          origin: "",
          destination: "",
          cargo_weight: "",
          planned_distance: "",
          departure_time: "",
        });
      }, 0);
    }
  }, [isModalOpen]);

  const handleClearForm = () => {
    setNewTrip({
      vehicle_id: "",
      driver_id: "",
      origin: "",
      destination: "",
      cargo_weight: "",
      planned_distance: "",
      departure_time: "",
    });
  };

  const handleAddTrip = async (e) => {
    if (e) e.preventDefault();

    if (!newTrip.vehicle_id) return setToast({ message: "Vehicle is required.", type: "error" });
    if (!newTrip.driver_id) return setToast({ message: "Driver is required.", type: "error" });
    
    if (newTrip.origin.trim().length < 2 || newTrip.origin.trim().length > 100) {
      return setToast({ message: "Origin must be between 2 and 100 characters.", type: "error" });
    }
    if (newTrip.destination.trim().length < 2 || newTrip.destination.trim().length > 100) {
      return setToast({ message: "Destination must be between 2 and 100 characters.", type: "error" });
    }

    const weight = parseInt(newTrip.cargo_weight, 10);
    if (isNaN(weight) || weight <= 0) {
      return setToast({ message: "Cargo weight must be greater than 0.", type: "error" });
    }

    const distance = parseInt(newTrip.planned_distance, 10);
    if (isNaN(distance) || distance <= 0) {
      return setToast({ message: "Planned distance must be greater than 0.", type: "error" });
    }

    if (!newTrip.departure_time) {
      return setToast({ message: "Departure time is required.", type: "error" });
    }

    const payload = {
      vehicle_id: newTrip.vehicle_id,
      driver_id: newTrip.driver_id,
      origin: newTrip.origin.trim(),
      destination: newTrip.destination.trim(),
      cargo_weight: weight,
      planned_distance: distance,
      departure_time: new Date(newTrip.departure_time).toISOString(),
    };

    try {
      await apiCall(MasterAPI?.TripsAdd, METHOD?.Post, payload);

      if (onSave) {
        onSave(`Trip from ${payload.origin} to ${payload.destination} scheduled successfully.`);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setToast({ message: error?.message || "Failed to schedule trip.", type: "error" });
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Schedule Trip"
      >
        <div className="to-modal-header">
          <h3 className="to-modal-header-title">Schedule New Trip</h3>
          <div className="to-modal-header-actions">
            <button
              className="to-modal-header-btn"
              type="button"
              title="Close Modal"
              onClick={() => setIsModalOpen(false)}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="to-modal-body">
          <form onSubmit={handleAddTrip}>
            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">Vehicle<span>*</span></label>
                <div className="to-master-input-wrap">
                  <Select
                    options={vehicles}
                    styles={customSelectStyles}
                    placeholder="Select Vehicle"
                    value={vehicles.find((opt) => opt.value === newTrip.vehicle_id) || null}
                    onChange={(val) => setNewTrip({ ...newTrip, vehicle_id: val.value })}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>
              </div>
              <div className="to-master-field-row">
                <label className="to-master-label">Driver<span>*</span></label>
                <div className="to-master-input-wrap">
                  <Select
                    options={drivers}
                    styles={customSelectStyles}
                    placeholder="Select Driver"
                    value={drivers.find((opt) => opt.value === newTrip.driver_id) || null}
                    onChange={(val) => setNewTrip({ ...newTrip, driver_id: val.value })}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>
              </div>
            </div>

            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">Origin<span>*</span></label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. Warehouse A"
                    required
                    value={newTrip.origin}
                    onChange={(e) => setNewTrip({ ...newTrip, origin: e.target.value })}
                  />
                </div>
              </div>
              <div className="to-master-field-row">
                <label className="to-master-label">Destination<span>*</span></label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. City Center Hub"
                    required
                    value={newTrip.destination}
                    onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">Cargo Wt (kg)<span>*</span></label>
                <div className="to-master-input-wrap">
                  <input
                    type="number"
                    min="1"
                    className="to-input"
                    placeholder="e.g. 5000"
                    required
                    value={newTrip.cargo_weight}
                    onChange={(e) => setNewTrip({ ...newTrip, cargo_weight: e.target.value })}
                  />
                </div>
              </div>
              <div className="to-master-field-row">
                <label className="to-master-label">Distance (km)<span>*</span></label>
                <div className="to-master-input-wrap">
                  <input
                    type="number"
                    min="1"
                    className="to-input"
                    placeholder="e.g. 350"
                    required
                    value={newTrip.planned_distance}
                    onChange={(e) => setNewTrip({ ...newTrip, planned_distance: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="to-master-divider"></div>

            <div className="to-master-full-row">
              <label className="to-master-label">Departure Time<span>*</span></label>
              <div className="to-master-input-wrap">
                <input
                  type="datetime-local"
                  className="to-input"
                  required
                  value={newTrip.departure_time}
                  onChange={(e) => setNewTrip({ ...newTrip, departure_time: e.target.value })}
                />
              </div>
            </div>

            <div className="to-modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
              <button type="submit" className="to-modal-footer-btn save">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-4-4H8z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
                Schedule
              </button>
              <button type="button" className="to-modal-footer-btn clear" onClick={handleClearForm}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
                Clear
              </button>
              <button type="button" className="to-modal-footer-btn close" onClick={() => setIsModalOpen(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </>
  );
};

export default TripAddModal;
