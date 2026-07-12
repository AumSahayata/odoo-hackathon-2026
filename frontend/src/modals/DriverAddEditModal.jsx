import { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum.js";
import Toast from "../components/Toast";

Modal.setAppElement("#root");

const licenseCategoryOptions = [
  { value: "MCWOG", label: "MCWOG" },
  { value: "MCWG", label: "MCWG" },
  { value: "LMV-NT", label: "LMV-NT" },
  { value: "LMV-TR", label: "LMV-TR" },
  { value: "HMV", label: "HMV" },
];

const statusOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ON_TRIP", label: "On Trip" },
  { value: "OFF_DUTY", label: "Off Duty" },
  { value: "SUSPENDED", label: "Suspended" },
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

const DriverAddEditModal = ({ isModalOpen, setIsModalOpen, driverToEdit, onSave }) => {
  const [toast, setToast] = useState(null);
  const [prevDriverToEdit, setPrevDriverToEdit] = useState(null);
  const [newDriver, setNewDriver] = useState({
    full_name: "",
    license_number: "",
    license_category: "LMV-NT",
    license_expiry_date: "",
    contact_number: "",
    safety_score: "100",
    status: "AVAILABLE",
  });

  if (driverToEdit !== prevDriverToEdit) {
    setPrevDriverToEdit(driverToEdit);
    setNewDriver(
      driverToEdit
        ? {
            full_name: driverToEdit.full_name || "",
            license_number: driverToEdit.license_number || "",
            license_category: driverToEdit.license_category || "LMV-NT",
            license_expiry_date: driverToEdit.license_expiry_date || "",
            contact_number: driverToEdit.contact_number || "",
            safety_score: String(driverToEdit.safety_score ?? "100"),
            status: driverToEdit.status || "AVAILABLE",
          }
        : {
            full_name: "",
            license_number: "",
            license_category: "LMV-NT",
            license_expiry_date: "",
            contact_number: "",
            safety_score: "100",
            status: "AVAILABLE",
          }
    );
  }

  const handleClearForm = () => {
    setNewDriver({
      full_name: "",
      license_number: "",
      license_category: "LMV-NT",
      license_expiry_date: "",
      contact_number: "",
      safety_score: "100",
      status: "AVAILABLE",
    });
  };

  const handleAddDriver = async (e) => {
    if (e) e.preventDefault();

    const fullName = newDriver.full_name.trim();
    if (fullName.length < 2 || fullName.length > 100) {
      setToast({
        message: "Driver name must be between 2 and 100 characters.",
        type: "error",
      });
      return;
    }

    const licenseNumber = newDriver.license_number.trim();
    if (!licenseNumber) {
      setToast({ message: "License number is required.", type: "error" });
      return;
    }

    const expiryDate = newDriver.license_expiry_date;
    if (!expiryDate) {
      setToast({ message: "License expiry date is required.", type: "error" });
      return;
    }

    const contactNumber = newDriver.contact_number.trim();
    if (!contactNumber) {
      setToast({ message: "Contact number is required.", type: "error" });
      return;
    }

    const score = parseFloat(newDriver.safety_score);
    if (isNaN(score) || score < 0 || score > 100) {
      setToast({
        message: "Safety score must be a decimal between 0 and 100.",
        type: "error",
      });
      return;
    }

    const createdDriver = {
      id: driverToEdit ? driverToEdit.id : Date.now(),
      full_name: fullName,
      license_number: licenseNumber,
      license_category: newDriver.license_category,
      license_expiry_date: expiryDate,
      contact_number: contactNumber,
      safety_score: score,
      status: newDriver.status,
    };

    try {
      const url = driverToEdit
        ? MasterAPI?.DriversUpdate.replace("{id}", driverToEdit.id)
        : MasterAPI?.DriversAdd;

      const payload = {};
      if (driverToEdit) {
        if (fullName !== driverToEdit.full_name) {
          payload.full_name = fullName;
        }
        if (licenseNumber !== driverToEdit.license_number) {
          payload.license_number = licenseNumber;
        }
        if (newDriver.license_category !== driverToEdit.license_category) {
          payload.license_category = newDriver.license_category;
        }
        if (expiryDate !== driverToEdit.license_expiry_date) {
          payload.license_expiry_date = expiryDate;
        }
        if (contactNumber !== driverToEdit.contact_number) {
          payload.contact_number = contactNumber;
        }
        if (score !== driverToEdit.safety_score) {
          payload.safety_score = score;
        }
        if (newDriver.status !== driverToEdit.status) {
          payload.status = newDriver.status;
        }
      } else {
        Object.assign(payload, createdDriver);
        delete payload.id;
      }

      await apiCall(
        url,
        driverToEdit ? METHOD?.Patch : METHOD?.Post,
        payload
      );

      if (onSave) {
        onSave(
          driverToEdit
            ? `Driver "${fullName}" successfully updated.`
            : `Driver "${fullName}" successfully registered.`
        );
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      setToast({ message: error?.message || "Failed to save driver.", type: "error" });
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add New Operator"
      >
        <div className="to-modal-header">
          <h3 className="to-modal-header-title">
            {driverToEdit ? "Edit Operator" : "Driver Master"}
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
          <form onSubmit={handleAddDriver}>
            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">
                  Driver Name<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. Alex"
                    required
                    value={newDriver?.full_name}
                    onChange={(e) =>
                      setNewDriver({
                        ...newDriver,
                        full_name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="to-master-field-row">
                <label className="to-master-label">
                  License Number<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. DL-XXXXX"
                    required
                    value={newDriver?.license_number}
                    onChange={(e) =>
                      setNewDriver({
                        ...newDriver,
                        license_number: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">
                  Category<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <Select
                    options={licenseCategoryOptions}
                    styles={customSelectStyles}
                    value={licenseCategoryOptions.find((opt) => opt.value === newDriver.license_category)}
                    onChange={(val) => setNewDriver({ ...newDriver, license_category: val.value })}
                  />
                </div>
              </div>

              <div className="to-master-field-row">
                <label className="to-master-label">
                  Expiry Date<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="date"
                    className="to-input"
                    required
                    value={newDriver.license_expiry_date}
                    onChange={(e) =>
                      setNewDriver({
                        ...newDriver,
                        license_expiry_date: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="to-master-form-grid">
              <div className="to-master-field-row">
                <label className="to-master-label">
                  Contact Number<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="text"
                    className="to-input"
                    placeholder="e.g. 98765xxxxx"
                    required
                    value={newDriver.contact_number}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, contact_number: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="to-master-field-row">
                <label className="to-master-label">
                  Safety Score (0-100)<span>*</span>
                </label>
                <div className="to-master-input-wrap">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    className="to-input"
                    placeholder="e.g. 100"
                    required
                    value={newDriver.safety_score}
                    onChange={(e) =>
                      setNewDriver({
                        ...newDriver,
                        safety_score: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="to-master-divider"></div>

            <div className="to-master-full-row">
              <label className="to-master-label">
                Initial Status<span>*</span>
              </label>
              <div className="to-master-input-wrap">
                <Select
                  options={statusOptions}
                  styles={customSelectStyles}
                  value={statusOptions.find((opt) => opt.value === newDriver.status)}
                  onChange={(val) => setNewDriver({ ...newDriver, status: val.value })}
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

export default DriverAddEditModal;
