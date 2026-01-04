import React from 'react';

/**
 * MapLegend - Displays color scales for crime and heat layers
 */
const MapLegend = ({ activeLayer }) => {
  const crimeGradient = [
    { label: 'Very Safe', color: '#10b981', value: '0-3' },
    { label: 'Safe', color: '#fbbf24', value: '3-6' },
    { label: 'Moderate', color: '#ef4444', value: '6-8' },
    { label: 'High Risk', color: '#7f1d1d', value: '8-10' }
  ];

  const heatGradient = [
    { label: 'Cool', color: '#60a5fa', value: '< 80°F' },
    { label: 'Warm', color: '#fbbf24', value: '80-85°F' },
    { label: 'Hot', color: '#f97316', value: '85-92°F' },
    { label: 'Very Hot', color: '#dc2626', value: '> 92°F' }
  ];

  const gradient = activeLayer === 'crime' ? crimeGradient : heatGradient;
  const title = activeLayer === 'crime' ? 'Crime Risk Level' : 'Temperature Zones';

  return (
    <div style={styles.container}>
      <div style={styles.title}>{title}</div>
      <div style={styles.items}>
        {gradient.map((item, index) => (
          <div key={index} style={styles.item}>
            <div 
              style={{
                ...styles.colorBox,
                backgroundColor: item.color
              }}
            />
            <div style={styles.labelContainer}>
              <div style={styles.label}>{item.label}</div>
              <div style={styles.value}>{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    bottom: '30px',
    right: '10px',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    minWidth: '200px',
    zIndex: 1
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937'
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  colorBox: {
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    flexShrink: 0
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
  },
  value: {
    fontSize: '11px',
    color: '#6b7280'
  }
};

export default MapLegend;
