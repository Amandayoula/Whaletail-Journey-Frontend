# Whaletail Map - Quick Start Guide

## 5-Minute Setup

### 1. Get Mapbox Token (FREE)
1. Go to https://account.mapbox.com/
2. Sign up for a free account
3. Go to "Access Tokens" page
4. Copy your default public token (starts with `pk.`)

### 2. Setup Project
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and paste your Mapbox token
# VITE_MAPBOX_TOKEN=pk.your_actual_token_here
```

### 3. Run
```bash
npm run dev
```

Visit http://localhost:3000 🎉

## What You'll See

### Map Controls (Top Left)
- 🗺️ **Base Map** - Standard view
- 🚨 **Crime Safety** - Red = dangerous, Green = safe
- 🌡️ **Heat Exposure** - Red = hot, Blue = cool

### Itinerary Panel (Top Right)
- Sample LA trip with 4 destinations
- Click destinations to fly to location
- Shows safety and heat scores

### Interactive Features
- **Click markers** - See detailed popup
- **Switch layers** - See different data overlays
- **Pan & Zoom** - Explore Los Angeles

## Common Issues

### "Invalid Token" Error
- Make sure your `.env` file has the correct token
- Token should start with `pk.`
- Restart dev server after changing `.env`

### Map Not Loading
- Check browser console for errors
- Ensure you have internet connection (Mapbox tiles require internet)
- Try clearing browser cache

### Port 3000 Already in Use
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

## Next Steps

### Connect to Backend API
1. Ensure Whaletail backend is running at `http://localhost:8000`
2. Update `VITE_API_BASE_URL` in `.env`
3. Modify components to use real API:
   ```javascript
   import { whaletailAPI } from './services/api';
   const data = await whaletailAPI.generateItinerary(request);
   ```

### Customize Data
- Edit `src/data/crimeData.js` for crime hotspots
- Edit `src/data/heatData.js` for temperature zones
- Edit `src/data/sampleItinerary.js` for demo routes

### Deploy
```bash
# Build for production
npm run build

# Deploy 'dist' folder to:
# - Vercel: vercel --prod
# - Netlify: netlify deploy --prod
# - AWS S3: aws s3 sync dist/ s3://your-bucket
```

## Tips for Portfolio

### Showcase Points
- Modern React architecture with hooks
- Real-time data visualization with heatmaps
- GIS data integration capabilities
- API-ready architecture for backend integration
- Professional UI/UX design

### Demo Talking Points
- "This map switches between safety and heat layers in real-time"
- "The heatmap uses crime statistics to show risk zones"
- "Routes are optimized for safety, not just speed"
- "Architecture supports easy integration with any GIS data source"
- "Built with production-ready tools: React, Vite, Mapbox GL"

## Resources

- **Mapbox Docs**: https://docs.mapbox.com/mapbox-gl-js/
- **React Map GL**: https://visgl.github.io/react-map-gl/
- **Vite Guide**: https://vitejs.dev/guide/

---

**Need help?** Check the main README.md for detailed documentation.
