/**
 * DiscoverPage - City recommendation page
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscoverPage.css';

const CITIES = [
  {
    id: 'los_angeles',
    name: 'Los Angeles',
    state: 'California',
    tagline: 'Sun, stars, and endless beaches',
    description: 'Entertainment capital with diverse neighborhoods, world-class museums, and perfect weather',
    image: 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=600&h=400&fit=crop',
    tags: ['Beach', 'Entertainment', 'Food Scene', 'Arts'],
    highlights: ['Hollywood', 'Santa Monica', 'Getty Center'],
    safetyScore: 7.2,
    temperature: '75°F',
    attractions: 50
  },
  {
    id: 'san_francisco',
    name: 'San Francisco',
    state: 'California',
    tagline: 'Fog, tech, and iconic bay views',
    description: 'Hilly city known for the Golden Gate Bridge, cable cars, and vibrant culture',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop',
    tags: ['Scenic', 'Tech Hub', 'Walkable', 'Foodies'],
    highlights: ['Golden Gate', 'Alcatraz', 'Fisherman\'s Wharf'],
    safetyScore: 6.8,
    temperature: '62°F',
    attractions: 45
  },
  {
    id: 'new_york',
    name: 'New York City',
    state: 'New York',
    tagline: 'The city that never sleeps',
    description: 'Fast-paced metropolis with world-renowned museums, Broadway shows, and diverse cuisine',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
    tags: ['Culture', 'Nightlife', 'Shopping', 'Arts'],
    highlights: ['Central Park', 'Statue of Liberty', 'Times Square'],
    safetyScore: 7.5,
    temperature: '68°F',
    attractions: 80
  },
  {
    id: 'chicago',
    name: 'Chicago',
    state: 'Illinois',
    tagline: 'Architecture and deep-dish pizza',
    description: 'Midwest gem with stunning architecture, lakefront views, and famous food scene',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
    tags: ['Architecture', 'Food', 'Museums', 'Lakefront'],
    highlights: ['Millennium Park', 'Navy Pier', 'Art Institute'],
    safetyScore: 6.5,
    temperature: '65°F',
    attractions: 55
  },
  {
    id: 'miami',
    name: 'Miami',
    state: 'Florida',
    tagline: 'Tropical paradise with Latin flair',
    description: 'Beach city with Art Deco architecture, vibrant nightlife, and multicultural cuisine',
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=600&h=400&fit=crop',
    tags: ['Beach', 'Nightlife', 'Latin Culture', 'Art Deco'],
    highlights: ['South Beach', 'Wynwood Walls', 'Little Havana'],
    safetyScore: 6.9,
    temperature: '82°F',
    attractions: 40
  },
  {
    id: 'seattle',
    name: 'Seattle',
    state: 'Washington',
    tagline: 'Coffee, tech, and mountain views',
    description: 'Pacific Northwest city surrounded by water and mountains, known for coffee culture',
    image: 'https://images.unsplash.com/photo-1542223616-740d50105e00?w=600&h=400&fit=crop',
    tags: ['Nature', 'Coffee', 'Tech', 'Waterfront'],
    highlights: ['Space Needle', 'Pike Place', 'Mt. Rainier'],
    safetyScore: 7.8,
    temperature: '58°F',
    attractions: 42
  }
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleContinue = () => {
    if (selectedCity) {
      navigate(`/explore?city=${selectedCity.id}`);
    }
  };

  return (
    <div className="discover-page">
      {/* Header */}
      <header className="discover-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to menu
        </button>
        <div className="header-content">
          <h1 className="page-title">Discover a Destination</h1>
          <p className="page-subtitle">
            Browse trending cities and get a quick taste of must-see spots before you commit
          </p>
        </div>
        <div className="step-badge">Step 1 · Pick a city</div>
      </header>

      {/* Cities Grid */}
      <div className="cities-container">
        <div className="cities-grid">
          {CITIES.map((city) => (
            <div
              key={city.id}
              className={`city-card ${selectedCity?.id === city.id ? 'selected' : ''}`}
              onClick={() => handleCitySelect(city)}
            >
              <div className="city-image" style={{ backgroundImage: `url(${city.image})` }}>
                <div className="city-overlay">
                  <div className="city-stats">
                    <span className="stat-item">
                      🛡️ {city.safetyScore}/10
                    </span>
                    <span className="stat-item">
                      🌡️ {city.temperature}
                    </span>
                    <span className="stat-item">
                      📍 {city.attractions} spots
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="city-content">
                <div className="city-header">
                  <h3 className="city-name">{city.name}</h3>
                  <span className="city-state">{city.state}</span>
                </div>
                
                <p className="city-tagline">{city.tagline}</p>
                <p className="city-description">{city.description}</p>
                
                <div className="city-tags">
                  {city.tags.map((tag, index) => (
                    <span key={index} className="city-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="city-highlights">
                  <div className="highlights-label">Must-see:</div>
                  {city.highlights.map((highlight, index) => (
                    <span key={index} className="highlight-item">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              
              {selectedCity?.id === city.id && (
                <div className="selected-indicator">
                  <span className="check-icon">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      {selectedCity && (
        <div className="action-footer">
          <div className="action-content">
            <div className="selected-info">
              <span className="selected-icon">📍</span>
              <span className="selected-text">
                Selected: <strong>{selectedCity.name}</strong>
              </span>
            </div>
            <button className="continue-btn" onClick={handleContinue}>
              Explore {selectedCity.name} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
