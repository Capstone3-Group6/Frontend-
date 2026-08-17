import { useEffect } from "react";
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

// Added by Musaddik — Standard Leaflet-style red pin icon
const redLeafletIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const moodData = {
  Happy: { label: "Happy", face: "😄", color: "#D99A00" },
  Fun: { label: "Fun", face: "😄", color: "#D99A00" },
  Calm: { label: "Calm", face: "😌", color: "#2878C7" },
  Creative: { label: "Creative", face: "🎨", color: "#7450D8" },
  Energetic: { label: "Energetic", face: "⚡", color: "#F07A18" },
  Romantic: { label: "Romantic", face: "❤️", color: "#D83D66" },
  Focused: { label: "Focused", face: "🌿", color: "#2C8F4C" },
  Inspiring: { label: "Inspiring", face: "✨", color: "#8656D8" },
};

const fallbackPinImage =
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80";

function createMoodIcon(mood) {
  const selectedMood = moodData[mood] || moodData.Happy;

  return L.divIcon({
    className: "mood-marker-wrapper",
    html: `
      <div class="mood-marker-item">
        <div class="mood-marker" style="--marker-color: ${selectedMood.color}">
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
    if (!Number.isFinite(pin?.latitude) || !Number.isFinite(pin?.longitude)) {
      return;
    }

    map.flyTo([pin.latitude, pin.longitude], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    });
  }, [map, pin]);

  return null;
}

// Added by Musaddik — RecenterMap hook
function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (
      center &&
      Array.isArray(center) &&
      center.length === 2 &&
      Number.isFinite(center[0]) &&
      Number.isFinite(center[1])
    ) {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }
  }, [center, map]);

  return null;
}

export default function MoodMap({
  // NEW: real pins come from the parent
  pins = [],

  isAddingPin = false,
  onStartAddingPin,
  onLocationSelected,
  refreshKey = 0,
  focusPin = null,

  // Partner's AI functionality stays
  aiPins = [],
  aiPlaces = [],
  onSelectPlace,
  onAiPlaceSelect,

  mapCenter = [40.7128, -74.006],
}) {
  const center = mapCenter || [40.7128, -74.006];

  function handleLocationSelect(location) {
    if (onLocationSelected) {
      onLocationSelected(location);
    }
  }

  const effectiveAiPins = aiPins.length > 0 ? aiPins : aiPlaces;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        dragging
        scrollWheelZoom={false}
        doubleClickZoom
        zoomControl
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={center} />

        <LocationPicker
          enabled={isAddingPin}
          onLocationSelect={handleLocationSelect}
        />

        <FocusCreatedPin pin={focusPin} />

        {/* REAL DATABASE PINS */}
        {pins
          .filter(
            (pin) =>
              Number.isFinite(Number(pin?.latitude)) &&
              Number.isFinite(Number(pin?.longitude)),
          )
          .map((pin) => {
            const mood = moodData[pin.mood] || moodData.Happy;

            const pinImage =
              pin.image || pin.photoPreview || pin.imageUrl || fallbackPinImage;

            return (
              <Marker
                key={pin.id}
                position={[Number(pin.latitude), Number(pin.longitude)]}
                icon={createMoodIcon(pin.mood)}
              >
                <Tooltip
                  direction="top"
                  offset={[0, -45]}
                  opacity={1}
                  className="mood-hover-tooltip"
                >
                  <div className="mood-tooltip-card flex w-[230px] items-center gap-3 rounded-2xl bg-white p-2 shadow-[0_18px_42px_rgba(22,22,22,0.18)]">
                    <img
                      src={pinImage}
                      alt={pin.placeName}
                      className="h-14 w-16 rounded-xl object-cover"
                      onError={(event) => {
                        event.currentTarget.src = fallbackPinImage;
                      }}
                    />

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
                          {pin.username}
                        </span>
                      </div>
                    </div>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="w-[240px]">
                    <img
                      src={pinImage}
                      alt={pin.placeName}
                      className="h-28 w-full rounded-xl object-cover"
                      onError={(event) => {
                        event.currentTarget.src = fallbackPinImage;
                      }}
                    />

                    <div className="mt-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="inline-flex rounded-full bg-[#F5DADB] px-2 py-1 text-[11px] font-semibold text-[#7D1820]">
                            {mood.face} {pin.mood}
                          </span>

                          <h3 className="mt-2 text-base font-bold text-[#161616]">
                            {pin.locationName}
                            
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
                            {pin.username}
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

        {/* Added by Musaddik — AI recommended locations */}
        {effectiveAiPins.map((place, index) => {
          const lat = Number(place.location?.latitude ?? place.lat);

          const lng = Number(place.location?.longitude ?? place.lng);

          const name = place.displayName?.text || place.name || "Moodie place";

          if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return null;
          }

          return (
            <Marker
              key={place.id || `${name}-${lat}-${lng}`}
              position={[lat, lng]}
              icon={redLeafletIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectPlace) {
                    onSelectPlace(place);
                  }

                  if (onAiPlaceSelect) {
                    onAiPlaceSelect(place);
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -38]} opacity={1}>
                <div className="ai-place-tooltip">
                  <strong>
                    {index + 1}. {name}
                  </strong>

                  {place.rating && (
                    <em>
                      ★ {place.rating}{" "}
                      {place.userRatingCount
                        ? `(${place.userRatingCount})`
                        : ""}
                    </em>
                  )}

                  <span>✨ Moodie recommendation</span>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      <button
        type="button"
        onClick={onStartAddingPin}
        className="absolute right-4 top-4 z-[1000] rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-[length:140%_100%] px-5 py-3 text-sm font-black text-white shadow-[0_16px_34px_rgba(219,39,119,0.28)] transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[position:100%_0] hover:shadow-[0_20px_44px_rgba(219,39,119,0.34)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-pink-400/25 sm:right-6 sm:top-5 sm:px-6"
      >
        + Add Mood Pin
      </button>

      {isAddingPin && (
        <div className="location-pick-pill absolute left-1/2 top-20 z-[1000] w-[min(92%,390px)] -translate-x-1/2 rounded-full bg-[#161616] px-5 py-3 text-center text-sm font-bold text-white shadow-[0_18px_40px_rgba(22,22,22,0.26)] sm:top-5">
          📍 Click anywhere on the map to choose a location
        </div>
      )}
    </div>
  );
}
