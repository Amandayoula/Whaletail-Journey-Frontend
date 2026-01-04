import React, { useRef, useEffect, useState, useCallback } from 'react';
import Map, { Source, Layer, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { generateCrimeHeatmapData } from '../data/crimeData';
import { generateHeatHeatmapData } from '../data/heatData';
import { generatePopupHTML, fitMapToCoordinates } from '../utils/mapUtils';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

const LA_CENTER = {
  longitude: -118.2437,
  latitude: 34.0522,
  zoom: 10
};

/**
 * InteractiveMap - Main map with layers and itinerary
 */
const InteractiveMap = ({ itinerary = null, activeLayer = 'none', onLayerChange }) => {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState(LA_CENTER);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Heatmap data
  const crimeHeatmap = generateCrimeHeatmapData();
  const heatHeatmap = generateHeatHeatmapData();

  // Extract destinations from itinerary
  const destinations = itinerary?.itinerary?.map(item => ({
    ...item.attraction,
    start_time: item.start_time,
    end_time: item.end_time
  })) || [];

  // Create route line
  const routeGeoJSON = destinations.length > 0 ? {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: destinations.map(d => [d.location.lng, d.location.lat])
    }
  } : null;

  // Crime heatmap layer
  const crimeHeatmapLayer = {
    id: 'crime-heatmap',
    type: 'heatmap',
    paint: {
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(16, 185, 129, 0)',
        0.2, 'rgba(16, 185, 129, 0.4)',
        0.4, 'rgba(251, 191, 36, 0.6)',
        0.6, 'rgba(239, 68, 68, 0.7)',
        0.8, 'rgba(127, 29, 29, 0.8)',
        1, 'rgba(127, 29, 29, 0.9)'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 13, 0.5]
    }
  };

  // Heat exposure heatmap layer
  const heatExposureLayer = {
    id: 'heat-heatmap',
    type: 'heatmap',
    paint: {
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(96, 165, 250, 0)',
        0.2, 'rgba(96, 165, 250, 0.4)',
        0.4, 'rgba(251, 191, 36, 0.6)',
        0.6, 'rgba(249, 115, 22, 0.7)',
        0.8, 'rgba(220, 38, 38, 0.8)',
        1, 'rgba(220, 38, 38, 0.9)'
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 13, 0.5]
    }
  };

  // Route layer
  const routeLayer = {
    id: 'route',
    type: 'line',
    paint: {
      'line-color': '#0891b2',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };

  // Fit map to destinations - only when destinations change, not on every render
  useEffect(() => {
    if (mapRef.current && destinations.length > 0) {
      const coordinates = destinations.map(d => [d.location.lng, d.location.lat]);
      setTimeout(() => {
        fitMapToCoordinates(mapRef.current, coordinates, 80);
      }, 500);
    }
  }, [destinations.length]); // Only re-run when number of destinations changes

  const handleMarkerClick = useCallback((destination) => {
    setSelectedDestination(destination);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Crime heatmap layer */}
        {activeLayer === 'crime' && (
          <Source
            id="crime-data"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: crimeHeatmap.map(([lng, lat, weight]) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lng, lat] },
                properties: { weight }
              }))
            }}
          >
            <Layer {...crimeHeatmapLayer} />
          </Source>
        )}

        {/* Heat exposure heatmap layer */}
        {activeLayer === 'heat' && (
          <Source
            id="heat-data"
            type="geojson"
            data={{
              type: 'FeatureCollection',
              features: heatHeatmap.map(([lng, lat, weight]) => ({
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [lng, lat] },
                properties: { weight }
              }))
            }}
          >
            <Layer {...heatExposureLayer} />
          </Source>
        )}

        {/* Route line */}
        {routeGeoJSON && (
          <Source id="route" type="geojson" data={routeGeoJSON}>
            <Layer {...routeLayer} />
          </Source>
        )}

        {/* Destination markers */}
        {destinations.map((dest, index) => (
          <Marker
            key={dest.id}
            longitude={dest.location.lng}
            latitude={dest.location.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(dest);
            }}
          >
            <div style={styles.marker}>
              <div style={styles.markerNumber}>{index + 1}</div>
            </div>
          </Marker>
        ))}

        {/* Popup */}
        {selectedDestination && (
          <Popup
            longitude={selectedDestination.location.lng}
            latitude={selectedDestination.location.lat}
            anchor="bottom"
            onClose={() => setSelectedDestination(null)}
            closeOnClick={false}
          >
            <div dangerouslySetInnerHTML={{ 
              __html: generatePopupHTML(selectedDestination) 
            }} />
          </Popup>
        )}
      </Map>

      {/* Layer Controls */}
      <div style={styles.layerControls}>
        <button
          style={{
            ...styles.layerBtn,
            ...(activeLayer === 'none' ? styles.layerBtnActive : {})
          }}
          onClick={() => onLayerChange && onLayerChange('none')}
        >
          🗺️ Base Map
        </button>
        <button
          style={{
            ...styles.layerBtn,
            ...(activeLayer === 'crime' ? styles.layerBtnActive : {})
          }}
          onClick={() => onLayerChange && onLayerChange('crime')}
        >
          🚨 Crime Safety
        </button>
        <button
          style={{
            ...styles.layerBtn,
            ...(activeLayer === 'heat' ? styles.layerBtnActive : {})
          }}
          onClick={() => onLayerChange && onLayerChange('heat')}
        >
          🌡️ Heat Exposure
        </button>
      </div>

      {/* Legend */}
      {activeLayer !== 'none' && (
        <div style={styles.legend}>
          <div style={styles.legendTitle}>
            {activeLayer === 'crime' ? 'Crime Safety' : 'Heat Exposure'}
          </div>
          <div style={styles.legendGradient}>
            <div style={{
              ...styles.gradientBar,
              background: activeLayer === 'crime'
                ? 'linear-gradient(to right, #10b981, #fbbf24, #ef4444, #7f1d1d)'
                : 'linear-gradient(to right, #60a5fa, #fbbf24, #f97316, #dc2626)'
            }} />
            <div style={styles.legendLabels}>
              <span>{activeLayer === 'crime' ? 'Safe' : 'Cool'}</span>
              <span>{activeLayer === 'crime' ? 'Dangerous' : 'Hot'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  marker: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#0891b2',
    border: '3px solid white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },
  markerNumber: {
    color: 'white',
    fontWeight: '700',
    fontSize: '16px'
  },
  layerControls: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 10
  },
  layerBtn: {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    background: 'white',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    fontFamily: 'DM Sans, sans-serif'
  },
  layerBtnActive: {
    background: '#0891b2',
    color: 'white',
    borderColor: '#0891b2'
  },
  legend: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 10
  },
  legendTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1a1a2e'
  },
  legendGradient: {
    width: '100%'
  },
  gradientBar: {
    height: '12px',
    borderRadius: '6px',
    marginBottom: '8px'
  },
  legendLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#64748b'
  }
};

export default InteractiveMap;
