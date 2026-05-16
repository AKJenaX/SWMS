import React, { useMemo, useState } from "react";

const previewScreens = [
  { label: "Operations Dashboard", path: "/stitch-export/operations_dashboard_2/code.html" },
  { label: "Incident Command Center", path: "/stitch-export/incident_command_center_2/code.html" },
  { label: "SLA Escalation Monitoring", path: "/stitch-export/sla_escalation_monitoring_terra/code.html" },
  { label: "IoT Telemetry Monitoring", path: "/stitch-export/iot_telemetry_monitoring_2/code.html" },
  { label: "Route Optimization Planner", path: "/stitch-export/route_optimization_planner_terra/code.html" },
  { label: "Forecasting & Anomalies", path: "/stitch-export/forecasting_anomalies_terra/code.html" },
  { label: "Citizen Complaints Workflow", path: "/stitch-export/citizen_complaints_workflow_terra/code.html" },
  { label: "Supervisor AI Copilot", path: "/stitch-export/supervisor_ai_copilot_2/code.html" },
];

function StitchPreview() {
  const [activePath, setActivePath] = useState(previewScreens[0].path);

  const activeScreen = useMemo(
    () => previewScreens.find((screen) => screen.path === activePath) || previewScreens[0],
    [activePath]
  );

  return (
    <div className="stitch-workspace">
      <div className="page-header">
        <div className="page-header-icon">🎨</div>
        <h1 className="page-title">Stitch UI Integrated Workspace</h1>
        <p className="page-subtitle">
          All generated Stitch screens are integrated below inside the app shell.
        </p>
      </div>

      <div className="stitch-layout">
        <aside className="stitch-menu">
          {previewScreens.map((screen) => (
            <button
              key={screen.path}
              type="button"
              className={`stitch-menu-item ${activePath === screen.path ? "active" : ""}`}
              onClick={() => setActivePath(screen.path)}
            >
              {screen.label}
            </button>
          ))}
        </aside>

        <section className="stitch-frame-panel">
          <div className="stitch-frame-header">
            <h3>{activeScreen.label}</h3>
            <a href={activeScreen.path} target="_blank" rel="noreferrer">
              Open in New Tab
            </a>
          </div>
          <iframe
            title={activeScreen.label}
            src={activeScreen.path}
            className="stitch-frame"
            loading="lazy"
          />
        </section>
      </div>
    </div>
  );
}

export default StitchPreview;
