// Sample itinerary data for Los Angeles
// This would typically come from the backend API

export const sampleItinerary = {
  id: 'sample-la-trip-001',
  name: 'LA Highlights - Safe Route',
  date: '2026-01-15',
  destinations: [
    {
      id: 'dest-1',
      name: 'Santa Monica Pier',
      location: { lng: -118.4967, lat: 34.0095 },
      time: '09:00',
      duration: 120,
      type: 'must_visit',
      description: 'Iconic pier with amusement park and beach access',
      safetyScore: 9.2,
      heatScore: 3.5
    },
    {
      id: 'dest-2',
      name: 'Getty Center',
      location: { lng: -118.4745, lat: 34.0780 },
      time: '12:00',
      duration: 180,
      type: 'flexible',
      description: 'World-class art museum with stunning architecture',
      safetyScore: 9.8,
      heatScore: 4.0
    },
    {
      id: 'dest-3',
      name: 'Griffith Observatory',
      location: { lng: -118.3004, lat: 34.1184 },
      time: '16:00',
      duration: 120,
      type: 'must_visit',
      description: 'Planetarium with panoramic city views',
      safetyScore: 8.5,
      heatScore: 6.2
    },
    {
      id: 'dest-4',
      name: 'The Grove',
      location: { lng: -118.3565, lat: 34.0720 },
      time: '19:00',
      duration: 90,
      type: 'flexible',
      description: 'Outdoor shopping and dining complex',
      safetyScore: 9.0,
      heatScore: 5.5
    }
  ],
  route: {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-118.4967, 34.0095],  // Santa Monica Pier
        [-118.4745, 34.0780],  // Getty Center
        [-118.3004, 34.1184],  // Griffith Observatory
        [-118.3565, 34.0720]   // The Grove
      ]
    },
    properties: {
      totalDistance: 45.2,
      estimatedTime: 90,
      safetyRating: 'high'
    }
  },
  metadata: {
    totalDuration: 510,
    overallSafetyScore: 9.1,
    averageHeatExposure: 4.8,
    optimizedFor: ['safety', 'scenic_routes']
  }
};

export const alternativeRoutes = [
  {
    id: 'route-fastest',
    name: 'Fastest Route',
    estimatedTime: 65,
    safetyScore: 7.5,
    coordinates: [
      [-118.4967, 34.0095],
      [-118.3565, 34.0720],
      [-118.3004, 34.1184],
      [-118.4745, 34.0780]
    ]
  },
  {
    id: 'route-safest',
    name: 'Safest Route (Current)',
    estimatedTime: 90,
    safetyScore: 9.1,
    coordinates: [
      [-118.4967, 34.0095],
      [-118.4745, 34.0780],
      [-118.3004, 34.1184],
      [-118.3565, 34.0720]
    ]
  },
  {
    id: 'route-coolest',
    name: 'Coolest Route',
    estimatedTime: 85,
    heatScore: 3.5,
    coordinates: [
      [-118.4967, 34.0095],
      [-118.4912, 34.0245],
      [-118.4745, 34.0780],
      [-118.3565, 34.0720]
    ]
  }
];
