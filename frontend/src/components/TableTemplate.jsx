import React from "react";

function TableTemplate({ data, columns, entityIdKey, onEdit, onDelete }) {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="table-card">
      {/* Header */}
      <div className="table-card-header">
        <h3 className="table-title">
          Records {data && !isEmpty && `(${data.length})`}
        </h3>
      </div>

      {/* Empty State */}
      {isEmpty ? (
        <div className="table-empty">
          <div className="table-empty-title">No records found</div>
          <div className="table-empty-sub">
            Add new records to see them listed here.
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.header}</th>
                ))}
                <th className="table-actions-head">Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr key={item[entityIdKey]}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {item[col.key] ?? (
                        <span className="table-na">-</span>
                      )}
                    </td>
                  ))}

                  <td className="table-actions">
                    <button
                      className="action-btn edit"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => onDelete(item[entityIdKey])}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TableTemplate;