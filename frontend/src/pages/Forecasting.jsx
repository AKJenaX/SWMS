import React, { useEffect, useMemo, useState } from 'react';
import { forecastingService } from '../api/dashboardServices';
import { DashboardPage, DataTable, EmptyState, ErrorState, LoadingState, Panel, SimpleBarChart, StatCard, StatGrid } from '../components/DashboardKit';

function Forecasting() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forecasts, setForecasts] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);

  useEffect(() => {
    const loadForecasts = async () => {
      try {
        setError('');
        const data = await forecastingService.getAllForecasts();
        setForecasts(data || []);
        setSelectedBin(data?.[0] || null);
      } catch (err) {
        setError(err.message || 'Unable to load forecasts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadForecasts();
  }, []);

  const avgGrowth = forecasts.length
    ? (forecasts.reduce((sum, f) => sum + Number(f.growthPerHour || 0), 0) / forecasts.length).toFixed(1)
    : '0.0';

  const chartItems = useMemo(() => forecasts.slice(0, 8).map((forecast) => ({
    label: `Bin ${forecast.binId}`,
    value: forecast.risk_24h,
    displayValue: `${forecast.risk_24h.toFixed(0)}%`,
  })), [forecasts]);

  return (
    <DashboardPage title="Forecasting" subtitle="Predictive fill-level risk and collection timing">
      {loading ? (
        <LoadingState label="Loading forecasts..." />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <StatGrid>
            <StatCard label="Critical in 6h" value={forecasts.filter((f) => f.risk_6h > 80).length} helper="Immediate attention" tone="critical" />
            <StatCard label="Warning in 12h" value={forecasts.filter((f) => f.risk_12h > 60 && f.risk_12h <= 80).length} helper="Monitor closely" tone="warning" />
            <StatCard label="Safe in 24h" value={forecasts.filter((f) => f.risk_24h <= 60).length} helper="Low collection risk" />
            <StatCard label="Avg Growth" value={`${avgGrowth}%`} helper="Per hour" />
          </StatGrid>

          <div className="dashboard-grid-2">
            <Panel title="24h Risk Curve" subtitle="Highest forecasted bin fill levels">
              {chartItems.length ? <SimpleBarChart items={chartItems} /> : <EmptyState title="No forecast data" message="Telemetry history is required to generate forecast curves." />}
            </Panel>
            <Panel title={selectedBin ? `Bin ${selectedBin.binId}` : 'Bin Detail'} subtitle="Selected forecast detail">
              {selectedBin ? (
                <div className="field-grid">
                  <div className="field-card"><span>Current Fill</span><strong>{selectedBin.latestFillPct.toFixed(1)}%</strong></div>
                  <div className="field-card"><span>Growth Rate</span><strong>{selectedBin.growthPerHour.toFixed(2)}%/h</strong></div>
                  <div className="field-card"><span>Time to Full</span><strong>{selectedBin.growthPerHour > 0 ? `${Math.round((100 - selectedBin.latestFillPct) / selectedBin.growthPerHour)}h` : 'Stable'}</strong></div>
                  <div className="field-card"><span>24h Forecast</span><strong>{selectedBin.risk_24h.toFixed(1)}%</strong></div>
                </div>
              ) : (
                <EmptyState title="No bin selected" message="Select a row from the forecast table." />
              )}
            </Panel>
          </div>

          <Panel title="Bin Forecasts">
            <DataTable
              rows={forecasts}
              onRowClick={setSelectedBin}
              emptyTitle="No forecasts available"
              emptyMessage="Add telemetry readings to enable forecasting."
              columns={[
                { key: 'binId', header: 'Bin ID', render: (row) => `#${row.binId}` },
                { key: 'latestFillPct', header: 'Current Fill', render: (row) => `${row.latestFillPct.toFixed(1)}%` },
                { key: 'growthPerHour', header: 'Growth/Hour', render: (row) => `${row.growthPerHour.toFixed(2)}%` },
                { key: 'risk_6h', header: '6h', render: (row) => `${row.risk_6h.toFixed(1)}%` },
                { key: 'risk_12h', header: '12h', render: (row) => `${row.risk_12h.toFixed(1)}%` },
                { key: 'risk_24h', header: '24h', render: (row) => `${row.risk_24h.toFixed(1)}%` },
              ]}
            />
          </Panel>
        </>
      )}
    </DashboardPage>
  );
}

export default Forecasting;
