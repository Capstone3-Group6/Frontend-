import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getPins } from "../api/pins";

const moodData = {
  Happy: { label: "Happy", face: "😄" },
  Fun: { label: "Fun", face: "😄" },
  Calm: { label: "Calm", face: "😌" },
  Creative: { label: "Creative", face: "🎨" },
  Energetic: { label: "Energetic", face: "⚡" },
  Romantic: { label: "Romantic", face: "❤️" },
  Focused: { label: "Focused", face: "🌿" },
  Inspiring: { label: "Inspiring", face: "✨" },
};

function createMoodIcon(mood) {
  const selectedMood = moodData[mood] || moodData.Happy;

  return L.divIcon({
    className: "mood-marker-wrapper",
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
}

function LocationPicker({ enabled, onLocationSelect }) {
  useMapEvents({
    click(event) {
      if (!enabled) return;

      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function FocusCreatedPin({ pin }) {
  const map = useMap();

  useEffect(() => {
    if (!pin) return;

    const lat = Number(pin.latitude ?? pin.lat);
    const lng = Number(pin.longitude ?? pin.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    });
  }, [map, pin]);

  return null;
}

export default function MoodMap({
  isAddingPin = false,
  onStartAddingPin,
  onLocationSelected,
  refreshKey = 0,
  focusPin = null,
}) {
  const center = [40.7128, -74.006];

  const [pins, setPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPins() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getPins();

      setPins(data);
    } catch (error) {
      console.error("Failed to load pins:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Load pins when the map first opens.
  useEffect(() => {
    loadPins();
  }, []);

  // Reload pins whenever a new pin is created.
  useEffect(() => {
    if (!refreshKey) return;

    loadPins();
  }, [refreshKey]);

  function handleLocationSelect(location) {
    if (onLocationSelected) {
      onLocationSelected(location);
    }
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        dragging
        scrollWheelZoom
        doubleClickZoom
        zoomControl
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationPicker
          enabled={isAddingPin}
          onLocationSelect={handleLocationSelect}
        />

        <FocusCreatedPin pin={focusPin} />

        {pins.map((pin) => {
          const mood = moodData[pin.mood] || moodData.Happy;

          const latitude = Number(pin.latitude ?? pin.lat);
          const longitude = Number(pin.longitude ?? pin.lng);

          if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
          ) {
            return null;
          }

          return (
            <Marker
              key={pin.id}
              position={[latitude, longitude]}
              icon={createMoodIcon(pin.mood)}
            >
              <Tooltip
                direction="top"
                offset={[0, -45]}
                opacity={1}
                className="mood-hover-tooltip"
              >
                <div className="flex w-55 items-center gap-3 rounded-2xl bg-white p-2 shadow-xl">
                  {pin.image && (
                    <img
                      src={pin.image}
                      alt={pin.placeName}
                      className="h-14 w-16 rounded-xl object-cover"
                    />
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#161616]">
                      {pin.placeName}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#B4232C]">
                      {mood.face} {pin.mood}
                    </p>

                    <div className="mt-1 flex items-center gap-1">
                      {pin.avatar && (
                        <img
                          src={pin.avatar}
                          alt={pin.username}
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      )}

                      <span className="truncate text-[11px] text-[#6F6A66]">
                        {pin.username || "Unknown user"}
                      </span>
                    </div>
                  </div>
                </div>
              </Tooltip>

              <Popup>
                <div className="w-60">
                  {pin.image && (
                    <img
                      src={pin.image}
                      alt={pin.placeName}
                      className="h-28 w-full rounded-xl object-cover"
                    />
                  )}

                  <div className="mt-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-flex rounded-full bg-[#F5DADB] px-2 py-1 text-[11px] font-semibold text-[#7D1820]">
                          {mood.face} {pin.mood}
                        </span>

                        <h3 className="mt-2 text-base font-bold text-[#161616]">
                          {pin.placeName}
                        </h3>
                      </div>

                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#6F6A66] transition hover:scale-110 hover:bg-[#F7F3EE] hover:text-[#B4232C]"
                        aria-label="Save place"
                      >
                        ♡
                      </button>
                    </div>

                    <p className="mt-2 text-sm leading-5 text-[#6F6A66]">
                      {pin.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {pin.avatar && (
                          <img
                            src={pin.avatar}
                            alt={pin.username}
                            className="h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                        )}

                        <span className="truncate text-xs font-semibold text-[#161616]">
                          {pin.username || "Unknown user"}
                        </span>
                      </div>

                      <button className="shrink-0 rounded-lg bg-[#B4232C] px-3 py-2 text-xs font-semibold text-white transition hover:scale-105 hover:bg-[#7D1820]">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <button
        type="button"
        onClick={onStartAddingPin}
        className="absolute right-6 top-5 z-[1000] rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-6 py-3 font-bold text-white shadow-xl transition hover:scale-105"
      >
        + Add Mood Pin
      </button>

      {isAddingPin && (
        <div className="absolute left-1/2 top-5 z-[1000] -translate-x-1/2 rounded-full bg-[#161616] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          📍 Click anywhere on the map to choose a location
        </div>
      )}

      {isLoading && (
        <div className="absolute bottom-5 left-5 z-[1000] rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-lg">
          Loading mood pins...
        </div>
      )}

      {error && (
        <div className="absolute bottom-5 left-5 z-[1000] rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}