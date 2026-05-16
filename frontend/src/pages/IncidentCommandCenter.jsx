import React, { useEffect, useMemo, useState } from "react";
import { DashboardPage, DataTable, EmptyState, ErrorState, LoadingState, Panel, StatCard, StatGrid } from "../components/DashboardKit";
import { incidentsService } from "../api/incidentsService";

const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
const validStates = ["open", "triaged", "assigned", "in_progress", "resolved", "closed"];

function IncidentCommandCenter() {
  const [incidents, setIncidents] = useState([]);
  const [dispatchQueue, setDispatchQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newIncident, setNewIncident] = useState({
    incident_type: "overflow_risk",
    severity: "medium",
    bin_id: "",
    description: "",
  });
  const [assignments, setAssignments] = useState({});

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [allIncidents, queue] = await Promise.all([
        incidentsService.getAll(),
        incidentsService.getDispatchQueue(),
      ]);
      setIncidents(allIncidents || []);
      setDispatchQueue(queue || []);
    } catch (_e) {
      setError("Unable to load incidents. Check backend auth and connectivity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const total = incidents.length;
    const active = incidents.filter((i) => !["resolved", "closed"].includes(i.status)).length;
    const critical = incidents.filter((i) => i.severity === "critical").length;
    const resolved = incidents.filter((i) => ["resolved", "closed"].includes(i.status)).length;
    return { total, active, critical, resolved };
  }, [incidents]);

  const sortedIncidents = useMemo(() => {
    return [...incidents].sort((a, b) => {
      const sa = severityOrder[a.severity] || 0;
      const sb = severityOrder[b.severity] || 0;
      if (sa !== sb) return sb - sa;
      return Number(b.id) - Number(a.id);
    });
  }, [incidents]);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    try {
      await incidentsService.create({
        ...newIncident,
        bin_id: newIncident.bin_id ? Number(newIncident.bin_id) : null,
      });
      setNewIncident({ incident_type: "overflow_risk", severity: "medium", bin_id: "", description: "" });
      await loadData();
    } catch (_e) {
      setError("Failed to create incident.");
    }
  };

  const handleStateChange = async (id, status) => {
    try {
      await incidentsService.updateState(id, status);
      await loadData();
    } catch (_e) {
      setError("Failed to update incident state.");
    }
  };

  const handleAssign = async (id) => {
    const payload = assignments[id] || {};
    try {
      await incidentsService.assign(id, {
        driver_id: payload.driver_id ? Number(payload.driver_id) : null,
        vehicle_id: payload.vehicle_id ? Number(payload.vehicle_id) : null,
        authority_id: payload.authority_id ? Number(payload.authority_id) : null,
      });
      await loadData();
    } catch (_e) {
      setError("Failed to assign incident.");
    }
  };

  return (
    <DashboardPage title="Incident Command Center" subtitle="Operational control for incident lifecycle and dispatch">
      {error && <ErrorState message={error} onRetry={loadData} />}

      <StatGrid>
        <StatCard label="Total" value={stats.total} helper="All incidents" />
        <StatCard label="Active" value={stats.active} helper="Open workload" tone="info" />
        <StatCard label="Critical" value={stats.critical} helper="Priority incidents" tone="critical" />
        <StatCard label="Resolved" value={stats.resolved} helper="Closed work" />
      </StatGrid>

      <div className="dashboard-grid-3">
        <Panel title="Create Incident">
          <form className="icc-form" onSubmit={handleCreateIncident}>
            <input value={newIncident.incident_type} onChange={(e) => setNewIncident((prev) => ({ ...prev, incident_type: e.target.value }))} placeholder="Incident type" required />
            <select value={newIncident.severity} onChange={(e) => setNewIncident((prev) => ({ ...prev, severity: e.target.value }))}>
              <option value="critical">critical</option>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
            </select>
            <input value={newIncident.bin_id} onChange={(e) => setNewIncident((prev) => ({ ...prev, bin_id: e.target.value }))} placeholder="Bin ID (optional)" />
            <textarea value={newIncident.description} onChange={(e) => setNewIncident((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" />
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </Panel>

        <Panel title="Dispatch Queue">
          {loading ? (
            <LoadingState label="Loading dispatch queue..." />
          ) : dispatchQueue.length ? (
            <div className="item-list">
              {dispatchQueue.map((item) => (
                <div key={item.id} className="list-item">
                  <strong>#{item.id} · {item.incident_type}</strong>
                  <span className="text-muted">{item.severity} · {item.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No active dispatch items" message="Assigned incidents will appear in the dispatch queue." />
          )}
        </Panel>
      </div>

      <Panel title="Incident Queue">
        {loading ? (
          <LoadingState label="Loading incidents..." />
        ) : (
          <DataTable
            rows={sortedIncidents}
            emptyTitle="No incidents found"
            emptyMessage="Create an incident to begin dispatch workflow."
            columns={[
              { key: "id", header: "ID", render: (incident) => `#${incident.id}` },
              { key: "incident_type", header: "Type" },
              { key: "severity", header: "Severity", render: (incident) => <span className={`icc-badge ${incident.severity}`}>{incident.severity}</span> },
              { key: "status", header: "Status" },
              {
                key: "state",
                header: "State Transition",
                render: (incident) => (
                  <select value={incident.status} onChange={(e) => handleStateChange(incident.id, e.target.value)}>
                    {validStates.map((state) => <option key={state} value={state}>{state}</option>)}
                  </select>
                ),
              },
              {
                key: "assign",
                header: "Assign",
                render: (incident) => (
                  <div className="icc-assign-grid">
                    <input placeholder="Driver" value={assignments[incident.id]?.driver_id || ""} onChange={(e) => setAssignments((prev) => ({ ...prev, [incident.id]: { ...prev[incident.id], driver_id: e.target.value } }))} />
                    <input placeholder="Vehicle" value={assignments[incident.id]?.vehicle_id || ""} onChange={(e) => setAssignments((prev) => ({ ...prev, [incident.id]: { ...prev[incident.id], vehicle_id: e.target.value } }))} />
                    <input placeholder="Authority" value={assignments[incident.id]?.authority_id || ""} onChange={(e) => setAssignments((prev) => ({ ...prev, [incident.id]: { ...prev[incident.id], authority_id: e.target.value } }))} />
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => handleAssign(incident.id)}>Assign</button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </Panel>
    </DashboardPage>
  );
}

export default IncidentCommandCenter;
