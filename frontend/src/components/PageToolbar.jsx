import PropTypes from "prop-types";

const PageToolbar = ({
  title,
  onAddClick,
  addButtonText = "Add New",
  onRefreshClick,
}) => {
  return (
    <div className="to-toolbar">
      <div className="to-toolbar-left">
        <h3 className="to-toolbar-title">{title}</h3>
      </div>

      <div className="to-toolbar-actions">
        {onRefreshClick && (
          <button
            className="to-toolbar-action-btn refresh"
            onClick={onRefreshClick}
            type="button"
            title="Refresh Data"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              color: "#AEB5C2",
              borderRadius: "4px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#06B6D4";
              e.currentTarget.style.background = "rgba(6, 182, 212, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#AEB5C2";
              e.currentTarget.style.background = "none";
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.2"
              style={{ width: "18px", height: "18px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17"
              />
            </svg>
          </button>
        )}

        {onAddClick && (
          <button
            className="to-toolbar-add-btn"
            onClick={onAddClick}
            type="button"
            style={{
              background: "linear-gradient(135deg, #F28C0F 0%, #D86B00 100%)",
              color: "#0E1013",
              border: "none",
              fontWeight: "600",
              padding: "0.4rem 0.9rem",
              borderRadius: "6px",
              fontSize: "0.82rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              boxShadow: "0 4px 10px rgba(242, 140, 15, 0.15)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(242, 140, 15, 0.22)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(242, 140, 15, 0.15)";
            }}
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ width: "12px", height: "12px" }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {addButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

PageToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  onAddClick: PropTypes.func,
  addButtonText: PropTypes.string,
  onRefreshClick: PropTypes.func,
};

export default PageToolbar;
