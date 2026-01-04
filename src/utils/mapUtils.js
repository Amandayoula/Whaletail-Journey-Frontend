/**
 * Map utility functions
 */

/**
 * Calculate map bounds from a set of coordinates
 * @param {Array<Array<number>>} coordinates - Array of [lng, lat] pairs
 * @returns {Object} Bounds object {minLng, minLat, maxLng, maxLat}
 */
export function calculateBounds(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  coordinates.forEach(([lng, lat]) => {
    minLng = Math.min(minLng, lng);
    minLat = Math.min(minLat, lat);
    maxLng = Math.max(maxLng, lng);
    maxLat = Math.max(maxLat, lat);
  });

  return { minLng, minLat, maxLng, maxLat };
}

/**
 * Fit map to show all points with padding
 * @param {Object} mapRef - Mapbox map reference
 * @param {Array<Array<number>>} coordinates - Array of [lng, lat] pairs
 * @param {number} padding - Padding in pixels (default: 50)
 */
export function fitMapToCoordinates(mapRef, coordinates, padding = 50) {
  if (!mapRef || !coordinates || coordinates.length === 0) {
    return;
  }

  const bounds = calculateBounds(coordinates);
  if (!bounds) return;

  mapRef.fitBounds(
    [
      [bounds.minLng, bounds.minLat],
      [bounds.maxLng, bounds.maxLat]
    ],
    {
      padding,
      duration: 1000
    }
  );
}

/**
 * Get color based on safety score (0-10 scale)
 * @param {number} score - Safety score
 * @returns {string} Color hex code
 */
export function getSafetyColor(score) {
  if (score >= 8) return '#10b981'; // Green - Very safe
  if (score >= 6) return '#f59e0b'; // Amber - Moderately safe
  if (score >= 4) return '#ef4444'; // Red - Unsafe
  return '#7f1d1d'; // Dark red - Very unsafe
}

/**
 * Get color based on heat index (0-10 scale)
 * @param {number} index - Heat index
 * @returns {string} Color hex code
 */
export function getHeatColor(index) {
  if (index >= 8) return '#dc2626'; // Dark red - Very hot
  if (index >= 6) return '#f97316'; // Orange - Hot
  if (index >= 4) return '#fbbf24'; // Yellow - Warm
  return '#60a5fa'; // Blue - Cool
}

/**
 * Get color based on crime score (0-10 scale)
 * @param {number} score - Crime score
 * @returns {string} Color hex code
 */
export function getCrimeColor(score) {
  if (score >= 8) return '#7f1d1d'; // Dark red - High crime
  if (score >= 6) return '#ef4444'; // Red - Elevated crime
  if (score >= 4) return '#f59e0b'; // Amber - Moderate crime
  return '#10b981'; // Green - Low crime
}

/**
 * Format time string
 * @param {string} timeStr - Time in HH:MM format
 * @returns {string} Formatted time
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  
  const [hours, minutes] = timeStr.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {Array<number>} coord1 - [lng, lat]
 * @param {Array<number>} coord2 - [lng, lat]
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(coord1, coord2) {
  const R = 6371; // Earth's radius in km
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Generate marker popup HTML
 * @param {Object} destination - Destination object
 * @returns {string} HTML string for popup
 */
export function generatePopupHTML(destination) {
  const safetyScore = destination.safetyScore || destination.safety_score || 0;
  const heatScore = destination.heatScore || destination.heat_score || 5;
  const duration = destination.duration || 60;
  const startTime = destination.start_time || destination.time;
  
  const safetyColor = getSafetyColor(safetyScore);
  const heatColor = getHeatColor(heatScore);
  
  // Format time from ISO string or HH:MM format
  let displayTime = '';
  if (startTime) {
    try {
      const date = new Date(startTime);
      if (!isNaN(date.getTime())) {
        displayTime = date.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
      } else {
        displayTime = formatTime(startTime);
      }
    } catch (e) {
      displayTime = formatTime(startTime);
    }
  }
  
  return `
    <div style="min-width: 200px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">
        ${destination.name}
      </h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">
        ${destination.description || destination.address || ''}
      </p>
      <div style="display: flex; flex-direction: column; gap: 4px; font-size: 13px;">
        ${displayTime ? `
        <div style="display: flex; justify-content: space-between;">
          <span>Time:</span>
          <strong>${displayTime}</strong>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span>Duration:</span>
          <strong>${duration} min</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Safety:</span>
          <span style="
            background-color: ${safetyColor}; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 4px;
            font-weight: 600;
          ">
            ${safetyScore.toFixed(1)}/10
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Heat Index:</span>
          <span style="
            background-color: ${heatColor}; 
            color: white; 
            padding: 2px 8px; 
            border-radius: 4px;
            font-weight: 600;
          ">
            ${heatScore.toFixed(1)}/10
          </span>
        </div>
      </div>
    </div>
  `;
}
