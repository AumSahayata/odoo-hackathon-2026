import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Toast from "../components/Toast";
import PageToolbar from "../components/PageToolbar";
import FleetAddEditModal from "../modals/FleetAddEditModal";
import PageTable from "../components/PageTable";
import apiCall from "../api";
import { MasterAPI } from "../Api.jsx";
import { METHOD } from "../commons/CommonEnum.js";

const columns = [
  {
    key: "model_name",
    label: "Model",
    cellStyle: { fontWeight: "600" },
  },
  {
    key: "registration_number",
    label: "Reg. Number",
    className: "mono",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "max_load_capacity",
    label: "Max Load",
    className: "mono",
    render: (val) => `${val.toLocaleString()} kg`,
  },
  {
    key: "odometer",
    label: "Odometer",
    className: "mono",
    render: (val) => `${val.toLocaleString()} km`,
  },
  {
    key: "acquisition_cost",
    label: "Acq. Cost",
    className: "mono",
    render: (val) =>
      `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
  },
  {
    key: "current_location",
    label: "Current Location",
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

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const filteredVehicles =
    filter === "All" ? vehicles : vehicles.filter((v) => v.status === filter);

  const handleDeleteVehicle = (vehicle) => {
    Swal.fire({
      title: "Remove Vehicle?",
      text: `Are you sure you want to remove vehicle "${vehicle.model_name}"?`,
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
          const deleteUrl = MasterAPI?.VehicleDelete.replace("{id}", vehicle);
          await apiCall(deleteUrl, METHOD?.Delete);
          setToast({
            message: `Vehicle Deleted successfully.`,
            type: "success",
          });
          fetchFleets();
        } catch (error) {
          setToast({
            message: error?.message || "Failed to delete vehicle.",
            type: "error",
          });
        }
      }
    });
  };

  const handleRowDoubleClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleSaveVehicle = (savedVehicle) => {
    setVehicles((prev) => {
      const exists = prev.some((v) => v.id === savedVehicle.id);
      if (exists) {
        return prev.map((v) => (v.id === savedVehicle.id ? savedVehicle : v));
      } else {
        return [...prev, savedVehicle];
      }
    });
  };

  const fetchFleets = async () => {
    try {
      const result = await apiCall(MasterAPI?.VehicleList, METHOD?.Get);
      if (result && Array.isArray(result)) {
        setTimeout(() => {
          setVehicles(result || []);
        }, 0);
      }
    } catch (error) {
      setToast({
        message: error?.message || "Failed to load fleet data.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchFleets();
  }, []);

  return (
    <div>
      <PageToolbar
        title="Fleet Management"
        onAddClick={() => {
          setEditingVehicle(null);
          setIsModalOpen(true);
        }}
        addButtonText="Add Vehicle"
        onRefreshClick={() => {
          fetchFleets();
          setFilter("All");
          setToast({ message: "Fleet database reloaded.", type: "success" });
        }}
      />

      <PageTable
        columns={columns}
        data={filteredVehicles}
        emptyMessage="No vehicles matching current filter specification."
        onDelete={(vehicle) => handleDeleteVehicle(vehicle.id)}
        onRowDoubleClick={handleRowDoubleClick}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {isModalOpen && (
        <FleetAddEditModal
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
          vehicleToEdit={editingVehicle}
          onSave={handleSaveVehicle}
        />
      )}
    </div>
  );
};

export default Fleet;
