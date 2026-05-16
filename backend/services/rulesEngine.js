import { eventBus } from '../events/eventBus.js';
import { executeQuery } from '../db.js';

function severityFromEvent(event) {
  if (event.smoke_detected || event.fill_pct >= 95) return 'critical';
  if (event.fill_pct >= 85 || event.tilt_detected) return 'high';
  if (event.fill_pct >= 70) return 'medium';
  return 'low';
}

export function registerRulesEngine() {
  eventBus.on('telemetry.ingested', async (event) => {
    try {
      const severity = severityFromEvent(event);
      if (severity === 'low') return;

      const [incidentResult] = await executeQuery(
        `INSERT INTO incidents (incident_type, severity, status, bin_id, description)
         VALUES (?, ?, 'open', ?, ?)`,
        [
          event.smoke_detected ? 'hazard_alert' : 'overflow_risk',
          severity,
          event.bin_id || null,
          `Generated from telemetry event ${event.telemetryId}`
        ]
      );

      await executeQuery(
        `INSERT INTO alerts (alert_type, severity, incident_id, status, details_json)
         VALUES (?, ?, ?, 'open', ?)`,
        [
          event.smoke_detected ? 'fire_smoke' : 'bin_risk',
          severity,
          incidentResult.insertId,
          JSON.stringify(event)
        ]
      );
    } catch (_error) {
      // Non-blocking background rule processing.
    }
  });
}
