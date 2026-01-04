# Backend Integration Guide

This document explains how to connect the Whaletail map frontend to your existing multi-agent backend.

## Architecture Overview

```
┌─────────────────────┐         ┌──────────────────────┐
│                     │         │                      │
│  React Frontend     │  HTTP   │   FastAPI Backend    │
│  (Port 3000)        │◄───────►│   (Port 8000)        │
│                     │         │                      │
│  - InteractiveMap   │         │  - Planning Agent    │
│  - LayerControl     │         │  - Safety Agent      │
│  - ItineraryPanel   │         │  - Route Optimizer   │
│                     │         │                      │
└─────────────────────┘         └──────────────────────┘
         │                               │
         │                               │
         ▼                               ▼
  Mapbox GL JS                    LangGraph Workflow
  Heatmap Layers                  LangChain Tools
```

## Step 1: Backend API Endpoints

### Add These Routes to Your FastAPI Backend

```python
# In your existing api.py or create routes/map.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/v1", tags=["map"])

# Data Models
class Location(BaseModel):
    lng: float
    lat: float

class Destination(BaseModel):
    name: str
    location: Location
    time: str  # HH:MM format
    duration: int  # minutes
    type: str  # "must_visit" or "flexible"
    description: Optional[str] = ""

class ItineraryRequest(BaseModel):
    destinations: List[Destination]
    constraints: dict
    preferences: dict

# Routes
@router.post("/itinerary/generate")
async def generate_itinerary(request: ItineraryRequest):
    """
    Generate optimized itinerary using Planning Agent
    """
    try:
        # Call your existing workflow
        from core.workflow import app as workflow_app
        from core.state import GraphState
        
        initial_state = GraphState(
            user_request=f"Plan trip to {len(request.destinations)} destinations",
            destinations=[d.dict() for d in request.destinations],
            constraints=request.constraints,
            preferences=request.preferences
        )
        
        result = workflow_app.invoke(initial_state)
        
        # Transform to frontend format
        return {
            "id": f"itinerary-{hash(str(result))}",
            "name": result.get("itinerary_name", "Your Trip"),
            "destinations": result["itinerary"]["destinations"],
            "route": result["itinerary"]["route"],
            "metadata": result["itinerary"]["metadata"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/safety/evaluate")
async def evaluate_safety(route: dict):
    """
    Evaluate safety for a given route using Safety Agent
    """
    try:
        from core.tools import evaluate_route_safety
        
        safety_data = evaluate_route_safety(
            route_coordinates=route["coordinates"],
            time_of_day=route.get("time_of_day", "daytime")
        )
        
        return safety_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/route/optimize")
async def optimize_route(constraints: dict):
    """
    Optimize route based on constraints using Route Optimizer
    """
    try:
        from core.tools import optimize_itinerary
        
        optimized = optimize_itinerary(
            destinations=constraints["destinations"],
            constraints=constraints["constraints"]
        )
        
        return optimized
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/data/crime")
async def get_crime_data(
    north: float,
    south: float,
    east: float,
    west: float
):
    """
    Get crime data for map bounds
    """
    try:
        from core.tools import get_crime_statistics
        
        crime_data = get_crime_statistics(
            bounds={"north": north, "south": south, "east": east, "west": west}
        )
        
        return crime_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/data/heat")
async def get_heat_data(
    north: float,
    south: float,
    east: float,
    west: float
):
    """
    Get heat/temperature data for map bounds
    """
    try:
        from core.tools import get_heat_exposure_data
        
        heat_data = get_heat_exposure_data(
            bounds={"north": north, "south": south, "east": east, "west": west}
        )
        
        return heat_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Register router in main api.py
# app.include_router(router)
```

## Step 2: Update Tools.py

Add these new tool functions to your `core/tools.py`:

```python
def get_crime_statistics(bounds: dict) -> dict:
    """
    Fetch crime statistics for given geographic bounds
    
    TODO: Replace with real crime data API
    Currently returns simulated data
    """
    # For now, return from your simulated data
    # Later: Integrate with LA Crime Data API
    from data.crimeData import get_crime_for_bounds
    return get_crime_for_bounds(bounds)

def get_heat_exposure_data(bounds: dict) -> dict:
    """
    Fetch heat exposure data for given geographic bounds
    
    TODO: Replace with real weather/heat API
    Currently returns simulated data
    """
    # For now, return from your simulated data
    # Later: Integrate with NOAA or weather API
    from data.heatData import get_heat_for_bounds
    return get_heat_for_bounds(bounds)
```

## Step 3: Enable CORS

Update your main `api.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Vite dev server
        "http://localhost:5173",  # Alternative Vite port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 4: Frontend API Integration

### Update Frontend to Use Real API

In `src/components/InteractiveMap.jsx`:

```javascript
import { useEffect, useState } from 'react';
import { whaletailAPI } from '../services/api';

const InteractiveMap = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItinerary() {
      try {
        setLoading(true);
        
        // Call real backend API
        const result = await whaletailAPI.generateItinerary({
          destinations: [/* your destinations */],
          constraints: {/* your constraints */},
          preferences: {/* user preferences */}
        });
        
        setItinerary(result);
      } catch (error) {
        console.error('Failed to load itinerary:', error);
        // Fallback to mock data
        setItinerary(sampleItinerary);
      } finally {
        setLoading(false);
      }
    }

    loadItinerary();
  }, []);

  if (loading) {
    return <div>Loading trip...</div>;
  }

  // Rest of component...
}
```

### Load Dynamic Crime/Heat Data

```javascript
const [crimeData, setCrimeData] = useState([]);
const [heatData, setHeatData] = useState([]);

useEffect(() => {
  async function loadMapData() {
    const bounds = mapRef.current.getBounds();
    
    const [crime, heat] = await Promise.all([
      whaletailAPI.getCrimeData({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      }),
      whaletailAPI.getHeatData({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      })
    ]);

    setCrimeData(crime);
    setHeatData(heat);
  }

  if (mapRef.current) {
    loadMapData();
  }
}, [activeLayer]);
```

## Step 5: Testing Integration

### Test Backend Endpoints

```bash
# Start backend
cd /path/to/whaletail_journey_v1.0
python -m uvicorn api:app --reload

# Test endpoints
curl http://localhost:8000/health
curl -X POST http://localhost:8000/api/v1/itinerary/generate \
  -H "Content-Type: application/json" \
  -d '{
    "destinations": [...],
    "constraints": {},
    "preferences": {}
  }'
```

### Test Frontend Connection

```bash
# Start frontend
cd whaletail-map-frontend
npm run dev

# Open browser to http://localhost:3000
# Check browser console for API calls
# Verify Network tab shows requests to localhost:8000
```

## Step 6: Development Workflow

### Running Both Servers

Terminal 1 (Backend):
```bash
cd whaletail_journey_v1.0
python -m uvicorn api:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd whaletail-map-frontend
npm run dev
```

### Docker Compose (Optional)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  backend:
    build: ./whaletail_journey_v1.0
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - ./whaletail_journey_v1.0:/app

  frontend:
    build: ./whaletail-map-frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://backend:8000
      - VITE_MAPBOX_TOKEN=${MAPBOX_TOKEN}
    depends_on:
      - backend
```

## Step 7: Data Flow Example

### User Requests Itinerary

1. **Frontend**: User clicks "Plan Trip" button
2. **API Call**: POST to `/api/v1/itinerary/generate`
3. **Backend**: Planning Agent receives request
4. **Workflow**: LangGraph executes agent chain
5. **Tools**: Agents call safety evaluation and route optimization
6. **Response**: Optimized itinerary returned to frontend
7. **Render**: Map displays route with markers and heatmap

### User Switches to Crime Layer

1. **Frontend**: User clicks "Crime Safety" button
2. **Get Bounds**: Extract current map viewport coordinates
3. **API Call**: GET `/api/v1/data/crime?north=X&south=Y...`
4. **Backend**: tools.py fetches crime data for bounds
5. **Response**: GeoJSON feature collection returned
6. **Render**: Heatmap layer updated with crime data

## Troubleshooting

### CORS Errors
- Verify CORS middleware is configured
- Check frontend is calling correct backend URL
- Ensure credentials are set correctly

### 404 Errors
- Verify router is registered in main app
- Check endpoint paths match frontend calls
- Test endpoints with curl first

### Slow Responses
- Implement caching for crime/heat data
- Use background tasks for long-running operations
- Consider pagination for large datasets

### Type Mismatches
- Ensure Pydantic models match frontend data structure
- Use TypeScript in frontend for better type safety
- Add validation in both frontend and backend

## Next Steps

1. Replace simulated data with real APIs
2. Add authentication/authorization
3. Implement WebSocket for real-time updates
4. Add error handling and retry logic
5. Set up monitoring and logging

---

For questions about integration, refer to the main README or backend documentation.
