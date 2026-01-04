/**
 * Whaletail Backend API Service
 * 连接v1.0 FastAPI后端
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s for AI planning
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Whaletail v1.0 API Service
 */
class WhaletailBackendAPI {
  /**
   * Health check
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Plan trip using v1.0 AI Agent
   * @param {Object} request - Trip planning request
   * @returns {Promise<Object>} Generated itinerary
   */
  async planTrip(request) {
    try {
      console.log('🤖 Calling v1.0 AI Agent /api/v1/plan:', request);
      
      const response = await apiClient.post('/api/v1/plan', {
        user_query: request.user_query || this._generateUserQuery(request),
        start_time: request.start_time,
        end_time: request.end_time,
        user_preferences: request.user_preferences || {
          safety_priority: 'high',
          interests: this._extractInterests(request.selected_places)
        },
        constraints: request.constraints || []
      });
      
      console.log('✅ v1.0 Agent response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Plan trip failed:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Stream trip planning (SSE)
   * @param {Object} request - Trip planning request
   * @param {Function} onMessage - Callback for each message
   */
  async planTripStream(request, onMessage) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/plan/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_query: request.user_query || this._generateUserQuery(request),
          start_time: request.start_time,
          end_time: request.end_time,
          user_preferences: request.user_preferences || {},
          constraints: request.constraints || []
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              onMessage(parsed);
            } catch (e) {
              console.warn('Failed to parse SSE data:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream failed:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Evaluate safety for a location
   */
  async evaluateSafety(location, time, radius = 500) {
    try {
      const response = await apiClient.post('/api/v1/evaluate-safety', {
        location,
        time,
        radius
      });
      return response.data;
    } catch (error) {
      console.error('Safety evaluation failed:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Search attractions
   */
  async searchAttractions(query, location, radius = 5000, limit = 10) {
    try {
      const response = await apiClient.post('/api/v1/search-attractions', {
        query,
        location,
        radius,
        limit
      });
      return response.data;
    } catch (error) {
      console.error('Attraction search failed:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Calculate route between two points
   */
  async calculateRoute(origin, destination, mode = 'walking', time = null) {
    try {
      const response = await apiClient.post('/api/v1/calculate-route', {
        origin,
        destination,
        mode,
        time
      });
      return response.data;
    } catch (error) {
      console.error('Route calculation failed:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Helper: Generate user query from selected places
   * @private
   */
  _generateUserQuery(request) {
    const { selected_places, preferences } = request;
    
    if (!selected_places || selected_places.length === 0) {
      return "Plan a day trip in Los Angeles";
    }

    const placeNames = selected_places.map(p => p.name).join(', ');
    const safetyPref = preferences?.safety_priority === 'high' ? ' with safe routes' : '';
    
    return `Plan an itinerary visiting: ${placeNames}${safetyPref}`;
  }

  /**
   * Helper: Extract interests from selected places
   * @private
   */
  _extractInterests(selectedPlaces) {
    if (!selectedPlaces || selectedPlaces.length === 0) {
      return ['sightseeing'];
    }

    const allTags = selectedPlaces.flatMap(place => place.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    return uniqueTags.slice(0, 5); // Top 5 tags
  }

  /**
   * Handle API errors
   * @private
   */
  _handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.detail || error.response.data.message || 'Server error',
        data: error.response.data
      };
    } else if (error.request) {
      return {
        status: 0,
        message: 'Backend not responding. Please ensure the server is running on port 8000.',
        data: null
      };
    } else {
      return {
        status: -1,
        message: error.message || 'Request configuration error',
        data: null
      };
    }
  }
}

// Export singleton instance
export const whaletailBackendAPI = new WhaletailBackendAPI();

export default whaletailBackendAPI;
