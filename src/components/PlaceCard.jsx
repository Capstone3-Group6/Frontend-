export default function PlaceCard({ place, onClose }) {
  if (!place) return null;

  const name = place.displayName?.text || place.name || 'Unknown Place';
  const address = place.formattedAddress || place.address || '';
  const rating = place.rating;
  const reviewCount = place.userRatingCount;
  const recommendedMood = place.recommendedMood;

  return (
    <article className="ai-place-card">
      <div className="ai-place-card-strip" />
      <div className="ai-place-card-body">
        <p className="ai-place-kicker">✨ Moodie Recommendation</p>
        <div className="ai-place-card-header">
          <h3>{name}</h3>
          <button type="button" onClick={onClose} aria-label="Close place card">
            ×
          </button>
        </div>

        {rating && (
          <p className="ai-place-rating">
            <span>★</span>
            <strong>{rating}</strong>
            {reviewCount && <em>({reviewCount.toLocaleString()} reviews)</em>}
          </p>
        )}

        {address && <p className="ai-place-address">📍 {address}</p>}

        {recommendedMood && (
          <p className="ai-place-mood">Recommended for: {recommendedMood}</p>
        )}

        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${name} ${address}`,
          )}`}
          target="_blank"
          rel="noreferrer"
        >
          View on Maps ↗
        </a>
      </div>
    </article>
  );
}
