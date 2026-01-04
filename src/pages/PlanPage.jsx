/**
 * PlanPage - Main Planning Interface
 * 核心页面：Places选择 + Itinerary地图 + Chat
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { categoryMetadata, getPlacesByCategory, getRecommendedPlaces } from '../data';
import { whaletailBackendAPI } from '../services/backendAPI';
import InteractiveMap from '../components/InteractiveMap';
import './PlanPage.css';

export default function PlanPage() {
  const {
    selectedPlaces,
    togglePlace,
    updatePlaceConstraint,
    itinerary,
    setItinerary,
    isPlanning,
    setIsPlanning,
    chatMessages,
    addChatMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState('places'); // 'places' or 'itinerary'
  const [activeCategory, setActiveCategory] = useState('attraction');
  const [modalPlace, setModalPlace] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [activeMapLayer, setActiveMapLayer] = useState('none'); // 'none', 'crime', 'heat'

  // Get places for active category
  const places = getPlacesByCategory(activeCategory);
  const recommended = getRecommendedPlaces(activeCategory, 3);

  /**
   * Handle place card click - open constraint modal
   */
  const handlePlaceClick = (place) => {
    const isSelected = selectedPlaces.find(p => p.id === place.id);
    
    if (isSelected) {
      setModalPlace(isSelected);
    } else {
      togglePlace(place);
    }
  };

  /**
   * Save constraint from modal
   */
  const handleSaveConstraint = (constraint, fixedTime) => {
    if (modalPlace) {
      updatePlaceConstraint(modalPlace.id, constraint, fixedTime);
      setModalPlace(null);
    }
  };

  /**
   * Generate itinerary using backend API
   */
  const handleGeneratePlan = async () => {
    if (selectedPlaces.length === 0) {
      addChatMessage('assistant', 'Please select at least one place to visit!');
      return;
    }

    setIsPlanning(true);
    addChatMessage('user', `Generate itinerary for ${selectedPlaces.length} places`);
    addChatMessage('assistant', '🤖 Planning your trip with AI...');

    try {
      const result = await whaletailBackendAPI.planTrip({
        selected_places: selectedPlaces,
        start_time: '2026-01-15T09:00:00',
        end_time: '2026-01-15T21:00:00',
        user_preferences: {
          safety_priority: 'high'
        },
        constraints: selectedPlaces.map(p => ({
          type: p.constraint,
          location_id: p.id,
          time_range: p.fixedTime ? [p.fixedTime, p.fixedTime] : null,
          priority: p.constraint === 'must_visit' ? 10 : p.constraint === 'fixed_time' ? 9 : 5
        }))
      });

      setItinerary(result);
      setActiveTab('itinerary');
      addChatMessage('assistant', `✅ Itinerary ready! I planned ${result.itinerary?.length || 0} stops with safety score: ${result.safety_score?.toFixed(1) || 'N/A'}`);
    } catch (error) {
      console.error('Planning failed:', error);
      addChatMessage('assistant', `❌ Planning failed: ${error.message}. Using mock itinerary for demo.`);
      
      // Fallback mock itinerary
      setItinerary({
        success: true,
        itinerary: selectedPlaces.map((place, index) => ({
          attraction: place,
          start_time: `2026-01-15T${9 + index * 2}:00:00`,
          end_time: `2026-01-15T${9 + index * 2 + 1}:30:00`,
          route_to_next: index < selectedPlaces.length - 1 ? {
            distance: 3.5,
            duration: 15,
            mode: 'driving'
          } : null
        })),
        safety_score: 8.5,
        constraint_violations: [],
        suggestions: ['Great choices! All locations are safe and well-connected.']
      });
      setActiveTab('itinerary');
    } finally {
      setIsPlanning(false);
    }
  };

  /**
   * Send chat message
   */
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    addChatMessage('user', chatInput);
    
    // Simple mock responses
    setTimeout(() => {
      const responses = [
        "I can help you plan an amazing trip! Select places and click 'Generate Plan'.",
        "The places you've selected look great! Would you like me to optimize the route?",
        "Safety is my priority. All routes I suggest avoid high-crime areas.",
        "You can mark places as 'Must Visit' or set 'Fixed Time' for events."
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addChatMessage('assistant', response);
    }, 500);

    setChatInput('');
  };

  return (
    <div className="plan-page">
      {/* Left Panel - Places & Itinerary Tabs */}
      <div className="left-panel">
        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activeTab === 'places' ? 'active' : ''}`}
            onClick={() => setActiveTab('places')}
          >
            📍 Places ({selectedPlaces.length})
          </button>
          <button 
            className={`panel-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            📋 Itinerary
          </button>
        </div>

        {/* Places Tab */}
        {activeTab === 'places' && (
          <div className="places-content">
            <div className="places-header">
              <h3>Select Places to Visit</h3>
              <div className="quick-add">
                <span className="label">Quick Add:</span>
                {recommended.map(place => (
                  <button
                    key={place.id}
                    className="quick-add-btn"
                    onClick={() => togglePlace(place)}
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="category-tabs">
              {Object.entries(categoryMetadata).map(([key, meta]) => (
                <button
                  key={key}
                  className={`category-tab ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                >
                  <span className="icon">{meta.icon}</span>
                  <span className="label">{meta.label.replace(/^.\s/, '')}</span>
                  <span className="count">{meta.count}</span>
                </button>
              ))}
            </div>

            {/* Places Grid */}
            <div className="places-grid">
              {places.slice(0, 8).map(place => {
                const isSelected = selectedPlaces.find(p => p.id === place.id);
                return (
                  <div
                    key={place.id}
                    className={`place-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handlePlaceClick(place)}
                  >
                    <div 
                      className="place-image-thumb"
                      style={{ backgroundImage: `url(${place.imageUrl})` }}
                    >
                      {isSelected && (
                        <div className="selected-overlay-mini">
                          <span className="check-icon-mini">✓</span>
                        </div>
                      )}
                    </div>
                    <div className="place-info">
                      <div className="place-header-row">
                        <h4 className="place-name">{place.name}</h4>
                        <div className="place-rating-mini">
                          ⭐ {place.rating}
                        </div>
                      </div>
                      {/* <p className="place-description-mini">
                        {place.description.length > 60 
                          ? place.description.substring(0, 60) + '...' 
                          : place.description}
                      </p> */}
                      <div className="place-meta-mini">
                        <span className="meta-mini">⏱️ {place.duration}min</span>
                        <span className="meta-mini">💵 {place.price}</span>
                      </div>
                      <div className="place-tags">
                        <span className={`tag safety ${place.safetyScore >= 8 ? '' : 'medium'}`}>
                          🛡️ {place.safetyScore}
                        </span>
                        {place.fixedTime && (
                          <span className="tag fixed-time">📌 Fixed</span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="selected-badge">
                        {isSelected.constraint === 'must_visit' ? '⭐' : isSelected.constraint === 'fixed_time' ? '📌' : '✓'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button 
              className="generate-btn"
              onClick={handleGeneratePlan}
              disabled={selectedPlaces.length === 0 || isPlanning}
            >
              {isPlanning ? '🤖 Planning...' : `Generate Plan (${selectedPlaces.length} places)`}
            </button>
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="itinerary-content">
            {!itinerary ? (
              <div className="itinerary-empty">
                <div className="empty-icon">📋</div>
                <h3>No itinerary yet</h3>
                <p>Select places and generate a plan</p>
              </div>
            ) : (
              <div className="itinerary-details">
                <div className="itinerary-summary">
                  <h3>Your Optimized Itinerary</h3>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="value">{itinerary.itinerary?.length || 0}</span>
                      <span className="label">Stops</span>
                    </div>
                    <div className="stat">
                      <span className="value">{itinerary.safety_score?.toFixed(1) || 'N/A'}</span>
                      <span className="label">Safety</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="timeline">
                  {itinerary.itinerary?.map((item, index) => {
                    const startTime = new Date(item.start_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    const endTime = new Date(item.end_time).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    
                    return (
                      <div key={index} className="timeline-item">
                        <div className="time-marker">{index + 1}</div>
                        <div className="item-content">
                          <h4>{item.attraction.name}</h4>
                          <p className="time">{startTime} - {endTime}</p>
                          <p className="duration">⏱️ {item.attraction.duration} minutes</p>
                          {item.route_to_next && (
                            <p className="route-info">
                              🚗 {item.route_to_next.duration} min to next stop
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Middle Area - Map */}
      <div className="map-area">
        <InteractiveMap 
          itinerary={itinerary}
          activeLayer={activeMapLayer}
          onLayerChange={setActiveMapLayer}
        />
      </div>

      {/* Right Panel - Chat */}
      <div className="chat-panel">
        <div className="chat-header">
          <h2>🐋 Whaletail Assistant</h2>
          <p>AI-powered travel planning</p>
        </div>

        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask me anything..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="send-btn" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>

      {/* Constraint Modal */}
      {modalPlace && (
        <div className="modal-overlay" onClick={() => setModalPlace(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalPlace.name}</h3>
              <button className="close-btn" onClick={() => setModalPlace(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>How important is this place?</p>
              <div className="constraint-options">
                <label className="constraint-option">
                  <input
                    type="radio"
                    name="constraint"
                    value="flexible"
                    checked={modalPlace.constraint === 'flexible'}
                    onChange={() => handleSaveConstraint('flexible', null)}
                  />
                  <span>🔄 Flexible - Include if time permits</span>
                </label>
                <label className="constraint-option">
                  <input
                    type="radio"
                    name="constraint"
                    value="must_visit"
                    checked={modalPlace.constraint === 'must_visit'}
                    onChange={() => handleSaveConstraint('must_visit', null)}
                  />
                  <span>⭐ Must Visit - Priority location</span>
                </label>
                {modalPlace.fixedTime && (
                  <label className="constraint-option">
                    <input
                      type="radio"
                      name="constraint"
                      value="fixed_time"
                      checked={modalPlace.constraint === 'fixed_time'}
                      onChange={() => handleSaveConstraint('fixed_time', modalPlace.fixedTime)}
                    />
                    <span>📌 Fixed Time - {new Date(modalPlace.fixedTime).toLocaleString()}</span>
                  </label>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setModalPlace(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
