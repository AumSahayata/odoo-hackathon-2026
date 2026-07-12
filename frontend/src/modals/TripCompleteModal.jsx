import { useState } from "react";
import Modal from "react-modal";
import Toast from "../components/Toast";

Modal.setAppElement("#root");

const TripCompleteModal = ({ isModalOpen, setIsModalOpen, trip, onCompleteSubmit }) => {
  const [toast, setToast] = useState(null);
  const [odometer, setOdometer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const reading = parseFloat(odometer);
    if (isNaN(reading) || reading < 0) {
      setToast({ message: "Please enter a valid positive odometer reading.", type: "error" });
      return;
    }
    
    onCompleteSubmit(trip, { odometer_reading: reading });
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Complete Trip"
        className="to-modal-content"
        overlayClassName="to-modal-overlay"
        style={{
          content: {
            maxWidth: "400px",
            margin: "15vh auto",
            position: "relative",
          }
        }}
      >
        <div className="to-modal-header">
          <h3 className="to-modal-header-title">Complete Trip</h3>
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
          <form onSubmit={handleSubmit}>
            <div className="to-master-full-row">
              <label className="to-master-label">Final Odometer Reading<span>*</span></label>
              <div className="to-master-input-wrap">
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="to-input"
                  placeholder="e.g. 15000"
                  required
                  value={odometer}
                  onChange={(e) => setOdometer(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="to-modal-footer" style={{ margin: "1.5rem -1.5rem -1.5rem -1.5rem" }}>
              <button type="submit" className="to-modal-footer-btn save">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Confirm Completion
              </button>
              <button type="button" className="to-modal-footer-btn close" onClick={() => setIsModalOpen(false)}>
                Cancel
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

export default TripCompleteModal;
