# 🚀 EcoFlow 3D - Quick Setup & Navigation Guide

## 🎯 Quick Start (5 minutes)

### 1. **Install & Run**
```bash
# Frontend
cd frontend
npm install
npm start

# Backend (in another terminal)
cd backend
npm install
npm start
```

### 2. **Access the Application**
- Open `http://localhost:3000` in your browser
- You'll see the new EcoFlow 3D interface with the reorganized sidebar

### 3. **Test the New Dashboards**
Click on these items in the left sidebar:

| Icon | Name | Purpose |
|------|------|---------|
| 📊 | **Analytics** | View KPIs, performance metrics, charts |
| 🛣️ | **Routes** | Optimize and plan collection routes |
| 🔮 | **Forecasting** | Predict bin fill levels (6h, 12h, 24h) |
| 🔍 | **Anomalies** | Detect and review system anomalies |
| ⏱️ | **SLA Monitor** | Track service level agreements |
| 📡 | **IoT Telemetry** | Monitor live sensor data in real-time |
| 💬 | **Complaints** | Manage citizen complaints workflow |

---

## 📊 Dashboard Overview

### 📊 **Analytics Dashboard** (`/analytics`)
```
✓ KPI Summary (4 cards)
✓ Time range selector (7d, 30d, 90d)
✓ Performance metrics table
✓ Collection efficiency chart
✓ Incident trend chart
```

### 🛣️ **Route Optimization** (`/routes`)
```
✓ Active routes list
✓ Route comparison (original vs optimized)
✓ Efficiency improvement %
✓ Distance & time estimates
✓ Capacity utilization gauge
✓ One-click apply optimization
```

### 🔮 **Forecasting Dashboard** (`/forecasting`)
```
✓ Risk overview (critical, warning, safe)
✓ Bin forecast table (6h, 12h, 24h predictions)
✓ Fill level timeline
✓ Time-to-full calculations
✓ Schedule collection button
✓ Average growth rate metric
```

### 🔍 **Anomaly Detection** (`/anomalies`)
```
✓ Anomaly list (color-coded by severity)
✓ Detailed analysis panel
✓ Metrics visualization
✓ Review workflow
✓ Notes/comments section
✓ Mark as reviewed checkbox
```

### ⏱️ **SLA Monitoring** (`/sla-monitoring`)
```
✓ Overall compliance % KPI
✓ Active incidents count
✓ Breached today counter
✓ At-risk incidents (1h)
✓ Escalations table (auto-colored by age)
✓ SLA policies grid
✓ Target & escalation minutes
```

### 📡 **IoT Telemetry** (`/iot-telemetry`)
```
✓ Real-time sensor overview (active, warnings, critical)
✓ Active alerts feed (auto-dismiss option)
✓ Live sensor grid (3 columns)
✓ Fill level gauge per bin
✓ Battery % with color coding
✓ Smoke & tilt detection
✓ Last update timestamp
✓ GPS location (detailed view)
✓ Auto-refreshes every 5 seconds
```

### 💬 **Complaints Management** (`/complaints`)
```
✓ Complaint list with count
✓ Status filters (all, open, in_review, resolved)
✓ Complaint detail panel
✓ Priority indicators
✓ Status change workflow
✓ Comments/thread system
✓ Submitter info & date
✓ Add comment feature
```

---

## 🎨 Design Features

### Color System
- **Primary**: Teal (#11998e) → Green (#38ef7d)
- **Accent**: Neon Green (#00ff88)
- **Success**: Green (#38ef7d)
- **Warning**: Yellow (#ffd93d)
- **Error**: Red (#ff4444)
- **Critical**: Bright Red (#ff2244)

### Interactive Elements
- ✨ Glass morphism cards with backdrop blur
- 🔷 Smooth hover transitions
- 🌟 Glow effects on active states
- 💫 Animated status indicators
- 📐 Responsive grid layouts
- ♿ Accessible keyboard navigation

### Micro-Interactions
- Button lift on hover
- Loading spinners
- Status animations (pulse, glow)
- Page transitions
- Smooth scrolling

---

## 🔌 API Endpoints Required

Each dashboard needs backend endpoints:

### Analytics (`/analytics/`)
- `GET /kpi-summary`
- `GET /performance?timeRange=7d`
- `GET /trends?metric=collections&period=30d`

### Routes (`/optimize/`)
- `GET /routes`
- `POST /route-plan` (with vehicle_capacity, stops)

### Forecasting (`/forecast/`)
- `GET /bin/:binId`
- `GET /all`
- `GET /trend/:binId?days=7`

### Anomalies (`/anomalies/`)
- `GET /list`
- `GET /:anomalyId`
- `PUT /:anomalyId/review` (with notes)

### SLA (`/sla/`)
- `GET /policies`
- `GET /escalations/pending`
- `GET /metrics?timeRange=30d`

### IoT (`/iot/`)
- `GET /telemetry`
- `GET /alerts`
- `SSE /telemetry/stream` (real-time updates)

### Complaints (`/complaints/`)
- `GET /` (with optional ?status filter)
- `GET /:id`
- `POST /` (create)
- `PUT /:id` (update status)
- `POST /:id/comment` (add comment)

---

## 📱 Navigation Structure

### Sidebar Organization

```
EcoFlow 3D
├── CORE OPERATIONS
│   ├── 🏠 Hub
│   ├── ⚡ Command Center
│   ├── 📍 Live Map
│   ├── 🚨 Incidents
│   ├── 🛣️ Routes
│   └── 📊 Analytics
├── RESOURCE MANAGEMENT
│   ├── 🏛️ Authority
│   ├── 👨‍✈️ Driver
│   ├── 🚛 Vehicle
│   ├── 🗑️ Smart Bin
│   └── 👥 User
├── INTELLIGENCE & MONITORING
│   ├── 🔮 Forecasting
│   ├── 🔍 Anomalies
│   ├── ⏱️ SLA Monitor
│   └── 📡 IoT Telemetry
└── SUPPORT & SETTINGS
    ├── 💬 Complaints
    └── 🎨 Stitch UI
```

---

## 💻 File Structure

```
frontend/src/
├── pages/
│   ├── Analytics.jsx              ← NEW
│   ├── RouteOptimization.jsx      ← NEW
│   ├── Forecasting.jsx            ← NEW
│   ├── AnomalyDetection.jsx       ← NEW
│   ├── SLAMonitoring.jsx          ← NEW
│   ├── IoTTelemetry.jsx           ← NEW
│   ├── ComplaintsManagement.jsx   ← NEW
│   └── [other pages]
├── api/
│   ├── dashboardServices.js       ← NEW (all API calls)
│   └── [other services]
├── components/
│   ├── Navbar.jsx                 ← UPDATED (EcoFlow 3D sidebar)
│   └── [other components]
├── styles/
│   ├── ecoflow-3d-theme.css      ← NEW (design system)
│   └── [other styles]
├── App.jsx                        ← UPDATED (new routes)
└── index.css                      ← UPDATED (imports theme)
```

---

## 🧪 Testing Checklist

- [ ] **Sidebar Navigation**: All links working
- [ ] **Analytics**: Data loads and displays
- [ ] **Routes**: Can select and optimize routes
- [ ] **Forecasting**: Shows bin predictions
- [ ] **Anomalies**: Displays detected issues
- [ ] **SLA**: Shows escalations and policies
- [ ] **IoT**: Real-time data updates
- [ ] **Complaints**: Can filter and manage complaints
- [ ] **Responsive**: Works on different screen sizes
- [ ] **Theme**: All colors display correctly

---

## 🐛 Common Issues & Solutions

### Issue: Dashboards show "Loading..."
**Solution**: 
- Check backend is running (`npm start` in backend folder)
- Check API endpoints exist on backend
- Look at browser console for 404 errors

### Issue: Sidebar not styled
**Solution**:
- Verify `ecoflow-3d-theme.css` is imported in `index.css`
- Clear browser cache (Ctrl+Shift+Delete)
- Restart development server

### Issue: Data not appearing
**Solution**:
- Check backend API endpoints are returning data
- Verify authentication token exists in localStorage
- Check network tab in browser DevTools

### Issue: Colors not displaying correctly
**Solution**:
- Ensure CSS variables are loaded
- Check for CSS conflicts in inspector
- Verify theme file is in `src/styles/` folder

---

## 🎓 Key Concepts

### Service Architecture
All dashboards use a **unified service layer** (`api/dashboardServices.js`):
```javascript
import { analyticsService } from '../api/dashboardServices';

// Usage
const data = await analyticsService.getKpiSummary();
```

### Component Pattern
All dashboards follow the same pattern:
```jsx
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  setLoading(true);
  try {
    const result = await serviceFunction();
    setData(result);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Styling Pattern
All components use CSS classes from theme:
```jsx
<div className="card">
  <div className="card-header">
    <h2 className="card-title">Title</h2>
  </div>
  <div className="card-body">Content</div>
</div>
```

---

## 📚 Documentation Files

- **Main**: `ECOFLOW_3D_IMPLEMENTATION.md` - Full implementation guide
- **Design**: `STITCH_3D_UI_UX_PROMPT.md` - Design specifications
- **Setup**: `SETUP.md` - Backend setup
- **Theme**: `UI_MODERNIZATION_SUMMARY.md` - Previous version

---

## 🚀 Next Steps

1. ✅ **Test all dashboards** - Ensure API connectivity
2. ✅ **Customize colors** - Edit CSS variables if needed
3. ✅ **Add more data** - Populate backend with test data
4. ✅ **Deploy frontend** - Use `npm run build`
5. ✅ **Monitor in production** - Check error logs

---

## 💡 Tips & Tricks

- **Keyboard Shortcut**: Tab through sidebar items (keyboard accessible)
- **Responsive**: Works on mobile (hamburger menu coming soon)
- **Real-time**: IoT dashboard auto-refreshes every 5 seconds
- **Filtering**: Use filter buttons on dashboards to narrow results
- **Export**: Most tables support CSV export (coming soon)

---

## 📞 Need Help?

Check these resources:
1. `ECOFLOW_3D_IMPLEMENTATION.md` - Full documentation
2. Dashboard source files - Study implementation patterns
3. Backend API docs - Verify endpoint contracts
4. Browser DevTools - Check for JavaScript errors

---

**Status**: ✅ Ready to Use  
**Last Updated**: May 16, 2026  
**Version**: 1.0.0

Happy monitoring! 🌍♻️📊
