const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

function authHeaders(extra = {}) {
  const token = localStorage.getItem('swms_access_token') || localStorage.getItem('token');
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

export const analyticsService = {
  // Get KPI summary
  async getKpiSummary() {
    const response = await fetch(`${API_BASE}/analytics/kpi-summary`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch KPI summary');
    return response.json();
  },

  // Get performance metrics
  async getPerformanceMetrics(timeRange = '7d') {
    const response = await fetch(`${API_BASE}/analytics/performance?timeRange=${timeRange}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch performance metrics');
    return response.json();
  },

  // Get trend data
  async getTrendData(metric, period = '30d') {
    const response = await fetch(`${API_BASE}/analytics/trends?metric=${metric}&period=${period}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch trend data');
    return response.json();
  },

  // Get custom report
  async generateReport(params) {
    const response = await fetch(`${API_BASE}/analytics/report`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Failed to generate report');
    return response.json();
  }
};

export const routeOptimizationService = {
  // Get current routes
  async getRoutes() {
    const response = await fetch(`${API_BASE}/optimize/routes`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch routes');
    return response.json();
  },

  // Optimize route
  async optimizeRoute(vehicleId, stops) {
    const response = await fetch(`${API_BASE}/optimize/route-plan`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ vehicle_capacity: 100, stops })
    });
    if (!response.ok) throw new Error('Failed to optimize route');
    return response.json();
  },

  // Get route comparison
  async compareRoutes(originalRoute, optimizedRoute) {
    return {
      original: originalRoute,
      optimized: optimizedRoute,
      improvement: Math.round(((originalRoute.distance - optimizedRoute.distance) / originalRoute.distance) * 100)
    };
  }
};

export const forecastingService = {
  // Get bin forecast
  async getForecast(binId) {
    const response = await fetch(`${API_BASE}/forecast/bin/${binId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return response.json();
  },

  // Get all forecasts
  async getAllForecasts() {
    const response = await fetch(`${API_BASE}/forecast/all`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch forecasts');
    return response.json();
  },

  // Get trend prediction
  async getTrendPrediction(binId, days = 7) {
    const response = await fetch(`${API_BASE}/forecast/trend/${binId}?days=${days}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch trend prediction');
    return response.json();
  }
};

export const anomalyService = {
  // Get anomalies
  async getAnomalies() {
    const response = await fetch(`${API_BASE}/anomalies/list`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch anomalies');
    return response.json();
  },

  // Get anomaly details
  async getAnomalyDetails(anomalyId) {
    const response = await fetch(`${API_BASE}/anomalies/${anomalyId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch anomaly details');
    return response.json();
  },

  // Mark anomaly as reviewed
  async markReviewed(anomalyId, notes) {
    const response = await fetch(`${API_BASE}/anomalies/${anomalyId}/review`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ notes, reviewed_at: new Date() })
    });
    if (!response.ok) throw new Error('Failed to mark anomaly as reviewed');
    return response.json();
  }
};

export const slaService = {
  // Get SLA policies
  async getPolicies() {
    const response = await fetch(`${API_BASE}/sla/policies`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch SLA policies');
    return response.json();
  },

  // Get escalations
  async getEscalations() {
    const response = await fetch(`${API_BASE}/sla/escalations/pending`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch escalations');
    return response.json();
  },

  // Get SLA metrics
  async getMetrics(timeRange = '30d') {
    const response = await fetch(`${API_BASE}/sla/metrics?timeRange=${timeRange}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch SLA metrics');
    return response.json();
  }
};

export const iotService = {
  // Get all telemetry
  async getTelemetry() {
    const response = await fetch(`${API_BASE}/iot/telemetry`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch telemetry');
    return response.json();
  },

  // Get bin telemetry
  async getBinTelemetry(binId) {
    const response = await fetch(`${API_BASE}/iot/telemetry/bin/${binId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch bin telemetry');
    return response.json();
  },

  // Get sensor alerts
  async getSensorAlerts() {
    const response = await fetch(`${API_BASE}/iot/alerts`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch sensor alerts');
    return response.json();
  },

  // Subscribe to real-time updates
  subscribeToUpdates(callback) {
    const token = localStorage.getItem('swms_access_token') || localStorage.getItem('token');
    const url = token
      ? `${API_BASE}/iot/telemetry/stream?access_token=${encodeURIComponent(token)}`
      : `${API_BASE}/iot/telemetry/stream`;
    const eventSource = new EventSource(url);
    eventSource.onmessage = (event) => {
      callback(JSON.parse(event.data));
    };
    return eventSource;
  }
};

export const complaintService = {
  // Get all complaints
  async getComplaints(status = null) {
    const url = status 
      ? `${API_BASE}/complaints?status=${status}`
      : `${API_BASE}/complaints`;
    const response = await fetch(url, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch complaints');
    return response.json();
  },

  // Get complaint details
  async getComplaintDetails(complaintId) {
    const response = await fetch(`${API_BASE}/complaints/${complaintId}`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch complaint details');
    return response.json();
  },

  // Create complaint
  async createComplaint(data) {
    const response = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create complaint');
    return response.json();
  },

  // Update complaint status
  async updateComplaintStatus(complaintId, status, notes) {
    const response = await fetch(`${API_BASE}/complaints/${complaintId}`, {
      method: 'PUT',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ status, notes, updated_at: new Date() })
    });
    if (!response.ok) throw new Error('Failed to update complaint');
    return response.json();
  },

  // Add comment to complaint
  async addComment(complaintId, comment) {
    const response = await fetch(`${API_BASE}/complaints/${complaintId}/comment`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ comment, commented_at: new Date() })
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  }
};
