/**
 * ExplorePage - Explore city gems and recommendations
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRecommendedPlaces, categoryMetadata } from '../data';
import { useApp } from '../context/AppContext';
import './ExplorePage.css';

export default function ExplorePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { togglePlace, selectedPlaces } = useApp();
  
  const [city, setCity] = useState(searchParams.get('city') || 'los_angeles');
  const [activeCategory, setActiveCategory] = useState('attraction');

  // Get recommended places for category
  const recommendedPlaces = getRecommendedPlaces(activeCategory, 6);

  const handlePlaceToggle = (place) => {
    togglePlace(place);
  };

  const handlePlanTrip = () => {
    navigate('/plan');
  };

  const isSelected = (placeId) => {
    return selectedPlaces.some(p => p.id === placeId);
  };

  return (
    <div className="explore-page">
      {/* Header */}
      <header className="explore-header">
        <button className="back-btn" onClick={() => navigate('/discover')}>
          ← Back to cities
        </button>
        <div className="header-content">
          <h1 className="page-title">Explore Los Angeles</h1>
          <p className="page-subtitle">
            Discover top-rated attractions, dining, stays, and events
          </p>
        </div>
        <div className="step-badge">Step 2 · Pick places</div>
      </header>

      {/* City Selector (optional, for switching cities) */}
      <div className="city-selector-bar">
        <div className="city-selector">
          <label>📍 City:</label>
          <select 
            value={city} 
            onChange={(e) => setCity(e.target.value)}
            className="city-select"
          >
            <option value="los_angeles">Los Angeles</option>
            <option value="san_francisco">San Francisco</option>
            <option value="new_york">New York City</option>
            <option value="chicago">Chicago</option>
          </select>
        </div>
        
        {selectedPlaces.length > 0 && (
          <button className="quick-plan-btn" onClick={handlePlanTrip}>
            Plan Trip ({selectedPlaces.length} selected) →
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="category-tabs-container">
        <div className="category-tabs">
          {Object.entries(categoryMetadata).map(([key, meta]) => (
            <button
              key={key}
              className={`category-tab-btn ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              <span className="tab-icon">{meta.icon}</span>
              <span className="tab-label">{meta.label.replace(/^.\s/, '')}</span>
              <span className="tab-count">{meta.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      <div className="explore-container">
        <div className="section-header">
          <h2 className="section-title">
            {categoryMetadata[activeCategory]?.icon} Top {categoryMetadata[activeCategory]?.label}
          </h2>
          <p className="section-description">
            {categoryMetadata[activeCategory]?.description}
          </p>
        </div>

        <div className="places-grid-large">
          {recommendedPlaces.map((place) => (
            <div
              key={place.id}
              className={`place-card-large ${isSelected(place.id) ? 'selected' : ''}`}
              onClick={() => handlePlaceToggle(place)}
            >
              <div 
                className="place-image-large"
                style={{ backgroundImage: `url(${place.imageUrl})` }}
              >
                {isSelected(place.id) && (
                  <div className="selected-overlay">
                    <span className="check-icon">✓</span>
                  </div>
                )}
              </div>
              
              <div className="place-content-large">
                <div className="place-header-large">
                  <h3 className="place-name-large">{place.name}</h3>
                  <div className="place-rating">
                    ⭐ {place.rating}
                  </div>
                </div>
                
                <p className="place-description-large">
                  {place.description}
                </p>
                
                <div className="place-meta-row">
                  <span className="meta-item">⏱️ {place.duration}min</span>
                  <span className="meta-item">💵 {place.price}</span>
                  <span className={`meta-item safety ${place.safetyScore >= 8 ? 'high' : 'medium'}`}>
                    🛡️ {place.safetyScore}/10
                  </span>
                </div>
                
                <div className="place-tags-large">
                  {place.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag-large">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      {selectedPlaces.length > 0 && (
        <button className="fab" onClick={handlePlanTrip}>
          <span className="fab-count">{selectedPlaces.length}</span>
          <span className="fab-text">Plan My Trip →</span>
        </button>
      )}
    </div>
  );
}
