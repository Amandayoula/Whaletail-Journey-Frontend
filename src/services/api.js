import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API service for communicating with Whaletail backend
 */
class WhaletailAPI {
  /**
   * Generate an itinerary using the Planning Agent
   * @param {Object} request - The itinerary request
   * @returns {Promise<Object>} The generated itinerary
   */
  async generateItinerary(request) {
    try {
      const response = await apiClient.post('/api/v1/itinerary/generate', request);
      return response.data;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Evaluate safety for a given route
   * @param {Object} route - The route to evaluate
   * @returns {Promise<Object>} Safety evaluation results
   */
  async evaluateSafety(route) {
    try {
      const response = await apiClient.post('/api/v1/safety/evaluate', route);
      return response.data;
    } catch (error) {
      console.error('Error evaluating safety:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Optimize route based on constraints
   * @param {Object} constraints - Route optimization constraints
   * @returns {Promise<Object>} Optimized route
   */
  async optimizeRoute(constraints) {
    try {
      const response = await apiClient.post('/api/v1/route/optimize', constraints);
      return response.data;
    } catch (error) {
      console.error('Error optimizing route:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get crime data for a specific area
   * @param {Object} bounds - Geographic bounds {north, south, east, west}
   * @returns {Promise<Object>} Crime data
   */
  async getCrimeData(bounds) {
    try {
      const response = await apiClient.get('/api/v1/data/crime', {
        params: bounds
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching crime data:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Get heat/temperature data for a specific area
   * @param {Object} bounds - Geographic bounds {north, south, east, west}
   * @returns {Promise<Object>} Heat data
   */
  async getHeatData(bounds) {
    try {
      const response = await apiClient.get('/api/v1/data/heat', {
        params: bounds
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching heat data:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Health check endpoint
   * @returns {Promise<Object>} API health status
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw this._handleError(error);
    }
  }

  /**
   * Handle API errors
   * @private
   */
  _handleError(error) {
    if (error.response) {
      // Server responded with error status
      return {
        status: error.response.status,
        message: error.response.data.message || 'Server error',
        data: error.response.data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 0,
        message: 'No response from server. Please check your connection.',
        data: null
      };
    } else {
      // Error in request configuration
      return {
        status: -1,
        message: error.message || 'Request configuration error',
        data: null
      };
    }
  }
}

// Export singleton instance
export const whaletailAPI = new WhaletailAPI();

export default whaletailAPI;
