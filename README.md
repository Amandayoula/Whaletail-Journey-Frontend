# Whaletail Map Frontend

An interactive, safety-aware travel planning map built with React and Mapbox GL. This application visualizes crime safety data and heat exposure information for Los Angeles, allowing users to plan optimized travel routes with real-time layer switching.

<!-- ![Whaletail Map](docs/screenshot.png) -->

## 🌟 Features

- **Interactive Map Layers**
  - Base map view
  - Crime safety heatmap
  - Heat exposure/temperature heatmap
  - Real-time layer switching

- **Travel Itinerary Visualization**
  - Route planning with optimized paths
  - Destination markers with detailed information
  - Safety and heat scores for each location
  - Interactive popup cards

- **Data-Driven Insights**
  - GIS crime data integration
  - Temperature and urban heat island visualization
  - Safety-aware routing algorithms
  - Constraint-based optimization

## 🏗️ Architecture

### Tech Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Mapping**: Mapbox GL JS + react-map-gl
- **HTTP Client**: Axios
- **Geospatial**: Turf.js
- **Date Handling**: date-fns

### Project Structure
```
whaletail-map-frontend/
├── src/
│   ├── components/          # React components
│   │   ├── InteractiveMap.jsx    # Main map component
│   │   ├── LayerControl.jsx      # Layer switching UI
│   │   ├── MapLegend.jsx         # Color scale legend
│   │   └── ItineraryPanel.jsx    # Trip details panel
│   ├── data/                # Mock data
│   │   ├── crimeData.js          # LA crime statistics
│   │   ├── heatData.js           # Temperature data
│   │   └── sampleItinerary.js    # Example routes
│   ├── services/            # API integration
│   │   └── api.js                # Backend communication
│   ├── utils/               # Utility functions
│   │   └── mapUtils.js           # Map helpers
│   ├── hooks/               # Custom React hooks (future)
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Mapbox account and access token ([Get one here](https://account.mapbox.com/))
- Whaletail backend API running (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whaletail-map-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Mapbox token:
   ```
   VITE_MAPBOX_TOKEN=pk.xxx.xxx
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## 🎯 Usage

### Layer Controls
Click the layer buttons in the top-left to switch between:
- **Base Map**: Standard street view
- **Crime Safety**: Heatmap showing crime risk levels
- **Heat Exposure**: Temperature and heat index visualization

### Itinerary Panel
- View trip details in the right panel
- Click destinations to fly to location
- See safety and heat scores for each stop
- Expand/collapse panel with arrow button

### Map Interaction
- Click markers to view detailed information
- Zoom and pan to explore different areas
- Popups show location details, times, and scores

## 🔌 Backend Integration

### API Endpoints
The frontend expects these endpoints from the Whaletail backend:

```javascript
// Generate itinerary
POST /api/v1/itinerary/generate
Body: { destinations, constraints, preferences }

// Evaluate safety
POST /api/v1/safety/evaluate
Body: { route, time_of_day }

// Optimize route
POST /api/v1/route/optimize
Body: { waypoints, constraints }

// Get crime data
GET /api/v1/data/crime?north=X&south=Y&east=Z&west=W

// Get heat data
GET /api/v1/data/heat?north=X&south=Y&east=Z&west=W
```

### Mock Data Mode
Currently uses simulated Los Angeles data. To switch to real API:

1. Ensure backend is running on `http://localhost:8000`
2. Update components to call `whaletailAPI` methods:
   ```javascript
   import { whaletailAPI } from '../services/api';
   
   const itinerary = await whaletailAPI.generateItinerary(request);
   ```

## 📊 Data Sources

### Current (Simulated)
- **Crime Data**: 20 locations across LA with realistic crime scores
- **Heat Data**: Urban heat island patterns for LA basin
- **Itinerary**: Sample 4-destination route with safety optimization

### Future Integration
- Real-time crime statistics from LAPD Open Data
- NOAA temperature and heat index data
- Google Maps API for routing
- User-uploaded preferences and constraints

## 🎨 Customization

### Adding New Layers
Create a new heatmap layer in `InteractiveMap.jsx`:

```javascript
const myCustomLayer = {
  id: 'my-layer',
  type: 'heatmap',
  paint: {
    'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
    'heatmap-color': [/* your color ramp */],
    'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20]
  }
};
```

---

**Built with ❤️ for safer, smarter travel planning**
