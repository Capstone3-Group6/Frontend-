import Moodie from './Moodie';

export default function MoodieButton({ onClick, isActive = false }) {
  return (
    <button
      type="button"
      className={`moodie-map-button ${isActive ? 'is-active' : ''}`}
      onClick={onClick}
      aria-label="Open Moodie mood assistant"
    >
      <span className="moodie-map-bubble">psst... tell me your vibe</span>
      <Moodie size="sm" state="waving" />
    </button>
  );
}
