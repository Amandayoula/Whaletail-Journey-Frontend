/**
 * App Context - Global State Management
 * 管理选中的places、约束、生成的行程等
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Selected places with constraints
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  
  // Generated itinerary from backend
  const [itinerary, setItinerary] = useState(null);
  
  // Loading states
  const [isPlanning, setIsPlanning] = useState(false);
  
  // Chat messages
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your Whaletail AI assistant 🐋\n\nSelect places you'd like to visit, and I'll create an optimized itinerary for you with safe routes!",
      timestamp: new Date().toISOString()
    }
  ]);

  /**
   * Toggle place selection
   */
  const togglePlace = useCallback((place) => {
    setSelectedPlaces(prev => {
      const exists = prev.find(p => p.id === place.id);
      
      if (exists) {
        // Remove
        return prev.filter(p => p.id !== place.id);
      } else {
        // Add with default constraint
        return [...prev, {
          ...place,
          constraint: place.defaultConstraint || 'flexible',
          fixedTime: place.fixedTime || null
        }];
      }
    });
  }, []);

  /**
   * Update place constraint
   */
  const updatePlaceConstraint = useCallback((placeId, constraint, fixedTime = null) => {
    setSelectedPlaces(prev => 
      prev.map(p => 
        p.id === placeId 
          ? { ...p, constraint, fixedTime } 
          : p
      )
    );
  }, []);

  /**
   * Remove place
   */
  const removePlace = useCallback((placeId) => {
    setSelectedPlaces(prev => prev.filter(p => p.id !== placeId));
  }, []);

  /**
   * Clear all selections
   */
  const clearSelections = useCallback(() => {
    setSelectedPlaces([]);
    setItinerary(null);
  }, []);

  /**
   * Add chat message
   */
  const addChatMessage = useCallback((role, content) => {
    setChatMessages(prev => [...prev, {
      role,
      content,
      timestamp: new Date().toISOString()
    }]);
  }, []);

  /**
   * Clear chat
   */
  const clearChat = useCallback(() => {
    setChatMessages([{
      role: 'assistant',
      content: "Chat cleared. How can I help you plan your trip?",
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const value = {
    // State
    selectedPlaces,
    itinerary,
    isPlanning,
    chatMessages,
    
    // Actions
    togglePlace,
    updatePlaceConstraint,
    removePlace,
    clearSelections,
    setItinerary,
    setIsPlanning,
    addChatMessage,
    clearChat
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
