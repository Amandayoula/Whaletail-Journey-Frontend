"""
Simple test server for Whaletail Map Frontend
Use this to test frontend without running the full backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import random

app = FastAPI(title="Whaletail Map Test Server")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class Location(BaseModel):
    lng: float
    lat: float

class Destination(BaseModel):
    name: str
    location: Location
    time: str
    duration: int
    type: str
    description: Optional[str] = ""

class ItineraryRequest(BaseModel):
    destinations: List[Destination]
    constraints: Dict[str, Any]
    preferences: Dict[str, Any]

# Sample destinations for LA
LA_ATTRACTIONS = [
    {"name": "Griffith Observatory", "lng": -118.3004, "lat": 34.1184},
    {"name": "Santa Monica Pier", "lng": -118.4967, "lat": 34.0095},
    {"name": "Getty Center", "lng": -118.4745, "lat": 34.0780},
    {"name": "Hollywood Sign", "lng": -118.3215, "lat": 34.1341},
    {"name": "Venice Beach", "lng": -118.4695, "lat": 33.9850},
]

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "whaletail-test-server"}

@app.post("/api/v1/itinerary/generate")
async def generate_itinerary(request: ItineraryRequest):
    """Generate a sample itinerary"""
    
    destinations_with_scores = []
    for i, dest in enumerate(request.destinations):
        destinations_with_scores.append({
            "id": f"dest-{i+1}",
            "name": dest.name,
            "location": dest.location.dict(),
            "time": dest.time,
            "duration": dest.duration,
            "type": dest.type,
            "description": dest.description,
            "safetyScore": round(random.uniform(6.0, 9.5), 1),
            "heatScore": round(random.uniform(3.0, 7.5), 1)
        })
    
    # Create route line
    coordinates = [
        [d["location"]["lng"], d["location"]["lat"]] 
        for d in destinations_with_scores
    ]
    
    return {
        "id": f"itinerary-{random.randint(1000, 9999)}",
        "name": "LA Highlights - Safe Route",
        "date": "2026-01-15",
        "destinations": destinations_with_scores,
        "route": {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coordinates
            },
            "properties": {
                "totalDistance": round(random.uniform(30, 60), 1),
                "estimatedTime": random.randint(60, 120),
                "safetyRating": "high"
            }
        },
        "metadata": {
            "totalDuration": sum(d["duration"] for d in destinations_with_scores),
            "overallSafetyScore": round(random.uniform(8.0, 9.5), 1),
            "averageHeatExposure": round(random.uniform(4.0, 6.0), 1),
            "optimizedFor": ["safety", "scenic_routes"]
        }
    }

@app.post("/api/v1/safety/evaluate")
async def evaluate_safety(route: Dict[str, Any]):
    """Evaluate safety for a route"""
    return {
        "overallSafetyScore": round(random.uniform(7.0, 9.5), 1),
        "riskZones": [
            {
                "location": {"lng": -118.2437, "lat": 34.0522},
                "riskLevel": "moderate",
                "timeOfDay": "night"
            }
        ],
        "recommendations": [
            "Avoid downtown area after 9 PM",
            "Use main roads when possible"
        ]
    }

@app.post("/api/v1/route/optimize")
async def optimize_route(constraints: Dict[str, Any]):
    """Optimize route based on constraints"""
    return {
        "optimizedRoute": {
            "coordinates": [[random.uniform(-118.5, -118.1), random.uniform(33.9, 34.2)] for _ in range(5)],
            "totalDistance": round(random.uniform(30, 60), 1),
            "estimatedTime": random.randint(60, 120)
        },
        "safetyImprovement": round(random.uniform(10, 30), 1),
        "efficiencyScore": round(random.uniform(7.5, 9.5), 1)
    }

@app.get("/api/v1/data/crime")
async def get_crime_data(north: float, south: float, east: float, west: float):
    """Get crime data for bounds"""
    
    features = []
    # Generate 20-30 random crime points within bounds
    for _ in range(random.randint(20, 30)):
        lng = random.uniform(west, east)
        lat = random.uniform(south, north)
        
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                "crimeScore": round(random.uniform(1.0, 10.0), 1),
                "crimeCount": random.randint(10, 300),
                "area": f"Zone-{random.randint(1, 20)}"
            }
        })
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

@app.get("/api/v1/data/heat")
async def get_heat_data(north: float, south: float, east: float, west: float):
    """Get heat data for bounds"""
    
    features = []
    # Generate 20-30 random temperature points within bounds
    for _ in range(random.randint(20, 30)):
        lng = random.uniform(west, east)
        lat = random.uniform(south, north)
        
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                "temperature": random.randint(75, 100),
                "heatIndex": round(random.uniform(1.0, 10.0), 1),
                "area": f"Zone-{random.randint(1, 20)}"
            }
        })
    
    return {
        "type": "FeatureCollection",
        "features": features
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Whaletail Test Server...")
    print("📍 Server running at: http://localhost:8000")
    print("📚 API docs at: http://localhost:8000/docs")
    print("\n💡 This is a test server with random data")
    print("🔗 Connect your frontend to http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
