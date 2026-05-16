import React, { useEffect, useState } from 'react';
import { slaService } from '../api/dashboardServices';
import { DashboardPage, DataTable, EmptyState, ErrorState, LoadingState, Panel, StatCard, StatGrid } from '../components/DashboardKit';

function SLAMonitoring() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [policies, setPolicies] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('');
        const [policiesData, escalationsData, metricsData] = await Promise.all([
          slaService.getPolicies(),
          slaService.getEscalations(),
          slaService.getMetrics(),
        ]);
        setPolicies(policiesData || []);
        setEscalations(escalationsData || []);
        setMetrics(metricsData);
      } catch (err) {
        setError(err.message || 'Unable to load SLA data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <DashboardPage title="SLA Monitoring" subtitle="Compliance, escalation windows, and active response risk">
      {loading ? (
        <LoadingState label="Loading SLA data..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <StatGrid>
            <StatCard label="Compliance" value={`${metrics?.overallCompliance ?? 100}%`} helper="Current adherence" />
            <StatCard label="Active Incidents" value={metrics?.activeIncidents ?? 0} helper="Open workload" tone="info" />
            <StatCard label="Breached Today" value={metrics?.breachedToday ?? 0} helper="Over target" tone="critical" />
            <StatCard label="At Risk" value={metrics?.atRisk ?? 0} helper="Next hour" tone="warning" />
          </StatGrid>

          <Panel title="Pending Escalations">
            <DataTable
              rows={escalations}
              emptyTitle="No escalations pending"
              emptyMessage="Incidents are currently inside SLA thresholds."
              rowClassName={() => 'critical'}
              columns={[
                { key: 'incident_id', header: 'Incident', render: (row) => `#${row.incident_id}` },
                { key: 'severity', header: 'Severity', render: (row) => <span className={`badge badge-${row.severity === 'critical' ? 'critical' : 'warning'}`}>{row.severity}</span> },
                { key: 'age_minutes', header: 'Age', render: (row) => `${row.age_minutes} min` },
                { key: 'target_minutes', header: 'SLA Target', render: (row) => `${row.target_minutes} min` },
                { key: 'status', header: 'Status', render: () => <span className="badge badge-critical">Escalated</span> },
              ]}
            />
          </Panel>

          <Panel title="SLA Policies">
            {!policies.length ? (
              <EmptyState title="No SLA policies configured" message="Create policies in the backend to begin compliance tracking." />
            ) : (
              <div className="stat-grid">
                {policies.map((policy) => (
                  <div className="field-card" key={policy.id}>
                    <span>{policy.zone_name}</span>
                    <strong>{policy.severity} · {policy.target_minutes}m target</strong>
                    <p className="text-muted">Escalates after {policy.escalation_minutes}m</p>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </>
      )}
    </DashboardPage>
  );
}

export default SLAMonitoring;
