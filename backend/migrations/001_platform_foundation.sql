CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(64) NOT NULL UNIQUE,
  description VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  permission_name VARCHAR(128) NOT NULL UNIQUE,
  description VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  actor_id VARCHAR(64) NULL,
  actor_role VARCHAR(64) NULL,
  action VARCHAR(64) NOT NULL,
  entity_name VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NULL,
  request_id VARCHAR(64) NULL,
  ip_address VARCHAR(64) NULL,
  metadata_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemetry_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  bin_id INT NULL,
  fill_pct DECIMAL(5,2) NULL,
  smoke_detected BOOLEAN DEFAULT FALSE,
  tilt_detected BOOLEAN DEFAULT FALSE,
  battery_pct DECIMAL(5,2) NULL,
  gps_lat DECIMAL(10,7) NULL,
  gps_lng DECIMAL(10,7) NULL,
  source_device VARCHAR(100) NULL,
  device_ts DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sla_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  zone_name VARCHAR(100) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  target_minutes INT NOT NULL,
  escalation_minutes INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS incidents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  incident_type VARCHAR(64) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  bin_id INT NULL,
  description TEXT NULL,
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incident_assignments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  incident_id BIGINT NOT NULL,
  driver_id INT NULL,
  vehicle_id INT NULL,
  authority_id INT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  alert_type VARCHAR(64) NOT NULL,
  severity VARCHAR(30) NOT NULL,
  incident_id BIGINT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  details_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  citizen_name VARCHAR(120) NULL,
  phone VARCHAR(20) NULL,
  message TEXT NOT NULL,
  gps_lat DECIMAL(10,7) NULL,
  gps_lng DECIMAL(10,7) NULL,
  eta_minutes INT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',
  closure_proof TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaint_comments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  complaint_id BIGINT NOT NULL,
  author VARCHAR(120) NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anomaly_reviews (
  anomaly_id VARCHAR(120) PRIMARY KEY,
  review_notes TEXT NULL,
  reviewed_by VARCHAR(120) NULL,
  reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  period_date DATE NOT NULL,
  zone_name VARCHAR(100) NULL,
  overflow_reduction_pct DECIMAL(6,2) NULL,
  sla_adherence_pct DECIMAL(6,2) NULL,
  fuel_cost_per_ton DECIMAL(10,2) NULL,
  avg_complaint_response_minutes DECIMAL(10,2) NULL,
  fleet_utilization_pct DECIMAL(6,2) NULL,
  missed_pickup_recurrence_pct DECIMAL(6,2) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
