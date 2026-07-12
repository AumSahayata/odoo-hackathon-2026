import { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum.js";
import Toast from "../components/Toast";

const vehicleTypeOptions = [
  { value: "TRUCK", label: "Truck" },
  { value: "VAN", label: "Van" },
  { value: "CAR", label: "Car" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
];

const statusOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ON_TRIP", label: "On Trip" },
  { value: "IN_SHOP", label: "In Shop" },
  { value: "RETIRED", label: "Retired" },
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

const FleetAddEditModal = ({
  isModalOpen,
  setIsModalOpen,
  vehicleToEdit,
  onSave,
}) => {
  const [toast, setToast] = useState(null);
  const [prevVehicleToEdit, setPrevVehicleToEdit] = useState(null);
  const [newVehicle, setNewVehicle] = useState({
    registration_number: "",
    model_name: "",
    type: "Heavy Bus",
    max_load_capacity: "",
    odometer: "",
    acquisition_cost: "",
    current_location: "",
    status: "Available",
  });

  if (vehicleToEdit !== prevVehicleToEdit) {
    setPrevVehicleToEdit(vehicleToEdit);
    setNewVehicle(
      vehicleToEdit
        ? {
            registration_number: vehicleToEdit.registration_number || "",
            model_name: vehicleToEdit.model_name || "",
            type: vehicleToEdit.type || "Heavy Bus",
            max_load_capacity: vehicleToEdit.max_load_capacity || "",
            odometer: vehicleToEdit.odometer || "",
            acquisition_cost: vehicleToEdit.acquisition_cost || "",
            current_location: vehicleToEdit.current_location || "",
            status: vehicleToEdit.status || "Available",
          }
        : {
            registration_number: "",
            model_name: "",
            type: "Heavy Bus",
            max_load_capacity: "",
            odometer: "",
            acquisition_cost: "",
            current_location: "",
            status: "Available",
          },
    );
  }

  const handleClearForm = () => {
    setNewVehicle({
      registration_number: "",
      model_name: "",
      type: "Heavy Bus",
      max_load_capacity: "",
      odometer: "",
      acquisition_cost: "",
      current_location: "",
      status: "Available",
    });
  };

  const handleAddVehicle = async (e) => {
    if (e) e.preventDefault();

    const regNum = newVehicle?.registration_number.trim();
    if (regNum.length < 3 || regNum.length > 50) {
      setToast({
        message: "Registration number must be between 3 and 50 characters.",
        type: "error",
      });
      return;
    }

    const modelName = newVehicle?.model_name.trim();
    if (modelName.length < 2 || modelName.length > 100) {
      setToast({
        message: "Model name must be between 2 and 100 characters.",
        type: "error",
      });
      return;
    }

    const loadCapacity = parseInt(newVehicle?.max_load_capacity);
    if (isNaN(loadCapacity) || loadCapacity <= 0) {
      setToast({
        message: "Max load capacity must be greater than 0.",
        type: "error",
      });
      return;
    }

    const odoValue = parseInt(newVehicle?.odometer);
    if (isNaN(odoValue) || odoValue < 0) {
      setToast({
        message: "Odometer must be greater than or equal to 0.",
        type: "error",
      });
      return;
    }

    const acqCost = parseFloat(newVehicle?.acquisition_cost);
    if (isNaN(acqCost) || acqCost <= 0) {
      setToast({
        message: "Acquisition cost must be greater than 0.",
        type: "error",
      });
      return;
    }

    const loc = newVehicle?.current_location.trim();
    if (!loc) {
      setToast({ message: "Current location is required.", type: "error" });
      return;
    }

    const createdVehicle = {
      id: vehicleToEdit ? vehicleToEdit.id : Date.now(),
      registration_number: regNum,
      model_name: modelName,
      type: newVehicle.type,
      max_load_capacity: loadCapacity,
      odometer: odoValue,
      acquisition_cost: acqCost,
      current_location: loc,
      status: newVehicle.status,
    };

    if (onSave) {
      onSave(createdVehicle);
    }

    try {
      const url = vehicleToEdit
        ? MasterAPI?.VehicleUpdate.replace("{id}", vehicleToEdit.id)
        : MasterAPI?.VehicleAdd;

      const payload = {};
      if (vehicleToEdit) {
        if (regNum !== vehicleToEdit.registration_number) {
          payload.registration_number = regNum;
        }
        if (modelName !== vehicleToEdit.model_name) {
          payload.model_name = modelName;
        }
        if (newVehicle.type !== vehicleToEdit.type) {
          payload.type = newVehicle.type;
        }
        if (loadCapacity !== vehicleToEdit.max_load_capacity) {
          payload.max_load_capacity = loadCapacity;
        }
        if (odoValue !== vehicleToEdit.odometer) {
          payload.odometer = odoValue;
        }
        if (acqCost !== vehicleToEdit.acquisition_cost) {
          payload.acquisition_cost = acqCost;
        }
        if (loc !== vehicleToEdit.current_location) {
          payload.current_location = loc;
        }
        if (newVehicle.status !== vehicleToEdit.status) {
          payload.status = newVehicle.status;
        }
      } else {
        Object.assign(payload, createdVehicle);
      }

      await apiCall(
        url,
        vehicleToEdit ? METHOD?.Patch : METHOD?.Post,
        payload,
      );
      setToast({
        message: vehicleToEdit
          ? `Vehicle "${modelName}" successfully updated.`
          : `Vehicle "${modelName}" successfully added to inventory.`,
        type: "success",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setToast({ message: error?.message || "Failed to save vehicle.", type: "error" });
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add New Vehicle"
      >
        <div className="to-modal-header">
          <h3 className="to-modal-header-title">
            {vehicleToEdit ? "Edit Vehicle" : "Vehicle Master"}
          </h3>
          <div className="to-modal-header-actions">
            <button
              className="to-modal-header-btn"
              type="button"
              title="Close Modal"
              onClick={() => setIsModalOpen(false)}
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="to-modal-body">
          <form onSubmit={handleAddVehicle}>
            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">
                  Reg. Number<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. MH-12-PQ-8834"
                    required
                    value={newVehicle?.registration_number}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        registration_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="to-master-field-row">
                <label className="to-master-label">
                  Model Name<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. Tata Starbus 40"
                    required
                    value={newVehicle?.model_name}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        model_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">
                  Vehicle Type<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <Select
                    options={vehicleTypeOptions}
                    styles={customSelectStyles}
                    value={vehicleTypeOptions.find(
                      (opt) => opt.value === newVehicle.type,
                    )}
                    onChange={(val) =>
                      setNewVehicle({ ...newVehicle, type: val.value })
                    }
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                </div>
              </div>

              <div className="to-master-field-row">
                <label className="to-master-label">
                  Max Load (kg)<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="number"
                    className="to-input"
                    placeholder="e.g. 4500"
                    required
                    value={newVehicle.max_load_capacity}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        max_load_capacity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">
                  Odometer (km)<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="number"
                    className="to-input"
                    placeholder="e.g. 45200"
                    required
                    value={newVehicle.odometer}
                    onChange={(e) =>
                      setNewVehicle({ ...newVehicle, odometer: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="to-master-field-row">
                <label className="to-master-label">
                  Acq. Cost ($)<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="number"
                    step="0.01"
                    className="to-input"
                    placeholder="e.g. 32000.00"
                    required
                    value={newVehicle.acquisition_cost}
                    onChange={(e) =>
                      setNewVehicle({
                        ...newVehicle,
                        acquisition_cost: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="to-master-divider"></div>

            <div className="to-master-full-row">
              <label className="to-master-label">
                Current Location<span>*</span>
              </label>
              <div className="to-master-input-wrap">
                <input
                  type="text"
                  className="to-input"
                  placeholder="e.g. Pune Depot A"
                  required
                  value={newVehicle.current_location}
                  onChange={(e) =>
                    setNewVehicle({
                      ...newVehicle,
                      current_location: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="to-master-full-row">
              <label className="to-master-label">
                Initial Status<span>*</span>
              </label>
              <div className="to-master-input-wrap">
                <Select
                  options={statusOptions}
                  styles={customSelectStyles}
                  value={statusOptions.find(
                    (opt) => opt.value === newVehicle.status,
                  )}
                  onChange={(val) =>
                    setNewVehicle({ ...newVehicle, status: val.value })
                  }
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </div>
            </div>

            <div
              className="to-modal-footer"
              style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}
            >
              <button type="submit" className="to-modal-footer-btn save">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8l-4-4H8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 14a3 3 0 100-6 3 3 0 000 6z"
                  />
                </svg>
                Save
              </button>

              <button
                type="button"
                className="to-modal-footer-btn clear"
                onClick={handleClearForm}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"
                  />
                </svg>
                Clear
              </button>

              <button
                type="button"
                className="to-modal-footer-btn close"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default FleetAddEditModal;
