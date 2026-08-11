import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRecommendations } from '../api/recommendations';

// Fix Leaflet default icon paths in Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon   from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import MoodieButton   from '../components/MoodieButton';
import MoodInputModal from '../components/MoodInputModal';
import PlaceCard      from '../components/PlaceCard';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl:       markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl:     markerShadow,
});

const DEFAULT_CENTER = [40.7128, -74.0060];

// Smoothly recenters the map when center changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13, { animate: true, duration: 1 });
  }, [center, map]);
  return null;
}

export default function HomePage() {
  const [mapCenter,       setMapCenter]       = useState(DEFAULT_CENTER);
  const [recommendations, setRecommendations] = useState([]);
  const [keywords,        setKeywords]        = useState([]);
  const [isLoading,       setIsLoading]       = useState(false);
  const [error,           setError]           = useState(null);
  const [selectedPlace,   setSelectedPlace]   = useState(null);
  const [isMoodieOpen,    setIsMoodieOpen]    = useState(false);

  // Try to get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation unavailable, defaulting to NYC.', err)
      );
    }
  }, []);

  // Close modal once recommendations arrive
  useEffect(() => {
    if (recommendations.length > 0 && !isLoading) {
      setIsMoodieOpen(false);
    }
  }, [recommendations, isLoading]);

  const handleFetchRecommendations = async (moodQuery) => {
    if (!moodQuery?.trim()) return;
    setIsLoading(true);
    setError(null);
    setSelectedPlace(null);

    try {
      const data = await getRecommendations(moodQuery, mapCenter[0], mapCenter[1]);
      setRecommendations(data.recommendations || []);
      setKeywords(data.keywords || []);

      // Recenter map around first result
      const first = data.recommendations?.[0];
      if (first?.location?.latitude && first?.location?.longitude) {
        setMapCenter([first.location.latitude, first.location.longitude]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section style={{ position: 'relative' }}>

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          marginBottom: '12px',
          padding: '10px 16px',
          borderRadius: '12px',
          background: '#FEF2F2',
          color: '#B91C1C',
          fontSize: '13px',
          border: '1px solid #FECACA',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── Gemini keyword tags (shown after recommendations) ── */}
      {keywords.length > 0 && !isLoading && (
        <div style={{
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '11px', color: '#9C8B7A', fontWeight: 600 }}>Moodie searched:</span>
          {keywords.map((kw, i) => (
            <span
              key={i}
              style={{
                background: '#F5F0FF',
                color: '#7C3AED',
                borderRadius: '999px',
                padding: '3px 10px',
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              🔍 "{kw}"
            </span>
          ))}
        </div>
      )}

      {/* ── Map wrapper ── */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            width: '100%',
            height: '580px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #EDE8E0',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          }}
        >
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RecenterMap center={mapCenter} />

            {recommendations.map((place) => {
              if (!place.location?.latitude || !place.location?.longitude) return null;
              return (
                <Marker
                  key={place.id}
                  position={[place.location.latitude, place.location.longitude]}
                  eventHandlers={{ click: () => setSelectedPlace(place) }}
                >
                  <Popup>
                    <div style={{ padding: '4px', minWidth: '140px' }}>
                      <strong style={{ fontSize: '13px', color: '#3D2C1E' }}>
                        {place.displayName?.text}
                      </strong>
                      {place.rating && (
                        <p style={{ fontSize: '12px', color: '#F59E0B', margin: '3px 0' }}>
                          ★ {place.rating}
                        </p>
                      )}
                      <p style={{ fontSize: '11px', color: '#9C8B7A', margin: 0 }}>
                        {place.formattedAddress}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* ── PlaceCard overlay (top-left of map) ── */}
        {selectedPlace && !isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 500,
            }}
          >
            <PlaceCard
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
            />
          </div>
        )}
      </div>

      {/* ── Result count ── */}
      {recommendations.length > 0 && !isLoading && (
        <p style={{ fontSize: '12px', color: '#9C8B7A', textAlign: 'right', marginTop: '8px' }}>
          {recommendations.length} unique spots found near you ✨
        </p>
      )}

      {/* ── Moodie floating corner button ── */}
      <MoodieButton onClick={() => setIsMoodieOpen(true)} />

      {/* ── Mood input modal (with loading state) ── */}
      <MoodInputModal
        isOpen={isMoodieOpen}
        onClose={() => !isLoading && setIsMoodieOpen(false)}
        onSubmit={handleFetchRecommendations}
        isLoading={isLoading}
      />
    </section>
  );
}