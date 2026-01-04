// Simulated heat/temperature exposure data for Los Angeles
// Based on urban heat island effect patterns

export const heatData = {
  type: 'FeatureCollection',
  features: [
    // Downtown/Industrial areas - High heat
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2437, 34.0522] },
      properties: { temperature: 95, heatIndex: 8.5, area: 'Downtown LA' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2500, 34.0480] },
      properties: { temperature: 96, heatIndex: 8.8, area: 'Downtown LA' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2380, 34.0560] },
      properties: { temperature: 94, heatIndex: 8.3, area: 'Downtown LA' }
    },
    
    // Industrial areas - Very high heat
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2100, 34.0200] },
      properties: { temperature: 98, heatIndex: 9.2, area: 'Industrial Area' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2050, 34.0150] },
      properties: { temperature: 99, heatIndex: 9.5, area: 'Industrial Area' }
    },
    
    // Hollywood - Moderate-high heat
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.3267, 34.0928] },
      properties: { temperature: 90, heatIndex: 7.2, area: 'Hollywood' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.3400, 34.1010] },
      properties: { temperature: 91, heatIndex: 7.5, area: 'Hollywood' }
    },
    
    // Santa Monica - Low heat (ocean breeze)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4912, 34.0195] },
      properties: { temperature: 78, heatIndex: 3.5, area: 'Santa Monica' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4967, 34.0245] },
      properties: { temperature: 77, heatIndex: 3.2, area: 'Santa Monica' }
    },
    
    // Beverly Hills - Moderate heat (tree cover)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4005, 34.0736] },
      properties: { temperature: 85, heatIndex: 5.5, area: 'Beverly Hills' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.3950, 34.0670] },
      properties: { temperature: 84, heatIndex: 5.2, area: 'Beverly Hills' }
    },
    
    // Venice Beach - Low heat (coastal)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4695, 33.9850] },
      properties: { temperature: 79, heatIndex: 3.8, area: 'Venice Beach' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4740, 33.9920] },
      properties: { temperature: 80, heatIndex: 4.1, area: 'Venice Beach' }
    },
    
    // Compton - High heat
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2201, 33.8958] },
      properties: { temperature: 93, heatIndex: 8.0, area: 'Compton' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2150, 33.9020] },
      properties: { temperature: 92, heatIndex: 7.8, area: 'Compton' }
    },
    
    // Pasadena - Moderate-high heat
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1445, 34.1478] },
      properties: { temperature: 88, heatIndex: 6.5, area: 'Pasadena' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1520, 34.1560] },
      properties: { temperature: 89, heatIndex: 6.8, area: 'Pasadena' }
    },
    
    // Long Beach - Moderate heat (coastal but urban)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1937, 33.7701] },
      properties: { temperature: 82, heatIndex: 4.8, area: 'Long Beach' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1850, 33.7800] },
      properties: { temperature: 83, heatIndex: 5.0, area: 'Long Beach' }
    },
    
    // Westwood/UCLA - Low-moderate heat (trees)
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4452, 34.0689] },
      properties: { temperature: 81, heatIndex: 4.5, area: 'Westwood' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4380, 34.0630] },
      properties: { temperature: 80, heatIndex: 4.2, area: 'Westwood' }
    }
  ]
};

// Generate dense grid for heatmap visualization
export function generateHeatHeatmapData() {
  const heatmapPoints = [];
  
  heatData.features.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates;
    const { heatIndex } = feature.properties;
    
    // Create multiple points around each location for smoother heatmap
    for (let i = 0; i < 20; i++) {
      const offsetLng = (Math.random() - 0.5) * 0.02;
      const offsetLat = (Math.random() - 0.5) * 0.02;
      
      heatmapPoints.push([
        lng + offsetLng,
        lat + offsetLat,
        heatIndex / 10 // Normalize to 0-1 range
      ]);
    }
  });
  
  return heatmapPoints;
}
