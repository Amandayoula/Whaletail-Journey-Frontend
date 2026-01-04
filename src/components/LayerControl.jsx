import React from 'react';

/**
 * LayerControl - Toggle between different map layers
 */
const LayerControl = ({ activeLayer, onLayerChange }) => {
  const layers = [
    { id: 'none', name: 'Base Map', icon: '🗺️' },
    { id: 'crime', name: 'Crime Safety', icon: '🚨' },
    { id: 'heat', name: 'Heat Exposure', icon: '🌡️' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.title}>Map Layers</div>
      <div style={styles.buttons}>
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => onLayerChange(layer.id)}
            style={{
              ...styles.button,
              ...(activeLayer === layer.id ? styles.buttonActive : {})
            }}
          >
            <span style={styles.icon}>{layer.icon}</span>
            <span style={styles.label}>{layer.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1
  },
  title: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#1f2937'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '6px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    outline: 'none'
  },
  buttonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
    color: 'white'
  },
  icon: {
    fontSize: '18px'
  },
  label: {
    flex: 1,
    textAlign: 'left'
  }
};

export default LayerControl;
