import { useMemo, useState } from 'react';

const moods = [
  { name: 'Calm', emoji: '😌', soft: '#E7F6FF', ink: '#2878C7', glow: 'rgba(40,120,199,0.2)' },
  { name: 'Creative', emoji: '🎨', soft: '#F0E8FF', ink: '#7450D8', glow: 'rgba(116,80,216,0.22)' },
  { name: 'Fun', emoji: '😄', soft: '#FFF3CF', ink: '#B77900', glow: 'rgba(183,121,0,0.2)' },
  { name: 'Energetic', emoji: '⚡', soft: '#FFEAD6', ink: '#D96800', glow: 'rgba(217,104,0,0.22)' },
  { name: 'Romantic', emoji: '❤️', soft: '#FFE4EC', ink: '#D83D66', glow: 'rgba(216,61,102,0.2)' },
  { name: 'Focused', emoji: '🌿', soft: '#E4F8EA', ink: '#2C8F4C', glow: 'rgba(44,143,76,0.2)' },
  { name: 'Inspiring', emoji: '✨', soft: '#F4ECFF', ink: '#8656D8', glow: 'rgba(134,86,216,0.2)' },
];

export default function CreatePinPanel({ location, onSubmit, onCancel }) {
  const [locationName, setLocationName] = useState('');
  const [mood, setMood] = useState('Calm');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

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

    if (!locationName.trim()) {
      return;
    }

    onSubmit({
      locationName: locationName.trim(),
      mood,
      description: description.trim(),
      notes: notes.trim(),
      image: photoPreview,
      photoName,
    });
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      setPhotoName('');
      setPhotoPreview('');
      return;
    }

    setPhotoName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsDataURL(file);
  }

  // handleSubmit sends clean form values upward.
  // Later this same data will become the body for POST /api/pins.

  return (
    <form
      onSubmit={handleSubmit}
      className="grid animate-[create-panel-in_320ms_ease-out_both] gap-6 lg:grid-cols-[minmax(360px,0.42fr)_minmax(0,0.58fr)]"
    >
      <section className="rounded-[32px] border border-[rgba(22,22,22,0.07)] bg-white p-5 shadow-[0_26px_70px_rgba(63,45,114,0.13)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_32px_82px_rgba(63,45,114,0.16)] sm:p-7">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-normal text-[#171326]">
            ✨ Create a Mood Pin
          </h1>
          <p className="mt-2 text-sm font-medium text-[#6F6A66]">
            Share the vibe. Help others discover this place.
          </p>
        </div>

        <div className="grid gap-5">
          <label className="group block">
            <span className="text-sm font-bold text-[#171326]">Place Name</span>
            <input
              type="text"
              value={locationName}
              onChange={(event) => setLocationName(event.target.value)}
              placeholder="Example: Central Park"
              className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#DDD8D2] bg-[#FFFDFC] px-4 py-3 text-[#171326] outline-none transition duration-200 group-hover:border-[#CFC7BE] group-hover:shadow-[0_10px_22px_rgba(22,22,22,0.045)] focus:border-[#B4232C] focus:shadow-[0_14px_30px_rgba(180,35,44,0.08)] focus:ring-4 focus:ring-[#F5DADB]"
            />
          </label>

          <div className="rounded-3xl border border-[#E4DDD7] bg-[#F8F6F3] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#FFFDFC]">
            <p className="text-sm font-black text-[#171326]">📍 Selected location</p>
            <p className="mt-1 font-mono text-sm font-semibold text-[#6F6A66]">
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-[#171326]">
              How does this place feel?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {moods.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setMood(item.name)}
                  className="rounded-2xl border px-3 py-3 text-left text-sm font-black transition duration-200 hover:-translate-y-1 hover:scale-[1.025] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4"
                  style={{
                    background: mood === item.name ? item.soft : '#FFFDFC',
                    borderColor: mood === item.name ? item.ink : '#E4DDD7',
                    color: item.ink,
                    boxShadow:
                      mood === item.name
                        ? `0 12px 26px ${item.glow}`
                        : '0 8px 18px rgba(22,22,22,0.035)',
                    '--tw-ring-color': item.glow,
                  }}
                  aria-pressed={mood === item.name}
                >
                  {mood === item.name ? '✓ ' : ''}{item.emoji} {item.name}
                </button>
              ))}
            </div>
          </div>

          <label className="group block">
            <span className="text-sm font-bold text-[#171326]">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What makes this place feel this way?"
              rows="4"
              maxLength="180"
              className="mt-2 min-h-[126px] w-full resize-none rounded-2xl border border-[#DDD8D2] bg-[#FFFDFC] px-4 py-3 text-[#171326] outline-none transition duration-200 group-hover:border-[#CFC7BE] group-hover:shadow-[0_10px_22px_rgba(22,22,22,0.045)] focus:border-[#B4232C] focus:shadow-[0_14px_30px_rgba(180,35,44,0.08)] focus:ring-4 focus:ring-[#F5DADB]"
            />
            <span className="mt-1 block text-right text-xs font-bold text-[#9D9690]">
              {description.length}/180
            </span>
          </label>

          <label className="group block">
            <span className="text-sm font-bold text-[#171326]">
              Optional notes
            </span>
            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Best time to visit, entrance, tips..."
              className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#DDD8D2] bg-[#FFFDFC] px-4 py-3 text-[#171326] outline-none transition duration-200 group-hover:border-[#CFC7BE] group-hover:shadow-[0_10px_22px_rgba(22,22,22,0.045)] focus:border-[#B4232C] focus:shadow-[0_14px_30px_rgba(180,35,44,0.08)] focus:ring-4 focus:ring-[#F5DADB]"
            />
          </label>

          <label className="group block cursor-pointer rounded-3xl border border-dashed border-[#CFC7BE] bg-[#FFFDFC] p-5 text-center transition duration-200 hover:-translate-y-1 hover:border-[#B4232C] hover:bg-[#FAF8F6] hover:shadow-[0_16px_34px_rgba(22,22,22,0.08)]">
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="sr-only"
              onChange={handlePhotoChange}
            />
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F7F3EE] text-3xl transition duration-200 group-hover:scale-105 group-hover:bg-[#FFF1F2]">📷</span>
            <span className="mt-2 block text-sm font-black text-[#171326]">
              Upload a place photo
            </span>
            <span className="mt-1 block text-xs font-bold text-[#6F6A66]">
              {photoName || 'PNG / JPG'}
            </span>
          </label>

          {false && (
          <div>
            <p className="text-sm font-bold text-[#171326]">Privacy</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {['Public', 'Private'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPrivacy(option)}
                  className={`rounded-3xl border p-4 text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(22,22,22,0.07)] active:scale-[0.99] ${
                    privacy === option
                      ? 'border-[#B4232C] bg-[#FFF1F2] shadow-[0_12px_26px_rgba(180,35,44,0.12)]'
                      : 'border-[#E4DDD7] bg-[#FFFDFC]'
                  }`}
                  aria-pressed={privacy === option}
                >
                  <span className="block text-sm font-black text-[#171326]">
                    {option === 'Public' ? '🌎 Public' : '🔒 Private'}
                  </span>
                  <span className="mt-1 block text-xs font-bold leading-5 text-[#6F6A66]">
                    {option === 'Public'
                      ? 'Anyone can discover this Mood Pin.'
                      : 'Only you can see this Mood Pin.'}
                  </span>
                </button>
              ))}
            </div>
          </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-[#DDD8D2] bg-white px-5 py-3 font-bold text-[#6F6A66] transition hover:-translate-y-0.5 hover:bg-[#F8F6F3] hover:text-[#171326] sm:flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-[length:140%_100%] px-5 py-3 font-black text-white shadow-[0_16px_34px_rgba(219,39,119,0.25)] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[position:100%_0] hover:shadow-[0_20px_42px_rgba(219,39,119,0.32)] active:scale-[0.98] sm:flex-1"
          >
            ✨ Save Mood Pin
          </button>
        </div>
      </section>

      <aside className="grid gap-5 lg:sticky lg:top-24 lg:self-start">
        <section className="min-h-[260px] overflow-hidden rounded-[32px] border border-[#D9D4CE] bg-[#EDE7DF] shadow-[0_22px_58px_rgba(22,22,22,0.1)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_68px_rgba(22,22,22,0.13)]">
          <div className="flex h-full min-h-[260px] items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(180,35,44,0.08),transparent_30%),linear-gradient(135deg,#F7F3EE,#EDE7DF)] p-6 text-center">
            <div>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-[0_14px_32px_rgba(22,22,22,0.12)] transition duration-300 hover:scale-105">
                📍
              </div>
              <p className="mt-4 text-sm font-black text-[#171326]">
                Location Preview
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-[#6F6A66]">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[rgba(22,22,22,0.07)] bg-white p-5 shadow-[0_24px_70px_rgba(63,45,114,0.13)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_32px_82px_rgba(63,45,114,0.16)]">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#B4232C]">
            👁 Live Preview
          </p>
          <div className="group mt-4 overflow-hidden rounded-3xl bg-[#F8F6F3] shadow-[inset_0_0_0_1px_rgba(22,22,22,0.05)] transition duration-300 hover:shadow-[0_18px_42px_rgba(22,22,22,0.1)]">
          <img
            src={
              photoPreview ||
              'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=700&q=80'
            }
            alt={
              photoPreview
                ? `${locationName.trim() || 'Selected place'} preview`
                : 'Mood pin preview'
            }
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
          <div className="p-4">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-black"
              style={{ background: selectedMood.soft, color: selectedMood.ink }}
            >
              {selectedMood.emoji} {selectedMood.name}
            </span>
            <h2 className="mt-3 text-xl font-black text-[#171326]">
              {locationName.trim() || 'Your Mood Pin'}
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
        </section>
      </aside>
    </form>
  );
}
