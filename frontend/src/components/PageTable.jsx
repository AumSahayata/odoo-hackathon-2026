import PropTypes from "prop-types";

const PageTable = ({
  columns,
  data,
  emptyMessage = "No matching records found.",
  onDelete,
  onRowDoubleClick,
}) => {
  return (
    <div className="to-table-card" style={{ overflowX: "auto", width: "100%" }}>
      <table className="to-table grid-theme">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  textAlign: col.align || "left",
                  width: col.width || "auto",
                }}
              >
                {col.label}
              </th>
            ))}
            {onDelete && (
              <th
                style={{
                  textAlign: "center",
                  width: "80px",
                }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIdx) => (
            <tr
              key={item.id || rowIdx}
              onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(item)}
              style={{ cursor: onRowDoubleClick ? "pointer" : "default" }}
            >
              {columns.map((col, colIdx) => {
                const cellVal = item[col.key];
                return (
                  <td
                    key={col.key || colIdx}
                    className={col.className || ""}
                    style={{
                      textAlign: col.align || "left",
                      ...col.cellStyle,
                    }}
                  >
                    {col.render ? col.render(cellVal, item, rowIdx) : cellVal}
                  </td>
                );
              })}
              {onDelete && (
                <td style={{ textAlign: "center" }}>
                  <button
                    className="to-action-delete-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid double click or row click events
                      onDelete(item);
                    }}
                    title="Delete Record"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={onDelete ? columns.length + 1 : columns.length}
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  color: "#646C7A",
                  background: "transparent",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

PageTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      align: PropTypes.oneOf(["left", "center", "right"]),
      width: PropTypes.string,
      className: PropTypes.string,
      cellStyle: PropTypes.object,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string,
  onDelete: PropTypes.func,
  onRowDoubleClick: PropTypes.func,
};

export default PageTable;
