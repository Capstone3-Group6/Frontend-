import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import MoodMap from '../components/MoodMap';

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
    <div className="flex w-full items-center gap-2">
      <label className="group flex h-14 min-w-0 flex-1 items-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] px-3 shadow-[0_10px_26px_rgba(22,22,22,0.06)] transition duration-200 focus-within:border-[rgba(180,35,44,0.35)] focus-within:ring-4 focus-within:ring-[rgba(180,35,44,0.10)] sm:max-w-[520px]">
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
        className="group relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] text-[#161616] shadow-[0_10px_26px_rgba(22,22,22,0.06)] transition duration-200 hover:-translate-y-1 hover:rotate-[-3deg] hover:scale-105 hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(180,35,44,0.14)]"
        aria-label="Filter"
      >
        <FilterIcon />
        <span className="pointer-events-none absolute left-1/2 top-12 z-50 -translate-x-1/2 translate-y-1 rounded-full bg-[#161616] px-2.5 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          Filter
        </span>
      </button>
    </div>
  );
}

function MoodFilterBar({ selectedMood, onSelectMood }) {
  return (
    <div className="min-w-0 overflow-x-auto pb-1">
      <div className="flex min-w-max items-center gap-2">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.name;

          return (
            <button
              key={mood.name}
              type="button"
              onClick={() => onSelectMood(isSelected ? 'All' : mood.name)}
              className="rounded-full border px-4 py-2.5 text-sm font-black transition duration-200 hover:-translate-y-1 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4"
              style={{
                background: isSelected ? mood.soft : '#FFFDFC',
                borderColor: isSelected ? mood.ink : 'rgba(22,22,22,0.08)',
                color: isSelected ? mood.ink : '#171326',
                boxShadow: isSelected
                  ? `0 12px 28px ${mood.glow}`
                  : `0 8px 20px rgba(22,22,22,0.045)`,
                '--tw-ring-color': mood.glow,
              }}
              aria-pressed={isSelected}
            >
              {mood.emoji} {mood.name}
            </button>
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
}) {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-[28px] border border-[#D9D4CE] bg-[#EDE7DF] shadow-[0_24px_58px_rgba(22,22,22,0.14)] transition duration-300 hover:shadow-[0_28px_66px_rgba(22,22,22,0.17)] sm:min-h-[500px] lg:h-full lg:min-h-[560px]">
      <MoodMap
        isAddingPin={isAddingPin}
        onStartAddingPin={onStartAddingPin}
        onLocationSelected={onLocationSelected}
        refreshKey={refreshKey}
        focusPin={focusPin}
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

  // This ref marks the map destination used after returning
  // from /create-pin with a newly saved pin.

  const [isAddingPin, setIsAddingPin] = useState(false);
  const [selectedMood, setSelectedMood] = useState('All');
  const visiblePlaces =
    selectedMood === 'All'
      ? places
      : places.filter((place) => place.mood.includes(selectedMood));

  // HomePage is the single source of truth for add-pin mode.
  //
  // isAddingPin = true means the next Leaflet click selects a location.
  // That location is passed to /create-pin through router state.

  useEffect(() => {
    if (!routeCreatedPin) return;

    // When /create-pin saves and navigates back here, router state
    // carries the created pin and this moves the page back to the map.
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [routeCreatedPin]);

  function startAddingPin() {
    // Add mode is controlled by HomePage, and MoodMap only listens
    // for location clicks while this value is true.
    setIsAddingPin(true);
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleLocationSelect(location) {
    // Leaflet gives the raw lat/lng here. We store it first,
    // then route to CreatePin so the form can collect pin details.
    setIsAddingPin(false);
    navigate('/create-pin', {
      state: location,
    });
  }

  return (
    <main className="w-full">
      <section
        ref={mapSectionRef}
        className="mx-auto flex w-full max-w-[1520px] animate-[soft-page-in_280ms_ease-out_both] flex-col px-3 pb-8 pt-4 sm:px-5 lg:min-h-[calc(100vh-64px)] lg:px-8"
      >
        <div className="mb-4 rounded-[28px] border border-[rgba(22,22,22,0.07)] bg-white/62 p-3 shadow-[0_12px_34px_rgba(22,22,22,0.06)] backdrop-blur">
          <div className="grid gap-3 lg:grid-cols-[minmax(320px,520px)_minmax(0,1fr)] lg:items-center">
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

          <MapPanel
            isAddingPin={isAddingPin}
            onStartAddingPin={startAddingPin}
            onLocationSelected={handleLocationSelect}
            refreshKey={routeCreatedPin?.id || 0}
            focusPin={routeCreatedPin}
          />
        </div>
      </section>
    </main>
  );
}
