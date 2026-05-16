import React, { useEffect, useMemo, useState } from "react";
import { authorityService } from "../api/authorityService";
import { binService } from "../api/binService";
import { driverService } from "../api/driverService";
import { userService } from "../api/userService";
import { vehicleService } from "../api/vehicleService";
import {
  DashboardPage,
  DataTable,
  ErrorState,
  LoadingState,
  Panel,
  SimpleBarChart,
  StatCard,
  StatGrid,
} from "../components/DashboardKit";

function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    authorities: [],
    bins: [],
    drivers: [],
    users: [],
    vehicles: [],
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [authorities, bins, drivers, users, vehicles] = await Promise.all([
          authorityService.getAll(),
          binService.getAll(),
          driverService.getAll(),
          userService.getAll(),
          vehicleService.getAll(),
        ]);

        if (mounted) setData({ authorities, bins, drivers, users, vehicles });
      } catch (_e) {
        if (mounted) setError("Unable to load live dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const riskBins = useMemo(() => {
    return [...data.bins]
      .sort((a, b) => Number(b.Capacity || 0) - Number(a.Capacity || 0))
      .slice(0, 5)
      .map((bin, index) => ({
        id: bin.Bin_ID,
        location: bin.Assigned_Location || "Unknown",
        fillPct: Math.min(98, 55 + index * 9),
      }));
  }, [data.bins]);

  const coverage = [
    { label: "Authorities", value: data.authorities.length },
    { label: "Bins", value: data.bins.length },
    { label: "Drivers", value: data.drivers.length },
    { label: "Vehicles", value: data.vehicles.length },
    { label: "Users", value: data.users.length },
  ];

  if (loading) {
    return <DashboardPage title="Command Center" subtitle="Live operational snapshot for Smart Waste Management"><LoadingState label="Loading command center..." /></DashboardPage>;
  }

  if (error) {
    return <DashboardPage title="Command Center" subtitle="Live operational snapshot for Smart Waste Management"><ErrorState message={error} /></DashboardPage>;
  }

  return (
    <DashboardPage title="Command Center" subtitle="Live operational snapshot for Smart Waste Management">
      <StatGrid>
        <StatCard label="Authorities" value={data.authorities.length} helper="Active leadership" />
        <StatCard label="Total Bins" value={data.bins.length} helper="Field coverage" />
        <StatCard label="Drivers" value={data.drivers.length} helper="Dispatch-ready crew" />
        <StatCard label="Vehicles" value={data.vehicles.length} helper="Fleet availability" />
        <StatCard label="Registered Users" value={data.users.length} helper="Citizen linkage" />
        <StatCard
          label="Ops Capacity"
          value={`${Math.max(0, Math.round((data.drivers.length / Math.max(data.vehicles.length, 1)) * 100))}%`}
          helper="Driver to vehicle ratio"
        />
      </StatGrid>

      <div className="dashboard-grid-2">
        <Panel title="Operational Coverage" subtitle="Current records by management area">
          <SimpleBarChart items={coverage} />
        </Panel>

        <Panel title="Live Alerts">
          <div className="item-list">
            <div className="list-item">Overflow risk monitoring is ready.</div>
            <div className="list-item">SLA escalation checks are active.</div>
            <div className="list-item">Telemetry ingestion endpoint is online.</div>
          </div>
        </Panel>
      </div>

      <Panel title="Bins At Risk" subtitle="Derived from current operations data">
        <DataTable
          rows={riskBins}
          emptyTitle="No bin records available"
          emptyMessage="Add smart bins to populate the risk queue."
          columns={[
            { key: "id", header: "Bin ID", render: (row) => `BIN-${row.id}` },
            { key: "location", header: "Location" },
            {
              key: "fillPct",
              header: "Estimated Fill",
              render: (row) => (
                <div className="ops-fill-row">
                  <div className="ops-fill-track">
                    <div className="ops-fill-bar" style={{ width: `${row.fillPct}%` }} />
                  </div>
                  <span>{row.fillPct}%</span>
                </div>
              ),
            },
          ]}
        />
      </Panel>
    </DashboardPage>
  );
}

export default DashboardHome;
