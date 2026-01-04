/**
 * WelcomePage - Landing page with three journey options
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

export default function WelcomePage() {
  const navigate = useNavigate();

  const journeyOptions = [
    {
      id: 'discover',
      icon: '🗺️',
      title: 'Discover a Destination',
      subtitle: 'Not sure where to go yet',
      description: 'Let us help you find the perfect city based on your preferences',
      color: '#0891b2',
      path: '/discover'
    },
    {
      id: 'explore',
      icon: '🎯',
      title: 'Explore Local Gems',
      subtitle: 'I know my city, show me what to do',
      description: 'Get personalized recommendations for attractions, dining, and events',
      color: '#f97316',
      path: '/explore'
    },
    {
      id: 'plan',
      icon: '📅',
      title: 'Plan My Itinerary',
      subtitle: 'I have places in mind',
      description: 'Create a detailed schedule with safe routes and optimized timing',
      color: '#8b5cf6',
      path: '/plan'
    }
  ];

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        {/* Header */}
        <header className="welcome-header">
          <div className="logo">
            <span className="logo-icon">🐋</span>
            <span className="logo-text">Whaletail</span>
          </div>
          <p className="tagline">AI-Powered Safety-Aware Travel Planning</p>
        </header>

        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">What's on your mind?</h1>
          <p className="hero-subtitle">
            Pick the flow that matches where you are in your trip planning journey. 
            We'll guide you with curated ideas and smart defaults.
          </p>
        </section>

        {/* Journey Options */}
        <section className="journey-options">
          {journeyOptions.map((option) => (
            <div
              key={option.id}
              className="journey-card"
              onClick={() => navigate(option.path)}
              style={{ '--card-color': option.color }}
            >
              <div className="card-header">
                <span className="card-icon">{option.icon}</span>
                {/* <div className="card-badge">Step 1 • Choose path</div> */}
              </div>
              <div className="card-body">
                <h3 className="card-title">{option.title}</h3>
                <p className="card-subtitle">{option.subtitle}</p>
                <p className="card-description">{option.description}</p>
              </div>
              <div className="card-footer">
                <span className="card-cta">Get started →</span>
              </div>
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="features-section">
          <h2 className="features-title">Why Whaletail?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h4>Safety First</h4>
              <p>AI-powered route optimization avoiding high-crime areas</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Smart Planning</h4>
              <p>Intelligent scheduling considering timing, constraints, and preferences</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🗺️</div>
              <h4>Multi-Layer Maps</h4>
              <p>Visualize crime safety and heat exposure data on interactive maps</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h4>Real-Time Updates</h4>
              <p>Live data integration for the most current information</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="welcome-footer">
          <p>© 2026 Whaletail • AI-Powered Travel Planning</p>
        </footer>
      </div>
    </div>
  );
}
