import React, { useEffect, useMemo, useState } from 'react';
import { routeOptimizationService } from '../api/dashboardServices';
import { DashboardPage, EmptyState, ErrorState, LoadingState, Panel, StatCard, StatGrid } from '../components/DashboardKit';

function RouteOptimization() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [optimizing, setOptimizing] = useState(false);

  const loadRoutes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await routeOptimizationService.getRoutes();
      setRoutes(data || []);
      setSelectedRoute(data?.[0] ? { original: data[0] } : null);
    } catch (err) {
      setError(err.message || 'Unable to load routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const totals = useMemo(() => ({
    routes: routes.length,
    stops: routes.reduce((sum, route) => sum + route.stops.length, 0),
    distance: routes.reduce((sum, route) => sum + Number(route.distance || 0), 0).toFixed(1),
  }), [routes]);

  const handleOptimize = async (route) => {
    setOptimizing(true);
    setError('');
    try {
      const optimized = await routeOptimizationService.optimizeRoute(route.vehicle_id, route.stops);
      const improvement = route.distance ? Math.round(((route.distance - optimized.estimatedDistanceKm) / route.distance) * 100) : 0;
      setSelectedRoute({ original: route, optimized, improvement });
    } catch (err) {
      setError(err.message || 'Unable to optimize route.');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <DashboardPage title="Route Optimization" subtitle="Dispatch route planning and capacity-aware stop sequencing">
      {loading && <LoadingState label="Loading active routes..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadRoutes} />}
      {!loading && !error && (
        <>
          <StatGrid>
            <StatCard label="Active Routes" value={totals.routes} helper="Available plans" />
            <StatCard label="Queued Stops" value={totals.stops} helper="Bins in routing pool" />
            <StatCard label="Route Distance" value={`${totals.distance} km`} helper="Current estimate" />
            <StatCard label="Optimization" value={selectedRoute?.improvement ? `${selectedRoute.improvement}%` : 'Ready'} helper="Run planner to compare" />
          </StatGrid>

          <div className="dashboard-grid-3">
            <Panel title="Active Routes" subtitle="Select a route to inspect or optimize">
              {!routes.length ? (
                <EmptyState title="No routes available" message="Telemetry data is needed before route plans can be generated." />
              ) : (
                <div className="item-list">
                  {routes.map((route) => (
                    <button
                      key={route.id}
                      type="button"
                      className={`list-item ${selectedRoute?.original?.id === route.id ? 'active' : ''}`}
                      onClick={() => setSelectedRoute({ original: route })}
                    >
                      <strong>Vehicle #{route.vehicle_id}</strong>
                      <span className="text-muted">{route.stops.length} stops · {route.distance.toFixed(1)} km</span>
                    </button>
                  ))}
                </div>
              )}
            </Panel>

            <Panel
              title={selectedRoute?.original ? `Vehicle #${selectedRoute.original.vehicle_id}` : 'Route Details'}
              subtitle="Distance, duration, and capacity estimate"
              action={selectedRoute?.original && (
                <button className="btn btn-accent btn-sm" type="button" disabled={optimizing} onClick={() => handleOptimize(selectedRoute.original)}>
                  {optimizing ? 'Optimizing...' : 'Optimize'}
                </button>
              )}
            >
              {!selectedRoute?.original ? (
                <EmptyState title="Select a route" message="Choose a route from the list to see the operational plan." />
              ) : (
                <>
                  <div className="field-grid">
                    <div className="field-card"><span>Current Distance</span><strong>{selectedRoute.original.distance.toFixed(1)} km</strong></div>
                    <div className="field-card"><span>Current Duration</span><strong>{Math.round((selectedRoute.original.distance / 25) * 60)} min</strong></div>
                    <div className="field-card"><span>Stops</span><strong>{selectedRoute.original.stops.length}</strong></div>
                    <div className="field-card"><span>Capacity</span><strong>{selectedRoute.optimized?.usedCapacity ?? 'Pending'}</strong></div>
                  </div>
                  {selectedRoute.optimized && (
                    <div className="field-grid" style={{ marginTop: 14 }}>
                      <div className="field-card"><span>Optimized Distance</span><strong>{selectedRoute.optimized.estimatedDistanceKm.toFixed(1)} km</strong></div>
                      <div className="field-card"><span>Optimized Duration</span><strong>{selectedRoute.optimized.estimatedDurationMin} min</strong></div>
                      <div className="field-card"><span>Improvement</span><strong>{selectedRoute.improvement}%</strong></div>
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

export default RouteOptimization;
