import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import MoodMap from "../components/MoodMap";
import { getPins, savePin, unsavePin } from "../api/pins";

import { getRecommendations } from "../api/recommendations";
import MoodieButton from "../components/MoodieButton";
import MoodInputModal from "../components/MoodInputModal";
import PlaceCard from "../components/PlaceCard";

const DEFAULT_CENTER = [40.7128, -74.006];
const radiusOptions = [1, 5, 10, 25, 50, 100];

function distanceInMiles(from, to) {
  if (!from || !to) {
    return null;
  }

  const [lat1, lon1] = from.map(Number);
  const [lat2, lon2] = to.map(Number);

  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon2)
  ) {
    return null;
  }

  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function zoomForRadius(radiusMiles) {
  if (radiusMiles <= 1) return 14;
  if (radiusMiles <= 5) return 12;
  if (radiusMiles <= 10) return 11;
  if (radiusMiles <= 25) return 10;
  if (radiusMiles <= 50) return 9;
  return 8;
}

const moods = [
  {
    name: "Calm",
    emoji: "😌",
    soft: "#E7F6FF",
    ink: "#2878C7",
    glow: "rgba(40,120,199,0.22)",
  },
  {
    name: "Creative",
    emoji: "🎨",
    soft: "#F0E8FF",
    ink: "#7450D8",
    glow: "rgba(116,80,216,0.24)",
  },
  {
    name: "Fun",
    emoji: "😄",
    soft: "#FFF3CF",
    ink: "#B77900",
    glow: "rgba(183,121,0,0.22)",
  },
  {
    name: "Energetic",
    emoji: "⚡",
    soft: "#FFEAD6",
    ink: "#D96800",
    glow: "rgba(217,104,0,0.24)",
  },
  {
    name: "Romantic",
    emoji: "❤️",
    soft: "#FFE4EC",
    ink: "#D83D66",
    glow: "rgba(216,61,102,0.22)",
  },
  {
    name: "Focused",
    emoji: "🌿",
    soft: "#E4F8EA",
    ink: "#2C8F4C",
    glow: "rgba(44,143,76,0.22)",
  },
  {
    name: "Inspiring",
    emoji: "✨",
    soft: "#F4ECFF",
    ink: "#8656D8",
    glow: "rgba(134,86,216,0.23)",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4.5 w-4.5"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 4.75h11v15l-5.5-3.15-5.5 3.15v-15Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoodFilterBar({ selectedMood, onSelectMood }) {
  return (
    <div className="mood-filter-control min-w-0 overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2 md:w-full md:min-w-0 md:justify-between">
        <button
          type="button"
          onClick={() => onSelectMood("All")}
          className={`flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-black transition ${
            selectedMood === "All"
              ? "border-[#161616] bg-[#161616] text-white shadow-md"
              : "border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] text-[#161616] hover:bg-[#F7F3EE]"
          }`}
        >
          <span>🌎</span>
          <span>All</span>
        </button>

        {moods.map((mood) => {
          const isSelected = selectedMood === mood.name;

          return (
            <button
              key={mood.name}
              type="button"
              onClick={() =>
                onSelectMood(
                  isSelected ? "All" : mood.name
                )
              }
              className="flex items-center gap-1 rounded-full border px-3 py-2 text-xs font-black transition"
              style={{
                background: isSelected
                  ? mood.soft
                  : "#FFFDFC",
                borderColor: isSelected
                  ? mood.ink
                  : "rgba(22,22,22,0.08)",
                color: mood.ink,
                boxShadow: isSelected
                  ? `0 8px 20px ${mood.glow}`
                  : "none",
              }}
            >
              <span>{mood.emoji}</span>
              <span>{mood.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NearbyPlaceCard({ place, onToggleSaved, onSelectPlace }) {
  const moodName = place.mood || "Calm";

  const mood =
    moods.find(
      (item) =>
        item.name.toLowerCase() ===
        moodName.toLowerCase()
    ) || moods[0];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelectPlace(place)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelectPlace(place);
        }
      }}
      className="group flex cursor-pointer gap-3 rounded-3xl p-2.5 transition duration-200 hover:-translate-y-1 hover:bg-[#F7F3EE] hover:shadow-[0_14px_30px_rgba(22,22,22,0.09)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(180,35,44,0.16)]"
    >
      <div className="flex h-[82px] w-[96px] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F7F3EE] ring-1 ring-black/5">
        {place.image ? (
          <img
            src={place.image}
            alt={place.locationName}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          />
        ) : (
          <span className="text-3xl">
            {mood.emoji}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-black text-[#161616]">
            {place.locationName}
          </h3>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleSaved(place);
            }}
            className="cursor-pointer text-[#6F6A66] transition duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-[#B4232C]"
            aria-label={`${place.isSaved ? "Remove saved" : "Save"} ${place.locationName}`}
          >
            {place.isSaved ? "♥" : <SaveIcon />}
          </button>
        </div>

        <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-5 text-[#6F6A66]">
          {place.description ||
            "A place shared by the Mood Map community."}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-black"
            style={{
              background: mood.soft,
              color: mood.ink,
            }}
          >
            {mood.emoji} {place.mood}
          </span>

          {place.createdAt && (
            <span className="shrink-0 text-[11px] font-bold text-[#6F6A66]">
              {new Date(
                place.createdAt
              ).toLocaleDateString()}
            </span>
          )}
        </div>

        {place.user?.username && (
          <p className="mt-2 text-[11px] font-bold text-[#6F6A66]">
            @{place.user.username}
          </p>
        )}
      </div>
    </article>
  );
}

function MapPanel({
  pins,
  isAddingPin,
  onStartAddingPin,
  onLocationSelected,
  refreshKey,
  focusPin,
  aiPins,
  onSelectPlace,
  mapCenter,
  mapZoom,
  userLocation,
  radiusMiles,
  onToggleSaved,
}) {
  return (
    <div className="map-panel-frame relative min-h-[410px] overflow-hidden rounded-[24px] border border-[#D9D4CE] bg-[#EDE7DF] shadow-[0_20px_48px_rgba(22,22,22,0.12)] transition duration-300 hover:shadow-[0_24px_56px_rgba(22,22,22,0.15)] sm:min-h-[470px] lg:h-full lg:min-h-[520px]">
      <MoodMap
        pins={pins}
        isAddingPin={isAddingPin}
        onStartAddingPin={onStartAddingPin}
        onLocationSelected={onLocationSelected}
        refreshKey={refreshKey}
        focusPin={focusPin}
        aiPins={aiPins}
        onSelectPlace={onSelectPlace}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        userLocation={userLocation}
        radiusMiles={radiusMiles}
        onToggleSaved={onToggleSaved}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,238,0.18),transparent_30%,rgba(22,22,22,0.08))]" />

      <div className="absolute left-4 top-4 z-10 rounded-full border border-[#D9D4CE] bg-[#FFFDFC]/92 px-3 py-2 shadow-[0_12px_28px_rgba(22,22,22,0.10)] backdrop-blur">
        <p className="text-xs font-black text-[#161616]">
          {userLocation ? "Your area" : "New York City, NY"}
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const routeLocation = useLocation();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
  } = useAuth0();

  const routeCreatedPin =
    routeLocation.state?.createdPin || null;

  const mapSectionRef = useRef(null);

  const [isAddingPin, setIsAddingPin] =
    useState(false);

  const [selectedMood, setSelectedMood] =
    useState("All");

  const [pins, setPins] = useState([]);
  const [savingPinId, setSavingPinId] =
    useState(null);

  const [mapCenter, setMapCenter] =
    useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(13);
  const [userLocation, setUserLocation] =
    useState(null);
  const [radiusMiles, setRadiusMiles] =
    useState(10);
  const [focusedPin, setFocusedPin] =
    useState(routeCreatedPin);

  const [recommendations, setRecommendations] =
    useState([]);

  const [keywords, setKeywords] = useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState(null);

  const [selectedAIPlace, setSelectedAIPlace] =
    useState(null);

  const [isMoodieOpen, setIsMoodieOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        setUserLocation(nextLocation);
        setMapCenter(nextLocation);
        setMapZoom(zoomForRadius(radiusMiles));
      },
      () => {
        setUserLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, []);

  useEffect(() => {
    async function loadPins() {
      try {
        if (isAuth0Loading) {
          return;
        }

        let token;

        if (isAuthenticated) {
          token = await getAccessTokenSilently();
        }

        const data = await getPins(token);

        setPins(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Could not load pins:",
          error
        );

        setPins([]);
      }
    }

    loadPins();
  }, [
    isAuthenticated,
    isAuth0Loading,
    getAccessTokenSilently,
  ]);

  const visiblePins = pins.filter((pin) => {
    const matchesMood =
      selectedMood === "All" ||
      pin.mood?.toLowerCase() ===
        selectedMood.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      pin.locationName
        ?.toLowerCase()
        .includes(
          searchQuery.toLowerCase()
        );

    const distanceFromUser = distanceInMiles(userLocation, [
      pin.latitude,
      pin.longitude,
    ]);

    const matchesRadius =
      !userLocation ||
      distanceFromUser === null ||
      distanceFromUser <= radiusMiles;

    return matchesMood && matchesSearch && matchesRadius;
  });

  useEffect(() => {
    if (
      recommendations.length > 0 &&
      !isLoading
    ) {
      setIsMoodieOpen(false);
    }
  }, [recommendations, isLoading]);

  useEffect(() => {
    if (!routeCreatedPin) {
      return;
    }

    mapSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setFocusedPin(routeCreatedPin);
  }, [routeCreatedPin]);

  function startAddingPin() {
    setIsAddingPin(true);

    mapSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleLocationSelect(location) {
    setIsAddingPin(false);

    navigate("/create-pin", {
      state: location,
    });
  }

  function handleSelectNearbyPin(pin) {
    setFocusedPin(pin);
    setMapCenter([Number(pin.latitude), Number(pin.longitude)]);
    setMapZoom(15);

    mapSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleRadiusChange(event) {
    const nextRadius = Number(event.target.value);

    setRadiusMiles(nextRadius);
    setMapZoom(zoomForRadius(nextRadius));

    if (userLocation) {
      setMapCenter(userLocation);
    }
  }

  async function handleToggleSaved(pin) {
    if (!pin?.id || savingPinId) {
      return;
    }

    setSavingPinId(pin.id);

    try {
      let token;

      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }

      if (pin.isSaved) {
        await unsavePin(pin.id, token);
      } else {
        await savePin(pin.id, token);
      }

      setPins((currentPins) =>
        currentPins.map((currentPin) =>
          currentPin.id === pin.id
            ? { ...currentPin, isSaved: !pin.isSaved }
            : currentPin,
        ),
      );
    } catch (error) {
      console.error("Could not update saved pin:", error);
      setError(error.message || "Could not update saved pin.");
    } finally {
      setSavingPinId(null);
    }
  }

  const handleFetchRecommendations = async (
    moodQuery
  ) => {
    if (!moodQuery?.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedAIPlace(null);

    try {
      const data = await getRecommendations(
        moodQuery,
        mapCenter[0],
        mapCenter[1]
      );

      const recsWithMood =
        (data.recommendations || []).map(
          (place) => ({
            ...place,
            mood: moodQuery,
          })
        );

      setRecommendations(recsWithMood);

      setKeywords(data.keywords || []);

      const first = recsWithMood[0];

      if (
        first?.location?.latitude &&
        first?.location?.longitude
      ) {
        setMapCenter([
          first.location.latitude,
          first.location.longitude,
        ]);
      }
    } catch (err) {
      setError(
        err.message ||
          "Failed to fetch recommendations."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative w-full">
      <section
        ref={mapSectionRef}
        className="mx-auto flex w-full max-w-[1520px] animate-[soft-page-in_280ms_ease-out_both] flex-col px-3 pb-8 pt-4 sm:px-5 lg:min-h-[calc(100vh-64px)] lg:px-8"
      >
        {keywords.length > 0 &&
          !isLoading && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6F6A66]">
                Moodie Keywords:
              </span>

              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[#E7BFC2] bg-[#F5DADB] px-2.5 py-1 text-xs font-bold text-[#7D1820]"
                >
                  🔍 "{kw}"
                </span>
              ))}
            </div>
          )}

        {error && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">
            ⚠️ {error}
          </div>
        )}

        <div className="explore-toolbar mb-4 rounded-[22px] border border-[rgba(22,22,22,0.07)] bg-white/78 px-3 py-3 shadow-[0_10px_28px_rgba(22,22,22,0.055)] backdrop-blur">
          <div className="grid items-center gap-2 lg:grid-cols-[minmax(240px,400px)_142px_minmax(320px,1fr)]">
            <label className="explore-search-control group flex h-[46px] min-w-0 items-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] px-3 shadow-[0_8px_20px_rgba(22,22,22,0.045)] transition duration-200 focus-within:border-[rgba(180,35,44,0.35)] focus-within:shadow-[0_12px_28px_rgba(180,35,44,0.1)] focus-within:ring-4 focus-within:ring-[rgba(180,35,44,0.10)]">
              <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EE] text-[#161616] transition group-focus-within:text-[#B4232C]">
                <SearchIcon />
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Find a place"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#161616] outline-none placeholder:text-[#6F6A66]"
              />
            </label>

            <label className="explore-radius-control flex h-[46px] items-center gap-2 rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] px-3 shadow-[0_8px_20px_rgba(22,22,22,0.045)]">
              <span className="text-xs font-black uppercase tracking-wider text-[#6F6A66]">
                Rad.
              </span>
              <select
                value={radiusMiles}
                onChange={handleRadiusChange}
                className="min-w-0 flex-1 bg-transparent text-sm font-black text-[#161616] outline-none"
              >
                {radiusOptions.map((radius) => (
                  <option key={radius} value={radius}>
                    {radius} mi
                  </option>
                ))}
              </select>
            </label>

            <MoodFilterBar
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="flex min-h-[340px] flex-col rounded-[28px] border border-[#D9D4CE] bg-[#FFFDFC] p-4 shadow-[0_18px_42px_rgba(22,22,22,0.08)] transition duration-300 hover:shadow-[0_22px_52px_rgba(22,22,22,0.1)] lg:max-h-[600px] lg:min-h-[560px]">
            <div className="mb-3 px-1">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="m-0 text-xl font-black tracking-normal text-[#161616]">
                    Nearby Mood Pins
                  </h2>

                  <p className="mt-0.5 text-sm font-semibold text-[#6F6A66]">
                    New York City area
                  </p>
                </div>

                {selectedMood !== "All" && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMood("All")
                    }
                    className="rounded-full bg-[#F7F3EE] px-3 py-1.5 text-xs font-black text-[#B4232C]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs font-bold text-[#6F6A66]">
              {visiblePins.length}{" "}
                {visiblePins.length === 1
                  ? "pin"
                  : "pins"}{" "}
                found
                {userLocation ? ` within ${radiusMiles} mi` : ""}
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {visiblePins.length > 0 ? (
                visiblePins.map((pin) => (
                  <NearbyPlaceCard
                    key={pin.id}
                    place={pin}
                    onToggleSaved={handleToggleSaved}
                    onSelectPlace={handleSelectNearbyPin}
                  />
                ))
              ) : (
                <div className="flex min-h-[220px] items-center justify-center px-4 text-center">
                  <div>
                    <div className="mb-3 text-4xl">
                      📍
                    </div>

                    <p className="text-sm font-black text-[#161616]">
                      No mood pins found
                    </p>

                    <p className="mt-1 text-xs font-semibold text-[#6F6A66]">
                      Try another mood or clear
                      the filter.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>

          <div className="relative h-full">
            <MapPanel
              pins={visiblePins}
              isAddingPin={isAddingPin}
              onStartAddingPin={startAddingPin}
              onLocationSelected={
                handleLocationSelect
              }
              refreshKey={
                routeCreatedPin?.id || 0
              }
              focusPin={focusedPin}
              aiPins={recommendations}
              onSelectPlace={(place) =>
                setSelectedAIPlace(place)
              }
              mapCenter={mapCenter}
              mapZoom={mapZoom}
              userLocation={userLocation}
              radiusMiles={radiusMiles}
              onToggleSaved={handleToggleSaved}
            />

            {selectedAIPlace &&
              !isLoading && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "20px",
                    zIndex: 1000,
                  }}
                >
                  <PlaceCard
                    place={selectedAIPlace}
                    onClose={() =>
                      setSelectedAIPlace(null)
                    }
                  />
                </div>
              )}
          </div>
        </div>
      </section>

      <MoodieButton
        onClick={() => setIsMoodieOpen(true)}
      />

      <MoodInputModal
        isOpen={isMoodieOpen}
        onClose={() =>
          !isLoading &&
          setIsMoodieOpen(false)
        }
        onSubmit={handleFetchRecommendations}
        isLoading={isLoading}
      />
    </main>
  );
}
