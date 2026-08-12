import { useMemo, useState } from 'react';

const moods = [
  { name: 'Calm', emoji: '😌', color: 'bg-[#e7f3ff] text-[#2878c7]' },
  { name: 'Creative', emoji: '🎨', color: 'bg-[#f1e9ff] text-[#7c5cff]' },
  { name: 'Fun', emoji: '😄', color: 'bg-[#fff5d6] text-[#c88600]' },
  { name: 'Energetic', emoji: '⚡', color: 'bg-[#fff0e1] text-[#ff7b00]' },
  { name: 'Romantic', emoji: '❤️', color: 'bg-[#ffe7ed] text-[#e8476b]' },
  { name: 'Focused', emoji: '🌿', color: 'bg-[#e8f8ec] text-[#329c54]' },
  { name: 'Inspiring', emoji: '✨', color: 'bg-[#f5efff] text-[#8c5cff]' },
];

export default function CreatePinPanel({ location, onCreate, onCancel }) {
  const [placeName, setPlaceName] = useState('');
  const [mood, setMood] = useState('Calm');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // These fields hold only frontend form data.
  // The parent CreatePin page decides how to save the complete pin.

  const selectedMood = useMemo(
    () => moods.find((item) => item.name === mood) || moods[0],
    [mood],
  );

  // The selected mood drives both the active mood button
  // and the live preview card on the right side of the page.

  function handleSubmit(event) {
    event.preventDefault();

    if (!placeName.trim()) {
      return;
    }

    onCreate({
      placeName: placeName.trim(),
      mood,
      description: description.trim(),
      notes: notes.trim(),
    });
  }

  // handleSubmit sends clean form values upward.
  // Later this same data will become the body for POST /api/pins.

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"
    >
      <section className="rounded-[30px] border border-white/70 bg-white p-6 shadow-[0_24px_70px_rgba(63,45,114,0.14)]">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight text-[#171326]">
            Create a Mood Pin ✨
          </h1>
          <p className="mt-2 text-sm font-medium text-[#6F6A66]">
            Share the vibe. Help others discover this place.
          </p>
        </div>

        <div className="grid gap-5">
          <label className="block">
            <span className="text-sm font-bold text-[#171326]">Place Name</span>
            <input
              type="text"
              value={placeName}
              onChange={(event) => setPlaceName(event.target.value)}
              placeholder="Example: Central Park"
              className="mt-2 w-full rounded-2xl border border-[#DDD8D2] px-4 py-3 text-[#171326] outline-none transition focus:border-[#B4232C] focus:ring-4 focus:ring-[#F5DADB]"
            />
          </label>

          <div className="rounded-2xl bg-[#F8F6F3] p-4">
            <p className="text-sm font-bold text-[#171326]">Location</p>
            <p className="mt-1 text-sm font-semibold text-[#6F6A66]">
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-[#171326]">
              How does this place feel?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {moods.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setMood(item.name)}
                  className={`rounded-full border px-4 py-2 text-sm font-black transition hover:-translate-y-0.5 ${
                    mood === item.name
                      ? 'border-[#B4232C] bg-[#B4232C] text-white shadow-lg'
                      : `border-transparent ${item.color}`
                  }`}
                >
                  {item.emoji} {item.name}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-[#171326]">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What makes this place feel this way?"
              rows="4"
              className="mt-2 w-full resize-none rounded-2xl border border-[#DDD8D2] px-4 py-3 text-[#171326] outline-none transition focus:border-[#B4232C] focus:ring-4 focus:ring-[#F5DADB]"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#171326]">
              Optional notes
            </span>
            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Best time to visit, entrance, tips..."
              className="mt-2 w-full rounded-2xl border border-[#DDD8D2] px-4 py-3 text-[#171326] outline-none transition focus:border-[#B4232C] focus:ring-4 focus:ring-[#F5DADB]"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-[#DDD8D2] px-5 py-3 font-bold text-[#6F6A66] transition hover:bg-[#F8F6F3] hover:text-[#171326] sm:flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 px-5 py-3 font-black text-white shadow-lg transition hover:scale-[1.02] sm:flex-1"
          >
            Save Mood Pin
          </button>
        </div>
      </section>

      <aside className="rounded-[30px] border border-white/70 bg-white p-5 shadow-[0_24px_70px_rgba(63,45,114,0.14)]">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#B4232C]">
          Live Preview
        </p>
        <div className="mt-4 overflow-hidden rounded-3xl bg-[#F8F6F3]">
          <img
            src="https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=700&q=80"
            alt="Mood pin preview"
            className="h-44 w-full object-cover"
          />
          <div className="p-4">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${selectedMood.color}`}
            >
              {selectedMood.emoji} {selectedMood.name}
            </span>
            <h2 className="mt-3 text-xl font-black text-[#171326]">
              {placeName.trim() || 'Your Mood Pin'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6F6A66]">
              {description.trim() ||
                'Add a short description so people know what makes this place special.'}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"
                alt="@samiallo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-bold text-[#171326]">@samiallo</span>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}
