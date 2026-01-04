/**
 * Los Angeles Places Data - All Categories
 * 汇总所有LA数据供前端使用
 */

import { laAttractions } from './laAttractions';
import { laRestaurants } from './laRestaurants';
import { laAccommodations } from './laAccommodations';
import { laEvents } from './laEvents';

// 所有places的汇总
export const allPlaces = [
  ...laAttractions,
  ...laRestaurants,
  ...laAccommodations,
  ...laEvents
];

// 按类别分类
export const placesByCategory = {
  attraction: laAttractions,
  restaurant: laRestaurants,
  accommodation: laAccommodations,
  event: laEvents
};

// 类别元数据
export const categoryMetadata = {
  attraction: {
    label: 'Attractions',
    description: 'Museums, parks, landmarks, and must-see spots',
    icon: '📍',
    count: laAttractions.length
  },
  restaurant: {
    label: 'Restaurants',
    description: 'Dining options from casual to fine dining',
    icon: '🍽️',
    count: laRestaurants.length
  },
  accommodation: {
    label: 'Accommodations',
    description: 'Hotels, hostels, and unique stays',
    icon: '🏨',
    count: laAccommodations.length
  },
  event: {
    label: 'Events',
    description: 'Concerts, sports, shows with fixed times',
    icon: '🎭',
    count: laEvents.length
  }
};

// 工具函数：根据ID获取place
export function getPlaceById(id) {
  return allPlaces.find(place => place.id === id);
}

// 工具函数：根据类别获取places
export function getPlacesByCategory(category) {
  return placesByCategory[category] || [];
}

// 工具函数：搜索places
export function searchPlaces(query, category = null) {
  const searchIn = category ? getPlacesByCategory(category) : allPlaces;
  const lowerQuery = query.toLowerCase();
  
  return searchIn.filter(place => 
    place.name.toLowerCase().includes(lowerQuery) ||
    place.description.toLowerCase().includes(lowerQuery) ||
    place.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

// 工具函数：获取推荐places（基于rating）
export function getRecommendedPlaces(category = null, limit = 5) {
  const searchIn = category ? getPlacesByCategory(category) : allPlaces;
  
  return searchIn
    .filter(place => place.rating >= 4.5) // 高评分
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

// 工具函数：获取安全的places
export function getSafePlaces(category = null, minSafetyScore = 8.0) {
  const searchIn = category ? getPlacesByCategory(category) : allPlaces;
  
  return searchIn.filter(place => place.safetyScore >= minSafetyScore);
}

// 统计信息
export const statistics = {
  total: allPlaces.length,
  byCategory: {
    attractions: laAttractions.length,
    restaurants: laRestaurants.length,
    accommodations: laAccommodations.length,
    events: laEvents.length
  },
  averageSafetyScore: (
    allPlaces.reduce((sum, place) => sum + place.safetyScore, 0) / allPlaces.length
  ).toFixed(2),
  averageRating: (
    allPlaces.reduce((sum, place) => sum + place.rating, 0) / allPlaces.length
  ).toFixed(2)
};

export default {
  allPlaces,
  placesByCategory,
  categoryMetadata,
  getPlaceById,
  getPlacesByCategory,
  searchPlaces,
  getRecommendedPlaces,
  getSafePlaces,
  statistics
};
