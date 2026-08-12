import { useState, useEffect } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from 'react-leaflet';

// Added by Musaddik
// Custom red pin generator for AI-generated recommendations
const createRedAIPinIcon = () => {
  return L.divIcon({
    className: 'ai-marker-wrapper',
    html: `
      <div class="ai-marker-item" style="display: flex; flex-direction: column; align-items: center;">
        <div class="ai-marker" style="background-color: #B4232C; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2.5px solid #FFFDFC; box-shadow: 0 6px 16px rgba(180,35,44,0.3);">
          <div style="transform: rotate(45deg); font-size: 13px; margin-bottom: 2px; color: white;">✨</div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
};

const createMoodIcon = (mood) => {
  const moodData = {
    Happy: { label: 'Happy', face: '😊' },
    Calm: { label: 'Calm', face: '😌' },
    Creative: { label: 'Creative', face: '🎨' },
    Energetic: { label: 'Energetic', face: '⚡' },
    Romantic: { label: 'Romantic', face: '❤️' },
    Focused: { label: 'Focused', face: '🌿' },
    Inspiring: { label: 'Inspiring', face: '✨' },
  };

  const selectedMood = moodData[mood] || moodData.Happy;

  return L.divIcon({
    className: 'mood-marker-wrapper',
    html: `
      <div class="mood-marker-item">
        <div class="mood-marker">
          <div class="mood-face mood-face-icon">
            ${selectedMood.face}
          </div>
        </div>
        <span class="mood-marker-label">
          ${selectedMood.label}
        </span>
      </div>
    `,
    iconSize: [60, 75],
    iconAnchor: [30, 54],
    popupAnchor: [0, -52],
  });
};

function AddMarker({ setPins }) {
  useMapEvents({
    click(e) {
      const newPin = {
        id: Date.now(),
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        placeName: 'New Mood Place',
        mood: 'Happy',
        description: 'A new mood pin added from the map.',
        username: '@samiallo',
        image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      };
      setPins((currentPins) => [...currentPins, newPin]);
    },
  });
  return null;
}

// Added by Musaddik
// Smoothly pans Leaflet map when mapCenter coordinates change
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

// Added by Musaddik
// Enhanced MoodMap to accept dynamic recommendations and trigger callbacks
export default function MoodMap({ aiPins = [], onSelectPlace, mapCenter = [40.7128, -74.006] }) {
  const [pins, setPins] = useState([
    {
      id: 1,
      lat: 40.7128,
      lng: -74.006,
      placeName: 'Mood Map Test Place',
      mood: 'Happy',
      description: 'A fun place with good energy and a positive atmosphere.',
      username: '@samiallo',
      image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 2,
      lat: 40.7228,
      lng: -74.016,
      placeName: 'Quiet Waterfront',
      mood: 'Calm',
      description: 'A peaceful waterfront spot where you can relax and reset.',
      username: '@maya',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 3,
      lat: 40.7028,
      lng: -73.996,
      placeName: 'Creative Corner',
      mood: 'Creative',
      description: 'Street art, interesting people, and creative energy everywhere.',
      username: '@leo',
      image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 4,
      lat: 40.732,
      lng: -73.995,
      placeName: 'Energy Square',
      mood: 'Energetic',
      description: 'Busy streets, music, movement, and nonstop energy.',
      username: '@alex',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 5,
      lat: 40.715,
      lng: -73.985,
      placeName: 'Romantic View',
      mood: 'Romantic',
      description: 'A warm and beautiful place for an evening walk.',
      username: '@sofia',
      image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 6,
      lat: 40.74,
      lng: -74.005,
      placeName: 'Focus Café',
      mood: 'Focused',
      description: 'Quiet tables, good coffee, and a perfect atmosphere for studying.',
      username: '@daniel',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: 7,
      lat: 40.725,
      lng: -73.975,
      placeName: 'Inspiring View',
      mood: 'Inspiring',
      description: 'A beautiful city view that makes you want to create something.',
      username: '@nina',
      image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=600&q=80',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80',
    },
  ]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      dragging={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      zoomControl={true}
      className='h-full w-full'
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* Added by Musaddik — recenter helper */}
      <RecenterMap center={mapCenter} />

      <AddMarker setPins={setPins} />

      {/* Render Sami's custom mood markers */}
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createMoodIcon(pin.mood)}
        />
      ))}

      {/* Added by Musaddik — render AI recommended locations as separate red pins */}
      {aiPins.map((place) => {
        if (!place.location?.latitude || !place.location?.longitude) return null;
        return (
          <Marker
            key={place.id}
            position={[place.location.latitude, place.location.longitude]}
            icon={createRedAIPinIcon()}
            eventHandlers={{
              click: () => {
                if (onSelectPlace) onSelectPlace(place);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
}