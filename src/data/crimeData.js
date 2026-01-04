// Simulated crime data for Los Angeles
// Based on typical crime hotspots in LA

export const crimeData = {
  type: 'FeatureCollection',
  features: [
    // Downtown LA - High crime area
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2437, 34.0522] },
      properties: { crimeScore: 8.5, crimeCount: 245, area: 'Downtown LA' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2500, 34.0480] },
      properties: { crimeScore: 7.8, crimeCount: 198, area: 'Downtown LA' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2380, 34.0560] },
      properties: { crimeScore: 8.2, crimeCount: 221, area: 'Downtown LA' }
    },
    
    // Skid Row - Very high crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2468, 34.0430] },
      properties: { crimeScore: 9.5, crimeCount: 312, area: 'Skid Row' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2420, 34.0445] },
      properties: { crimeScore: 9.2, crimeCount: 289, area: 'Skid Row' }
    },
    
    // Hollywood - Moderate-high crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.3267, 34.0928] },
      properties: { crimeScore: 6.5, crimeCount: 156, area: 'Hollywood' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.3400, 34.1010] },
      properties: { crimeScore: 6.8, crimeCount: 167, area: 'Hollywood' }
    },
    
    // Santa Monica - Low crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4912, 34.0195] },
      properties: { crimeScore: 3.2, crimeCount: 45, area: 'Santa Monica' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4967, 34.0245] },
      properties: { crimeScore: 2.8, crimeCount: 38, area: 'Santa Monica' }
    },
    
    // Beverly Hills - Very low crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4005, 34.0736] },
      properties: { crimeScore: 1.5, crimeCount: 12, area: 'Beverly Hills' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.3950, 34.0670] },
      properties: { crimeScore: 1.8, crimeCount: 15, area: 'Beverly Hills' }
    },
    
    // Venice Beach - Moderate crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4695, 33.9850] },
      properties: { crimeScore: 5.5, crimeCount: 98, area: 'Venice Beach' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4740, 33.9920] },
      properties: { crimeScore: 5.8, crimeCount: 105, area: 'Venice Beach' }
    },
    
    // Compton - High crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2201, 33.8958] },
      properties: { crimeScore: 8.8, crimeCount: 267, area: 'Compton' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.2150, 33.9020] },
      properties: { crimeScore: 8.5, crimeCount: 254, area: 'Compton' }
    },
    
    // Pasadena - Low-moderate crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1445, 34.1478] },
      properties: { crimeScore: 3.8, crimeCount: 67, area: 'Pasadena' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1520, 34.1560] },
      properties: { crimeScore: 4.1, crimeCount: 72, area: 'Pasadena' }
    },
    
    // Long Beach - Moderate crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1937, 33.7701] },
      properties: { crimeScore: 6.2, crimeCount: 142, area: 'Long Beach' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.1850, 33.7800] },
      properties: { crimeScore: 5.9, crimeCount: 128, area: 'Long Beach' }
    },
    
    // Westwood/UCLA - Low crime
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4452, 34.0689] },
      properties: { crimeScore: 2.5, crimeCount: 32, area: 'Westwood' }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [-118.4380, 34.0630] },
      properties: { crimeScore: 2.2, crimeCount: 28, area: 'Westwood' }
    }
  ]
};

// Generate a dense grid for heatmap visualization
export function generateCrimeHeatmapData() {
  const heatmapPoints = [];
  
  // Generate points based on the crime data above
  crimeData.features.forEach(feature => {
    const [lng, lat] = feature.geometry.coordinates;
    const { crimeScore } = feature.properties;
    
    // Create multiple points around each location for smoother heatmap
    for (let i = 0; i < 20; i++) {
      const offsetLng = (Math.random() - 0.5) * 0.02;
      const offsetLat = (Math.random() - 0.5) * 0.02;
      
      heatmapPoints.push([
        lng + offsetLng,
        lat + offsetLat,
        crimeScore / 10 // Normalize to 0-1 range
      ]);
    }
  });
  
  return heatmapPoints;
}
