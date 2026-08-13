import { useEffect, useRef, useState } from 'react';
import Moodie from './Moodie';

const moodOptions = [
  { label: '😌 Calm', value: 'Calm', soft: '#E7F6FF', ink: '#2878C7' },
  { label: '🎨 Creative', value: 'Creative', soft: '#F0E8FF', ink: '#7450D8' },
  { label: '😄 Fun', value: 'Fun', soft: '#FFF3CF', ink: '#B77900' },
  { label: '⚡ Energetic', value: 'Energetic', soft: '#FFEAD6', ink: '#D96800' },
  { label: '❤️ Romantic', value: 'Romantic', soft: '#FFE4EC', ink: '#D83D66' },
  { label: '🌿 Focused', value: 'Focused', soft: '#E4F8EA', ink: '#2C8F4C' },
  { label: '✨ Inspiring', value: 'Inspiring', soft: '#F4ECFF', ink: '#8656D8' },
];

const suggestions = [
  "I'm feeling adventurous today...",
  'I need somewhere calm and cozy...',
  'I want to explore something creative...',
  'Feeling romantic and looking for a nice spot...',
  'I need an energy boost...',
  'Looking for somewhere to focus and think...',
  'I want to feel inspired...',
];

export default function MoodInputModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  successMessage,
}) {
  const [moodText, setMoodText] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen || isLoading) return undefined;

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 90);
    return () => clearTimeout(focusTimer);
  }, [isOpen, isLoading]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const interval = setInterval(() => {
      setSuggestionIndex((current) => (current + 1) % suggestions.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSubmit(value) {
    const nextMood = value || moodText.trim();
    if (!nextMood || isLoading) return;
    onSubmit(nextMood);
  }

  return (
    <>
      <button
        type="button"
        className="moodie-backdrop"
        onClick={() => !isLoading && onClose()}
        aria-label="Close Moodie assistant"
      />

      <section className="moodie-modal" aria-label="Moodie mood assistant">
        {isLoading ? (
          <div className="moodie-loading-state">
            <Moodie size="md" state="loading" />
            <h2>Finding places that match your vibe...</h2>
            <p>Moodie is asking the recommendation service for nearby spots.</p>
            <div className="moodie-loader-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        ) : (
          <>
            <div className="moodie-modal-header">
              <Moodie size="sm" state="waving" />
              <div>
                <h2>Hey, I&apos;m Moodie! ✨</h2>
                <p>Tell me how you feel and I&apos;ll find matching places.</p>
              </div>
              <button
                type="button"
                className="moodie-close"
                onClick={onClose}
                aria-label="Close Moodie"
              >
                ×
              </button>
            </div>

            <div className="moodie-input-shell">
              {!moodText && (
                <span className="moodie-placeholder">
                  {suggestions[suggestionIndex]}
                </span>
              )}
              <input
                ref={inputRef}
                value={moodText}
                onChange={(event) => setMoodText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSubmit();
                }}
                aria-label="Describe your mood"
              />
              <button type="button" onClick={() => handleSubmit()}>
                Go ✨
              </button>
            </div>

            {successMessage && (
              <div className="moodie-success" role="status">
                <strong>✨ {successMessage}</strong>
                <span>Dropping recommendations onto the map now.</span>
              </div>
            )}

            {error && (
              <div className="moodie-error" role="alert">
                <strong>⚠ Moodie couldn&apos;t reach recommendations.</strong>
                <span>{error}</span>
              </div>
            )}

            <div className="moodie-divider">
              <span />
              <p>or pick a mood</p>
              <span />
            </div>

            <div className="moodie-mood-grid">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => handleSubmit(mood.value)}
                  style={{
                    '--chip-bg': mood.soft,
                    '--chip-ink': mood.ink,
                  }}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
