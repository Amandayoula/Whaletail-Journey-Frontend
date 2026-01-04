import React, { useState } from 'react';
import { formatTime, getSafetyColor, getHeatColor } from '../utils/mapUtils';

/**
 * ItineraryPanel - Display itinerary details and controls
 */
const ItineraryPanel = ({ itinerary, onDestinationClick }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!itinerary) {
    return null;
  }

  const { name, destinations, metadata } = itinerary;

  return (
    <div style={styles.container}>
      <div style={styles.header} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={styles.headerContent}>
          <h2 style={styles.title}>{name}</h2>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Safety:</span>
              <span style={{
                ...styles.statValue,
                color: getSafetyColor(metadata.overallSafetyScore)
              }}>
                {metadata.overallSafetyScore}/10
              </span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Heat:</span>
              <span style={{
                ...styles.statValue,
                color: getHeatColor(metadata.averageHeatExposure)
              }}>
                {metadata.averageHeatExposure}/10
              </span>
            </div>
          </div>
        </div>
        <button style={styles.toggleButton}>
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div style={styles.content}>
          <div style={styles.destinations}>
            {destinations.map((dest, index) => (
              <div 
                key={dest.id}
                style={styles.destination}
                onClick={() => onDestinationClick && onDestinationClick(dest)}
              >
                <div style={styles.destinationNumber}>{index + 1}</div>
                <div style={styles.destinationContent}>
                  <div style={styles.destinationName}>{dest.name}</div>
                  <div style={styles.destinationTime}>
                    {formatTime(dest.time)} • {dest.duration} min
                  </div>
                  <div style={styles.destinationScores}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: getSafetyColor(dest.safetyScore)
                    }}>
                      Safety: {dest.safetyScore}
                    </span>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: getHeatColor(dest.heatScore)
                    }}>
                      Heat: {dest.heatScore}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.summary}>
            <div style={styles.summaryItem}>
              <span>Total Duration:</span>
              <strong>{Math.floor(metadata.totalDuration / 60)}h {metadata.totalDuration % 60}m</strong>
            </div>
            <div style={styles.summaryItem}>
              <span>Optimized For:</span>
              <strong>{metadata.optimizedFor.join(', ')}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '320px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1,
    maxHeight: 'calc(100vh - 20px)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    margin: '0 0 8px 0',
    color: '#1f2937'
  },
  stats: {
    display: 'flex',
    gap: '16px'
  },
  stat: {
    display: 'flex',
    gap: '4px',
    fontSize: '14px'
  },
  statLabel: {
    color: '#6b7280'
  },
  statValue: {
    fontWeight: '600'
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '4px',
    color: '#6b7280'
  },
  content: {
    overflowY: 'auto',
    flex: 1
  },
  destinations: {
    padding: '12px'
  },
  destination: {
    display: 'flex',
    gap: '12px',
    padding: '12px',
    marginBottom: '8px',
    borderRadius: '6px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f3f4f6'
    }
  },
  destinationNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0
  },
  destinationContent: {
    flex: 1,
    minWidth: 0
  },
  destinationName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '4px'
  },
  destinationTime: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '6px'
  },
  destinationScores: {
    display: 'flex',
    gap: '6px'
  },
  badge: {
    fontSize: '11px',
    padding: '2px 8px',
    borderRadius: '4px',
    color: 'white',
    fontWeight: '600'
  },
  summary: {
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    marginBottom: '8px',
    color: '#374151'
  }
};

export default ItineraryPanel;
