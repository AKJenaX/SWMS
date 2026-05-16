import React, { useEffect, useState } from 'react';
import { anomalyService } from '../api/dashboardServices';
import { DashboardPage, EmptyState, ErrorState, LoadingState, Panel, StatCard, StatGrid } from '../components/DashboardKit';

function AnomalyDetection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anomalies, setAnomalies] = useState([]);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const loadAnomalies = async () => {
    setLoading(true);
    try {
      setError('');
      const data = await anomalyService.getAnomalies();
      setAnomalies(data || []);
      setSelectedAnomaly(data?.[0] || null);
    } catch (err) {
      setError(err.message || 'Unable to load anomalies.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnomalies();
  }, []);

  const handleMarkReviewed = async () => {
    if (!selectedAnomaly) return;
    try {
      await anomalyService.markReviewed(selectedAnomaly.id, reviewNotes);
      setReviewNotes('');
      await loadAnomalies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardPage title="Anomaly Detection" subtitle="Sensor drift, operational irregularities, and review workflow">
      {loading ? (
        <LoadingState label="Loading anomalies..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadAnomalies} />
      ) : (
        <>
          <StatGrid>
            <StatCard label="Detected" value={anomalies.length} helper="Open findings" />
            <StatCard label="Critical / High" value={anomalies.filter((a) => ['critical', 'high'].includes(a.severity)).length} helper="Priority review" tone="critical" />
            <StatCard label="Pending Review" value={anomalies.filter((a) => !a.reviewed).length} helper="Action required" tone="warning" />
            <StatCard label="Reviewed" value={anomalies.filter((a) => a.reviewed).length} helper="Closed analysis" />
          </StatGrid>

          <div className="dashboard-grid-3">
            <Panel title="Detected Anomalies">
              {!anomalies.length ? (
                <EmptyState title="No anomalies detected" message="Sensor and route anomalies will appear here as they are found." />
              ) : (
                <div className="item-list">
                  {anomalies.map((anomaly) => (
                    <button
                      type="button"
                      key={anomaly.id}
                      className={`list-item ${selectedAnomaly?.id === anomaly.id ? 'active' : ''}`}
                      onClick={() => setSelectedAnomaly(anomaly)}
                    >
                      <strong>{anomaly.type}</strong>
                      <span className="text-muted">Bin #{anomaly.bin_id || 'N/A'} · {anomaly.severity}</span>
                    </button>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Anomaly Analysis" subtitle={selectedAnomaly ? `ID: ${selectedAnomaly.id}` : 'Select an anomaly'}>
              {!selectedAnomaly ? (
                <EmptyState title="No anomaly selected" message="Select an anomaly from the list to inspect details." />
              ) : (
                <>
                  <div className="field-grid">
                    <div className="field-card"><span>Type</span><strong>{selectedAnomaly.type}</strong></div>
                    <div className="field-card"><span>Severity</span><strong>{selectedAnomaly.severity}</strong></div>
                    <div className="field-card"><span>Bin</span><strong>#{selectedAnomaly.bin_id || 'N/A'}</strong></div>
                    <div className="field-card"><span>Status</span><strong>{selectedAnomaly.reviewed ? 'Reviewed' : 'Pending'}</strong></div>
                  </div>
                  <div className="field-card" style={{ marginTop: 14 }}>
                    <span>Details</span>
                    <strong>{selectedAnomaly.description || 'No additional details available.'}</strong>
                  </div>
                  {selectedAnomaly.metrics && (
                    <div className="field-grid" style={{ marginTop: 14 }}>
                      {Object.entries(selectedAnomaly.metrics).map(([key, value]) => (
                        <div className="field-card" key={key}><span>{key}</span><strong>{value}</strong></div>
                      ))}
                    </div>
                  )}
                  {!selectedAnomaly.reviewed && (
                    <div className="input-group" style={{ marginTop: 14 }}>
                      <label className="input-label">Review Notes</label>
                      <textarea className="input-field" value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} placeholder="Add analysis or action taken" />
                      <button className="btn btn-accent" type="button" onClick={handleMarkReviewed}>Mark as Reviewed</button>
                    </div>
                  )}
                </>
              )}
            </Panel>
          </div>
        </>
      )}
    </DashboardPage>
  );
}

export default AnomalyDetection;
