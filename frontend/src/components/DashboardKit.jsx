import React from 'react';

export function DashboardPage({ title, subtitle, actions, children, className = '' }) {
  return (
    <main className={`dashboard-shell ${className}`}>
      <header className="dashboard-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="dashboard-actions">{actions}</div>}
      </header>
      {children}
    </main>
  );
}

export function LoadingState({ label = 'Loading data...' }) {
  return (
    <div className="state-panel">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-panel state-panel-error">
      <h3>Unable to load this view</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'No records yet', message = 'Data will appear here when available.' }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export function StatGrid({ children }) {
  return <section className="stat-grid">{children}</section>;
}

export function StatCard({ label, value, helper, tone = 'default' }) {
  return (
    <article className={`stat-card tone-${tone}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      {helper && <span>{helper}</span>}
    </article>
  );
}

export function Panel({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`dashboard-panel ${className}`}>
      {(title || subtitle || action) && (
        <div className="panel-header">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function FilterBar({ options, value, onChange }) {
  return (
    <div className="filter-bar">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`filter-chip ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function SimpleBarChart({ items, valueKey = 'value', labelKey = 'label' }) {
  const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);
  return (
    <div className="simple-chart">
      {items.map((item) => {
        const value = Number(item[valueKey] || 0);
        return (
          <div className="simple-chart-row" key={item[labelKey]}>
            <span>{item[labelKey]}</span>
            <div className="simple-chart-track">
              <div className="simple-chart-bar" style={{ width: `${Math.max(4, (value / max) * 100)}%` }} />
            </div>
            <strong>{item.displayValue || value}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function DataTable({ columns, rows, emptyTitle, emptyMessage, onRowClick, rowClassName }) {
  if (!rows?.length) {
    return <EmptyState title={emptyTitle} message={emptyMessage} />;
  }

  return (
    <div className="data-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id || row.binId || row.incident_id || index}
              className={rowClassName ? rowClassName(row) : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
