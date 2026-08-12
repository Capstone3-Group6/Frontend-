import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import MoodMap from '../components/MoodMap';

const moods = [
  { name: 'Calm', emoji: '😌' },
  { name: 'Creative', emoji: '🎨' },
  { name: 'Fun', emoji: '😄' },
  { name: 'Energetic', emoji: '⚡' },
  { name: 'Romantic', emoji: '❤️' },
  { name: 'Focused', emoji: '🌿' },
  { name: 'Inspiring', emoji: '✨' },
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
    <div className="flex h-11 items-center gap-2">
      <label className="group flex h-11 w-[min(68vw,390px)] items-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] px-3 shadow-[0_8px_22px_rgba(22,22,22,0.05)] transition duration-200 focus-within:border-[rgba(180,35,44,0.35)] focus-within:ring-4 focus-within:ring-[rgba(180,35,44,0.10)]">
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
        className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] text-[#161616] shadow-[0_8px_22px_rgba(22,22,22,0.05)] transition duration-200 hover:-translate-y-0.5 hover:scale-110 hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
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

function MoodCarousel() {
  const loop = [...moods, ...moods];

  return (
    <div className="mood-carousel group relative flex h-16 max-w-full items-start overflow-hidden rounded-2xl border border-[rgba(22,22,22,0.07)] bg-white/55 px-3 pt-1 shadow-[0_4px_16px_rgba(22,22,22,0.04)] [mask-image:linear-gradient(90deg,transparent,black_7%,black_93%,transparent)]">
      <div className="mood-track flex w-max items-start gap-9">
        {loop.map((mood, index) => (
          <div
            key={`${mood.name}-${index}`}
            className="group/item mood-float relative flex h-10 w-10 shrink-0 items-center justify-center"
          >
            <button
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#FFFDFC]/80 text-lg shadow-[0_6px_16px_rgba(22,22,22,0.07)] ring-1 ring-[#DDD7D2] transition duration-200 group-hover/item:-translate-y-0.5 group-hover/item:scale-110 group-hover/item:bg-[rgba(180,35,44,0.08)] group-hover/item:shadow-[0_12px_26px_rgba(180,35,44,0.12)]"
              aria-label={mood.name}
            >
              {mood.emoji}
            </button>
            <span className="pointer-events-none absolute left-1/2 top-10 z-50 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#161616] px-2 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition-all duration-200 group-hover/item:translate-y-0 group-hover/item:opacity-100">
              {mood.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NearbyPlaceCard({ place }) {
  return (
    <article className="group flex cursor-pointer gap-3 rounded-2xl p-2 transition duration-200 hover:-translate-y-0.5 hover:bg-[#F7F3EE] hover:shadow-[0_12px_26px_rgba(22,22,22,0.08)]">
      <div className="h-[72px] w-[84px] shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
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
        <p className="mt-1 line-clamp-1 text-xs font-medium text-[#6F6A66]">
          {place.description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#F5DADB] px-2 py-0.5 text-[11px] font-black text-[#7D1820]">
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
    <div className="relative min-h-[520px] overflow-hidden rounded-[26px] border border-[#D9D4CE] bg-[#EDE7DF] shadow-[0_24px_58px_rgba(22,22,22,0.14)] lg:h-full lg:min-h-0">
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
        className="mx-auto flex w-full max-w-[1500px] flex-col px-4 pb-8 pt-3 sm:px-6 lg:min-h-[calc(100vh-64px)]"
      >
        <div className="mb-3 grid gap-2 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <SearchControls />
          <MoodCarousel />
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="flex min-h-[340px] flex-col rounded-[26px] border border-[#D9D4CE] bg-[#FFFDFC] p-3 shadow-[0_18px_42px_rgba(22,22,22,0.08)] lg:min-h-[600px]">
            <div className="mb-2 px-1">
              <h2 className="m-0 text-lg font-black tracking-[-0.02em] text-[#161616]">
                Top mood pins nearby
              </h2>
              <p className="mt-0.5 text-sm font-semibold text-[#6F6A66]">
                New York City area
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
              {places.map((place) => (
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
