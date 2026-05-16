import React, { useEffect, useState } from 'react';
import { iotService } from '../api/dashboardServices';
import { DashboardPage, EmptyState, ErrorState, FilterBar, LoadingState, Panel, StatCard, StatGrid } from '../components/DashboardKit';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Warning', value: 'warning' },
  { label: 'Critical', value: 'critical' },
];

function IoTTelemetry() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [telemetry, setTelemetry] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadData = async () => {
    try {
      setError('');
      const [telemetryData, alertsData] = await Promise.all([
        iotService.getTelemetry(),
        iotService.getSensorAlerts(),
      ]);
      setTelemetry(telemetryData || []);
      setAlerts(alertsData || []);
      setSelectedBin((current) => current || telemetryData?.[0] || null);
    } catch (err) {
      setError(err.message || 'Unable to load telemetry.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTelemetry = filter === 'all' ? telemetry : telemetry.filter((item) => item.status === filter);

  return (
    <DashboardPage
      title="IoT Telemetry"
      subtitle="Live sensor status, alerts, and bin health"
      actions={<FilterBar options={filters} value={filter} onChange={setFilter} />}
    >
      {loading ? (
        <LoadingState label="Loading telemetry..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <>
          <StatGrid>
            <StatCard label="Healthy Sensors" value={telemetry.filter((t) => t.status === 'healthy').length} helper="Operational" />
            <StatCard label="Warnings" value={telemetry.filter((t) => t.status === 'warning').length} helper="Monitor" tone="warning" />
            <StatCard label="Critical" value={telemetry.filter((t) => t.status === 'critical').length} helper="Urgent" tone="critical" />
            <StatCard label="Active Alerts" value={alerts.length} helper="Open events" tone="info" />
          </StatGrid>

          <div className="dashboard-grid-3">
            <Panel title="Live Sensor Data">
              {!filteredTelemetry.length ? (
                <EmptyState title="No telemetry found" message="Sensor records will appear here after ingestion." />
              ) : (
                <div className="item-list">
                  {filteredTelemetry.map((bin) => (
                    <button
                      key={bin.id}
                      type="button"
                      className={`list-item ${selectedBin?.id === bin.id ? 'active' : ''}`}
                      onClick={() => setSelectedBin(bin)}
                    >
                      <strong>Bin #{bin.id}</strong>
                      <span className="text-muted">{bin.status} · {bin.fill_pct}% fill · {bin.battery_pct}% battery</span>
                    </button>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title={selectedBin ? `Bin #${selectedBin.id}` : 'Telemetry Detail'} subtitle="Current sensor snapshot">
              {selectedBin ? (
                <>
                  <div className="field-grid">
                    <div className="field-card"><span>Fill Level</span><strong>{selectedBin.fill_pct}%</strong></div>
                    <div className="field-card"><span>Battery</span><strong>{selectedBin.battery_pct}%</strong></div>
                    <div className="field-card"><span>Temperature</span><strong>{selectedBin.temperature}C</strong></div>
                    <div className="field-card"><span>Status</span><strong>{selectedBin.status}</strong></div>
                    <div className="field-card"><span>Smoke</span><strong>{selectedBin.smoke_detected ? 'Detected' : 'Clear'}</strong></div>
                    <div className="field-card"><span>Tilt</span><strong>{selectedBin.tilt_detected ? 'Detected' : 'Normal'}</strong></div>
                  </div>
                  {selectedBin.gps_lat && selectedBin.gps_lng && (
                    <div className="field-card" style={{ marginTop: 14 }}>
                      <span>GPS Location</span>
                      <strong>{selectedBin.gps_lat.toFixed(6)}, {selectedBin.gps_lng.toFixed(6)}</strong>
                    </div>
                  )}
                </>
              ) : (
                <EmptyState title="No sensor selected" message="Select a bin to inspect the latest telemetry." />
              )}
            </Panel>
          </div>

          <Panel title="Active Alerts">
            {!alerts.length ? (
              <EmptyState title="No active alerts" message="Alert cards will appear here when sensor rules trigger." />
            ) : (
              <div className="item-list">
                {alerts.slice(0, 8).map((alert) => (
                  <div key={alert.id} className="list-item">
                    <strong>{alert.type}</strong>
                    <span className="text-muted">Bin #{alert.bin_id || 'N/A'} · {alert.message}</span>
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

export default IoTTelemetry;
