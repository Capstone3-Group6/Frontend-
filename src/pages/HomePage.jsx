import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import MoodMap from '../components/MoodMap';

// Added by Musaddik — Moodie AI Assistant imports
import { getRecommendations } from '../api/recommendations';
import MoodieButton from '../components/MoodieButton';
import MoodInputModal from '../components/MoodInputModal';
import PlaceCard from '../components/PlaceCard';

const DEFAULT_CENTER = [40.7128, -74.0060];

const moods = [
  { name: 'Calm', emoji: '😌', soft: '#E7F6FF', ink: '#2878C7', glow: 'rgba(40,120,199,0.22)' },
  { name: 'Creative', emoji: '🎨', soft: '#F0E8FF', ink: '#7450D8', glow: 'rgba(116,80,216,0.24)' },
  { name: 'Fun', emoji: '😄', soft: '#FFF3CF', ink: '#B77900', glow: 'rgba(183,121,0,0.22)' },
  { name: 'Energetic', emoji: '⚡', soft: '#FFEAD6', ink: '#D96800', glow: 'rgba(217,104,0,0.24)' },
  { name: 'Romantic', emoji: '❤️', soft: '#FFE4EC', ink: '#D83D66', glow: 'rgba(216,61,102,0.22)' },
  { name: 'Focused', emoji: '🌿', soft: '#E4F8EA', ink: '#2C8F4C', glow: 'rgba(44,143,76,0.22)' },
  { name: 'Inspiring', emoji: '✨', soft: '#F4ECFF', ink: '#8656D8', glow: 'rgba(134,86,216,0.23)' },
];

const places = [
  {
    name: 'Columbia Park',
    description: 'Open field energy, pickup games, and space to move.',
    mood: '⚡ Energetic',
    user: '@samiallo',
    time: '2h ago',
    image:
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mission Murals',
    description: 'Color, culture, and creative energy on every block.',
    mood: '🎨 Creative',
    user: '@art.by.lei',
    time: '4h ago',
    image:
      'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Dolores Park',
    description: 'Sunny views, bright groups, and weekend joy.',
    mood: '😄 Fun',
    user: '@sunny.vibes',
    time: '6h ago',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Garden Steps',
    description: 'Quiet green corners for reading and resetting.',
    mood: '🌿 Focused',
    user: '@green.hour',
    time: '8h ago',
    image:
      'https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Sunset Pier',
    description: 'Golden light and a quiet spark at the edge of the city.',
    mood: '✨ Inspiring',
    user: '@goldenhour',
    time: '1d ago',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
  },
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="m20 20-4.2-4.2m1.2-5.3a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M5 7h14M8 12h8M10.5 17h3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6.5 4.75h11v15l-5.5-3.15-5.5 3.15v-15Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SearchControls() {
  return (
    <>
      <label className="group flex h-[52px] min-w-0 items-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] px-3 shadow-[0_8px_20px_rgba(22,22,22,0.055)] transition duration-200 focus-within:border-[rgba(180,35,44,0.35)] focus-within:shadow-[0_12px_28px_rgba(180,35,44,0.1)] focus-within:ring-4 focus-within:ring-[rgba(180,35,44,0.10)]">
        <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F3EE] text-[#161616] transition group-focus-within:text-[#B4232C]">
          <SearchIcon />
        </span>
        <input
          type="text"
          placeholder="Find a place that matches your mood"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#161616] outline-none placeholder:text-[#6F6A66]"
        />
      </label>

      <button
        type="button"
        className="group relative flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] text-[#161616] shadow-[0_8px_20px_rgba(22,22,22,0.055)] transition duration-200 hover:-translate-y-1 hover:rotate-[-3deg] hover:scale-[1.08] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C] hover:shadow-[0_14px_30px_rgba(180,35,44,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(180,35,44,0.14)]"
        aria-label="Filter"
      >
        <FilterIcon />
        <span className="pointer-events-none absolute left-1/2 top-[48px] z-50 -translate-x-1/2 translate-y-1 rounded-full bg-[#161616] px-2.5 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          Filter
        </span>
      </button>
    </>
  );
}

function MoodFilterBar({ selectedMood, onSelectMood }) {
  return (
    <div className="col-span-2 min-w-0 overflow-x-auto overflow-y-visible pb-7 md:col-span-1 md:overflow-visible md:pb-0">
      <div className="flex min-w-max items-center gap-2 md:w-full md:min-w-0 md:justify-between">
        {moods.map((mood, index) => {
          const isSelected = selectedMood === mood.name;

          return (
            <div key={mood.name} className="mood-orbit-wrap">
              <button
                type="button"
                onClick={() => onSelectMood(isSelected ? 'All' : mood.name)}
                className="mood-orbit-button"
                style={{
                  background: isSelected ? mood.soft : '#FFFDFC',
                  borderColor: isSelected ? mood.ink : 'rgba(22,22,22,0.08)',
                  color: mood.ink,
                  boxShadow: isSelected
                    ? `0 14px 30px ${mood.glow}`
                    : `0 9px 22px rgba(22,22,22,0.055)`,
                  '--mood-glow': mood.glow,
                  '--mood-ink': mood.ink,
                  '--orbit-delay': `${index * -0.55}s`,
                }}
                aria-label={mood.name}
                aria-pressed={isSelected}
              >
                <span className="mood-orbit-ring" aria-hidden="true" />
                <span className="mood-orbit-emoji" aria-hidden="true">
                  {mood.emoji}
                </span>
              </button>
              <span className="mood-orbit-label">{mood.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NearbyPlaceCard({ place }) {
  const moodName = place.mood.replace(/^\S+\s/, '');
  const mood = moods.find((item) => item.name === moodName) || moods[0];

  return (
    <article className="group flex cursor-pointer gap-3 rounded-3xl p-2.5 transition duration-200 hover:-translate-y-1 hover:bg-[#F7F3EE] hover:shadow-[0_14px_30px_rgba(22,22,22,0.09)]">
      <div className="h-[82px] w-[96px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-black/5">
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-black text-[#161616]">
            {place.name}
          </h3>
          <button
            className="cursor-pointer text-[#6F6A66] transition duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-[#B4232C]"
            aria-label={`Save ${place.name}`}
          >
            <SaveIcon />
          </button>
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] font-medium leading-5 text-[#6F6A66]">
          {place.description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-black"
            style={{ background: mood.soft, color: mood.ink }}
          >
            {place.mood}
          </span>
          <span className="shrink-0 text-[11px] font-bold text-[#6F6A66]">
            {place.time}
          </span>
        </div>
        <p className="mt-2 text-[11px] font-bold text-[#6F6A66]">
          {place.user}
        </p>
      </div>
    </article>
  );
}

function MapPanel({
  isAddingPin,
  onStartAddingPin,
  onLocationSelected,
  refreshKey,
  focusPin,
  // Added by Musaddik — AI recommendations props
  aiPins,
  onSelectPlace,
  mapCenter,
}) {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-[28px] border border-[#D9D4CE] bg-[#EDE7DF] shadow-[0_24px_58px_rgba(22,22,22,0.14)] transition duration-300 hover:shadow-[0_28px_66px_rgba(22,22,22,0.17)] sm:min-h-[500px] lg:h-full lg:min-h-[560px]">
      <MoodMap
        isAddingPin={isAddingPin}
        onStartAddingPin={onStartAddingPin}
        onLocationSelected={onLocationSelected}
        refreshKey={refreshKey}
        focusPin={focusPin}
        // Added by Musaddik — Pass AI recommendation states down to MoodMap
        aiPins={aiPins}
        onSelectPlace={onSelectPlace}
        mapCenter={mapCenter}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,238,0.18),transparent_30%,rgba(22,22,22,0.08))]" />
      <div className="absolute left-4 top-4 z-10 rounded-full border border-[#D9D4CE] bg-[#FFFDFC]/92 px-3 py-2 shadow-[0_12px_28px_rgba(22,22,22,0.10)] backdrop-blur">
        <p className="text-xs font-black text-[#161616]">New York City, NY</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const routeCreatedPin = routeLocation.state?.createdPin || null;
  const mapSectionRef = useRef(null);

  const [isAddingPin, setIsAddingPin] = useState(false);
  const [selectedMood, setSelectedMood] = useState('All');
  const visiblePlaces =
    selectedMood === 'All'
      ? places
      : places.filter((place) => place.mood.includes(selectedMood));

  // Added by Musaddik — Moodie AI states
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [recommendations, setRecommendations] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAIPlace, setSelectedAIPlace] = useState(null);
  const [isMoodieOpen, setIsMoodieOpen] = useState(false);

  // Added by Musaddik — Sync user GPS coordinates on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setMapCenter([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Geolocation unavailable, defaulting to NYC.', err)
      );
    }
  }, []);

  // Added by Musaddik — Auto-close dialogue modal once recommendations load
  useEffect(() => {
    if (recommendations.length > 0 && !isLoading) {
      setIsMoodieOpen(false);
    }
  }, [recommendations, isLoading]);

  useEffect(() => {
    if (!routeCreatedPin) return;

    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [routeCreatedPin]);

  function startAddingPin() {
    setIsAddingPin(true);
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleLocationSelect(location) {
    setIsAddingPin(false);
    navigate('/create-pin', {
      state: location,
    });
  }

  // Added by Musaddik — recommendation fetch handler
  const handleFetchRecommendations = async (moodQuery) => {
    if (!moodQuery?.trim()) return;
    setIsLoading(true);
    setError(null);
    setSelectedAIPlace(null);

    try {
      const data = await getRecommendations(moodQuery, mapCenter[0], mapCenter[1]);
      setRecommendations(data.recommendations || []);
      setKeywords(data.keywords || []);

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
    <main className="w-full relative">
      <section
        ref={mapSectionRef}
        className="mx-auto flex w-full max-w-[1520px] animate-[soft-page-in_280ms_ease-out_both] flex-col px-3 pb-8 pt-4 sm:px-5 lg:min-h-[calc(100vh-64px)] lg:px-8"
      >
        {/* Added by Musaddik — Moodie Keywords Tags Banner */}
        {keywords.length > 0 && !isLoading && (
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black text-[#6F6A66] uppercase tracking-wider">Moodie Keywords:</span>
            {keywords.map((kw, i) => (
              <span
                key={i}
                className="bg-[#F5DADB] text-[#7D1820] text-xs font-bold px-2.5 py-1 rounded-full border border-[#E7BFC2]"
              >
                🔍 "{kw}"
              </span>
            ))}
          </div>
        )}

        {/* Added by Musaddik — Error Boundary Banner */}
        {error && (
          <div className="mb-3 bg-red-50 text-red-700 text-xs font-semibold px-4 py-2 rounded-xl border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <div className="mb-4 rounded-[28px] border border-[rgba(22,22,22,0.07)] bg-white/68 px-4 py-4 shadow-[0_10px_28px_rgba(22,22,22,0.055)] backdrop-blur">
          <div className="grid grid-cols-[minmax(0,1fr)_52px] items-center gap-x-3 gap-y-3 md:grid-cols-[minmax(300px,500px)_52px_minmax(320px,1fr)]">
            <SearchControls />
            <MoodFilterBar
              selectedMood={selectedMood}
              onSelectMood={setSelectedMood}
            />
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="flex min-h-[340px] flex-col rounded-[28px] border border-[#D9D4CE] bg-[#FFFDFC] p-4 shadow-[0_18px_42px_rgba(22,22,22,0.08)] transition duration-300 hover:shadow-[0_22px_52px_rgba(22,22,22,0.1)] lg:max-h-[600px] lg:min-h-[560px]">
            <div className="mb-3 px-1">
              <h2 className="m-0 text-xl font-black tracking-normal text-[#161616]">
                Nearby Mood Pins
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-[#6F6A66]">
                New York City area
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {visiblePlaces.map((place) => (
                <NearbyPlaceCard key={place.name} place={place} />
              ))}
            </div>
          </aside>

          {/* Map Panel Integration */}
          <div className="relative h-full">
            <MapPanel
              isAddingPin={isAddingPin}
              onStartAddingPin={startAddingPin}
              onLocationSelected={handleLocationSelect}
              refreshKey={routeCreatedPin?.id || 0}
              focusPin={routeCreatedPin}
              // Added by Musaddik — Pass AI state props
              aiPins={recommendations}
              onSelectPlace={(place) => setSelectedAIPlace(place)}
              mapCenter={mapCenter}
            />

            {/* Added by Musaddik — Floating Place Card overlay on top-right when AI pin selected */}
            {selectedAIPlace && !isLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  zIndex: 500,
                }}
              >
                <PlaceCard
                  place={selectedAIPlace}
                  onClose={() => setSelectedAIPlace(null)}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Added by Musaddik — Floating corner Moodie action button */}
      <MoodieButton onClick={() => setIsMoodieOpen(true)} />

      {/* Added by Musaddik — Mood Input Modal */}
      <MoodInputModal
        isOpen={isMoodieOpen}
        onClose={() => !isLoading && setIsMoodieOpen(false)}
        onSubmit={handleFetchRecommendations}
        isLoading={isLoading}
      />
    </main>
  );
}
