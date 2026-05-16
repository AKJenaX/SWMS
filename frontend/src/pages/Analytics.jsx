import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { analyticsService } from '../api/dashboardServices';
import {
  DashboardPage,
  DataTable,
  ErrorState,
  LoadingState,
  Panel,
  SimpleBarChart,
  StatCard,
  StatGrid,
} from '../components/DashboardKit';

function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
}

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [kpiData, metricsData] = await Promise.all([
        analyticsService.getKpiSummary(),
        analyticsService.getPerformanceMetrics(timeRange),
      ]);
      setKpis(kpiData);
      setMetrics(metricsData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const chartItems = useMemo(
    () => metrics.map((metric) => ({
      label: metric.name,
      value: Number(String(metric.current).replace(/[^\d.]/g, '')) || 0,
      displayValue: metric.current,
    })),
    [metrics]
  );

  const actions = (
    <select className="select-field" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
      <option value="7d">Last 7 Days</option>
      <option value="30d">Last 30 Days</option>
      <option value="90d">Last 90 Days</option>
    </select>
  );

  return (
    <DashboardPage title="Analytics" subtitle="Operational insights and performance metrics" actions={actions}>
      {loading && <LoadingState label="Loading analytics..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadData} />}
      {!loading && !error && (
        <>
          <StatGrid>
            {kpis && Object.entries(kpis).map(([key, value]) => (
              <StatCard key={key} label={labelize(key)} value={value.current} helper={`${value.change}% vs previous period`} />
            ))}
          </StatGrid>

          <div className="dashboard-grid-2">
            <Panel title="Performance Distribution" subtitle="Current values from available operational data">
              {chartItems.length ? (
                <SimpleBarChart items={chartItems} />
              ) : (
                <DataTable rows={[]} columns={[]} emptyTitle="No metrics available" emptyMessage="Metrics will appear after operations data is available." />
              )}
            </Panel>
            <Panel title="Status Summary" subtitle="Metric health against target thresholds">
              <DataTable
                rows={metrics}
                emptyTitle="No performance rows"
                emptyMessage="Connect data sources to populate performance rows."
                columns={[
                  { key: 'name', header: 'Metric' },
                  { key: 'current', header: 'Current' },
                  { key: 'target', header: 'Target' },
                  { key: 'status', header: 'Status', render: (row) => <span className={`badge badge-${row.status}`}>{row.status.toUpperCase()}</span> },
                ]}
              />
            </Panel>
          </div>
        </>
      )}
    </DashboardPage>
  );
}

export default Analytics;
