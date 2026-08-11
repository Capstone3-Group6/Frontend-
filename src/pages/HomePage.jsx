import MoodMap from '../components/MoodMap';

const moods = [
  { name: "Calm", type: "calm" },
  { name: "Creative", type: "creative" },
  { name: "Fun", type: "fun" },
  { name: "Energetic", type: "energetic" },
  { name: "Romantic", type: "romantic" },
  { name: "Focused", type: "focused" },
  { name: "Inspiring", type: "inspiring" },
];

const places = [
  {
    name: "Columbia Park",
    location: "Lower Manhattan",
    description: "Open field energy, pickup games, and space to move.",
    mood: "Energetic",
    type: "energetic",
    user: "@samiallo",
    time: "2h ago",
    avatar: "SA",
    accent: "red",
    selected: true,
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
    position: "left-[22%] top-[30%]",
  },
  {
    name: "Mission Murals",
    location: "Arts District",
    description: "Color, culture, and creative energy on every block.",
    mood: "Creative",
    type: "creative",
    user: "@art.by.lei",
    time: "4h ago",
    avatar: "AL",
    accent: "charcoal",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=600&q=80",
    position: "left-[39%] top-[58%]",
  },
  {
    name: "Dolores Park",
    location: "West Village",
    description: "Sunny views, bright groups, and weekend joy.",
    mood: "Fun",
    type: "fun",
    user: "@sunny.vibes",
    time: "6h ago",
    avatar: "SV",
    accent: "red",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80",
    position: "right-[27%] top-[32%]",
  },
  {
    name: "Garden Steps",
    location: "Greenwich",
    description: "Quiet green corners for reading and resetting.",
    mood: "Focused",
    type: "focused",
    user: "@green.hour",
    time: "8h ago",
    avatar: "GH",
    accent: "charcoal",
    image:
      "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=600&q=80",
    position: "right-[38%] bottom-[23%]",
  },
  {
    name: "Sunset Pier",
    location: "Hudson River",
    description: "Golden light and a quiet spark at the edge of the city.",
    mood: "Inspiring",
    type: "inspiring",
    user: "@goldenhour",
    time: "1d ago",
    avatar: "GO",
    accent: "red",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
    position: "right-[14%] bottom-[39%]",
  },
];

const selectedPlace = {
  name: "Crissy Field Overlook",
  location: "Waterfront North",
  description: "Open views, salty air, and a calm place to reset.",
  mood: "Calm",
  type: "calm",
  user: "@samiallo",
  time: "12 min ago",
  avatar: "SA",
  accent: "red",
  image:
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80",
};

const accents = {
  red: {
    fill: "#B4232C",
    soft: "bg-[#F5DADB] text-[#7D1820] ring-[#E7BFC2]",
    marker: "bg-[#B4232C]",
    avatar: "bg-[#B4232C]",
  },
  charcoal: {
    fill: "#161616",
    soft: "bg-[#EFEBE6] text-[#161616] ring-[#D9D4CE]",
    marker: "bg-[#161616]",
    avatar: "bg-[#161616]",
  },
  ivory: {
    fill: "#7D1820",
    soft: "bg-[#FFFDFC] text-[#7D1820] ring-[#D9D4CE]",
    marker: "bg-[#7D1820]",
    avatar: "bg-[#7D1820]",
  },
};

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

function SaveIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6.5 4.75h11v15l-5.5-3.15-5.5 3.15v-15Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoodFace({ type, className = "h-8 w-8", accent = "#161616" }) {
  const mouth =
    type === "calm"
      ? "M13.5 22c1.45 1 2.95 1.5 4.5 1.5s3.05-.5 4.5-1.5"
      : type === "focused"
        ? "M14.5 22h7"
        : type === "romantic"
          ? "M14 22.5c1.3 1.4 2.65 2.1 4 2.1s2.7-.7 4-2.1"
          : "M13.2 21.5c1.25 2.1 2.85 3.15 4.8 3.15s3.55-1.05 4.8-3.15";

  return (
    <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="15.5" fill="#FFFDFC" />
      <circle cx="18" cy="18" r="13.6" fill="#F7F3EE" stroke={accent} strokeWidth="1.8" />
      {type === "romantic" ? (
        <>
          <path d="M12.2 13.2c0-1.2 1.5-1.8 2.3-.8.8-1 2.3-.4 2.3.8 0 1.6-2.3 3-2.3 3s-2.3-1.4-2.3-3Z" fill="#B4232C" />
          <path d="M19.2 13.2c0-1.2 1.5-1.8 2.3-.8.8-1 2.3-.4 2.3.8 0 1.6-2.3 3-2.3 3s-2.3-1.4-2.3-3Z" fill="#B4232C" />
        </>
      ) : type === "creative" ? (
        <>
          <circle cx="13.3" cy="14.5" r="1.55" fill="#161616" />
          <circle cx="22.7" cy="14.5" r="1.55" fill="#161616" />
          <path d="M27.5 8.8 29 6l1.5 2.8 2.8 1.3-2.8 1.2L29 14l-1.5-2.7-2.8-1.2 2.8-1.3Z" fill="#B4232C" />
        </>
      ) : type === "energetic" ? (
        <>
          <path d="M12 15.5 15 12M21 12l3 3.5" stroke="#161616" strokeLinecap="round" strokeWidth="2.1" />
          <path d="m19 5.5-3 6h3l-1 5 4-7h-3l0-4Z" fill="#B4232C" opacity=".95" />
        </>
      ) : type === "focused" ? (
        <>
          <path d="M12 15h4M20 15h4" stroke="#161616" strokeLinecap="round" strokeWidth="2.1" />
          <path d="M18 7v4M18 25v4M7 18h4M25 18h4" stroke="#B4232C" strokeLinecap="round" strokeWidth="1.8" opacity=".85" />
        </>
      ) : type === "inspiring" ? (
        <>
          <circle cx="13.5" cy="15" r="1.55" fill="#161616" />
          <circle cx="22.5" cy="15" r="1.55" fill="#161616" />
          <path d="m18 6.5 1.1 3.2 3.3 1.1-3.3 1.1L18 15l-1.1-3.1-3.3-1.1 3.3-1.1L18 6.5Z" fill="#B4232C" opacity=".95" />
        </>
      ) : (
        <>
          <path d="M12.5 14.5h.01M23.5 14.5h.01" stroke="#161616" strokeLinecap="round" strokeWidth="3" />
          {type === "calm" && <path d="M11 14c1.6-1 3.1-1 4.5 0M20.5 14c1.4-1 2.9-1 4.5 0" stroke="#161616" strokeLinecap="round" strokeWidth="1.6" opacity=".8" />}
        </>
      )}
      <path d={mouth} stroke="#B4232C" strokeLinecap="round" strokeWidth="2.1" />
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
        className="group relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[rgba(22,22,22,0.08)] bg-[#FFFDFC] text-[#161616] shadow-[0_8px_22px_rgba(22,22,22,0.05)] transition-[transform,box-shadow,color,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:border-[rgba(180,35,44,0.35)] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C] hover:shadow-[0_12px_26px_rgba(180,35,44,0.12)]"
        aria-label="Filter"
      >
        <FilterIcon />
        <span className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 translate-y-1 rounded-full bg-[#161616] px-2.5 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
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
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#FFFDFC]/80 text-[#161616] shadow-[0_6px_16px_rgba(22,22,22,0.07)] ring-1 ring-[#DDD7D2] transition-[transform,box-shadow,color,background-color] duration-200 ease-out group-hover/item:-translate-y-0.5 group-hover/item:scale-110 group-hover/item:bg-[rgba(180,35,44,0.08)] group-hover/item:text-[#B4232C] group-hover/item:shadow-[0_12px_26px_rgba(180,35,44,0.12)]"
              aria-label={mood.name}
            >
              <MoodFace type={mood.type} className="h-6 w-6" />
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

function Avatar({ place, size = "h-6 w-6", text = "text-[9px]" }) {
  return (
    <span
      className={`flex ${size} items-center justify-center rounded-full ${accents[place.accent].avatar} ${text} font-black text-white`}
    >
      {place.avatar}
    </span>
  );
}

function MoodBadge({ place }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-black ring-1 ${accents[place.accent].soft}`}
    >
      <MoodFace type={place.type} accent={accents[place.accent].fill} className="h-4 w-4" />
      {place.mood}
    </span>
  );
}

function NearbyPlaceCard({ place }) {
  return (
    <article className="group flex cursor-pointer gap-3 rounded-2xl p-2 transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#F7F3EE] hover:shadow-[0_12px_26px_rgba(22,22,22,0.08)]">
      <div className="h-[72px] w-[84px] shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5">
        <img
          src={place.image}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-black text-[#161616]">{place.name}</h3>
          <button className="cursor-pointer text-[#6F6A66] transition-[transform,color] duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-[#B4232C]" aria-label={`Save ${place.name}`}>
            <SaveIcon />
          </button>
        </div>
        <p className="mt-1 line-clamp-1 text-xs font-medium text-[#6F6A66]">
          {place.description}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <MoodBadge place={place} />
          <span className="shrink-0 text-[11px] font-bold text-[#6F6A66]">
            {place.time}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Avatar place={place} />
          <span className="truncate text-[11px] font-bold text-[#6F6A66]">
            {place.user}
          </span>
        </div>
      </div>
    </article>
  );
}

function HoverPreview({ place }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-12 z-30 w-52 -translate-x-1/2 translate-y-2 rounded-2xl border border-[#D9D4CE] bg-[#FFFDFC] p-2 opacity-0 shadow-[0_18px_42px_rgba(22,22,22,0.18)] transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
      <div className="flex gap-2">
        <img src={place.image} alt={place.name} className="h-14 w-16 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-[#161616]">{place.name}</p>
          <div className="mt-1">
            <MoodBadge place={place} />
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Avatar place={place} size="h-5 w-5" text="text-[8px]" />
            <span className="truncate text-[11px] font-bold text-[#6F6A66]">
              {place.user}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoodMarker({ place }) {
  return (
    <div className={`group mood-marker pointer-events-auto absolute ${place.position}`}>
      <button
        className={`relative flex cursor-pointer items-center justify-center rounded-[18px_18px_18px_6px] ${accents[place.accent].marker} shadow-[0_14px_30px_rgba(22,22,22,0.22)] ring-[3px] ring-[#FFFDFC] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:shadow-[0_20px_42px_rgba(22,22,22,0.28)] ${place.selected ? "h-12 w-12 shadow-[0_0_0_8px_rgba(180,35,44,0.10),0_18px_42px_rgba(22,22,22,0.28)] ring-4 ring-[#F7F3EE]" : "h-11 w-11"}`}
        aria-label={`${place.name}, ${place.mood}`}
      >
        <MoodFace type={place.type} accent={accents[place.accent].fill} className="h-8 w-8" />
      </button>
      <HoverPreview place={place} />
    </div>
  );
}

function SelectedPlaceCard({ place }) {
  return (
    <div className="absolute bottom-4 left-4 z-20 w-[min(286px,calc(100%-2rem))] rounded-2xl border border-[#D9D4CE] bg-[#FFFDFC] p-2.5 shadow-[0_18px_44px_rgba(22,22,22,0.16)] transition duration-200 hover:scale-[1.025] hover:shadow-[0_24px_60px_rgba(22,22,22,0.22)] sm:left-auto sm:right-4">
      <div className="flex gap-3">
        <img src={place.image} alt={place.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <MoodBadge place={place} />
            <button className="cursor-pointer text-[#B4232C] transition-[transform,color] duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:text-[#7D1820]" aria-label={`Save ${place.name}`}>
              <SaveIcon filled />
            </button>
          </div>
          <h3 className="mt-1 truncate text-sm font-black text-[#161616]">
            {place.name}
          </h3>
          <p className="text-[11px] font-bold text-[#6F6A66]">{place.location}</p>
          <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-[#6F6A66]">
            {place.description}
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Avatar place={place} />
          <span className="text-[11px] font-bold text-[#6F6A66]">{place.user}</span>
        </div>
        <button className="cursor-pointer rounded-full bg-[#B4232C] px-3 py-1.5 text-[11px] font-black text-white transition-[transform,background-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:scale-105 hover:bg-[#7D1820] hover:shadow-[0_10px_22px_rgba(180,35,44,0.22)]">
          Details
        </button>
      </div>
    </div>
  );
}

function MapPanel() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[26px] border border-[#D9D4CE] bg-[#EDE7DF] shadow-[0_24px_58px_rgba(22,22,22,0.14)] lg:h-full lg:min-h-0">
      <MoodMap />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,238,0.18),transparent_30%,rgba(22,22,22,0.08))]" />

      <div className="absolute left-4 top-4 z-10 rounded-full border border-[#D9D4CE] bg-[#FFFDFC]/92 px-3 py-2 shadow-[0_12px_28px_rgba(22,22,22,0.10)] backdrop-blur">
        <p className="text-xs font-black text-[#161616]">New York City, NY</p>
      </div>

      <button className="group absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#B4232C] text-white shadow-[0_14px_30px_rgba(180,35,44,0.24)] transition-[transform,box-shadow,background-color] duration-200 ease-out hover:-translate-y-0.5 hover:scale-110 hover:bg-[#7D1820] hover:shadow-[0_18px_36px_rgba(180,35,44,0.30)]" aria-label="Add Mood Pin">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2" />
        </svg>
        <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#161616] px-2 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          Add Mood
        </span>
      </button>

      <div className="pointer-events-none absolute inset-0">
        {places.map((place) => (
          <MoodMarker key={place.name} place={place} />
        ))}
      </div>

      <SelectedPlaceCard place={selectedPlace} />
    </div>
  );
}

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-[1500px] flex-col px-4 pb-4 pt-3 sm:px-6 lg:h-[calc(100vh-64px)] lg:min-h-[640px] lg:overflow-hidden">
      <div className="mb-3 grid gap-2 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <SearchControls />
        <MoodCarousel />
      </div>

      <div className="grid flex-1 gap-4 overflow-hidden lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="flex min-h-[340px] flex-col rounded-[26px] border border-[#D9D4CE] bg-[#FFFDFC] p-3 shadow-[0_18px_42px_rgba(22,22,22,0.08)] lg:min-h-0">
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

        <MapPanel />
      </div>
    </section>
  );
}
