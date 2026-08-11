// PlaceCard.jsx — Displays basic information for the selected place

export default function PlaceCard({ place, onClose }) {
  if (!place) return null;

  const name    = place.displayName?.text || 'Unknown Place';
  const address = place.formattedAddress  || '';

  return (
    <div
      className="card-enter"
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 12px 44px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #EDE8E0',
        overflow: 'hidden',
        width: '300px',
        paddingBottom: '16px',
      }}
    >
      {/* Decorative colored header accent line */}
      <div style={{ height: '5px', background: 'linear-gradient(90deg, #C4B5FD 0%, #FDBA74 50%, #FCA5A5 100%)' }} />

      <div style={{ padding: '16px 16px 0' }}>
        {/* Header Title and Close Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#3D2C1E', margin: 0, lineHeight: 1.3, flex: 1, paddingRight: '10px' }}>
            {name}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: '#FAF8F5',
              border: '1px solid #EDE8E0',
              borderRadius: '50%',
              width: '26px', height: '26px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#9C8B7A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Place Star Rating */}
        {place.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
            <span style={{ color: '#F59E0B', fontSize: '14px' }}>★</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#3D2C1E' }}>{place.rating}</span>
            {place.userRatingCount && (
              <span style={{ fontSize: '11px', color: '#9C8B7A' }}>
                ({place.userRatingCount.toLocaleString()} reviews)
              </span>
            )}
          </div>
        )}

        {/* Address */}
        {address && (
          <p style={{ fontSize: '12px', color: '#9C8B7A', margin: '0 0 12px', lineHeight: 1.5 }}>
            📍 {address}
          </p>
        )}

        {/* Google Maps Redirect Button */}
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block',
            background: '#F5F0FF',
            color: '#7C3AED',
            borderRadius: '999px',
            padding: '5px 13px',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background = '#EDE9FE')}
          onMouseOut={e  => (e.currentTarget.style.background = '#F5F0FF')}
        >
          View on Maps ↗
        </a>
      </div>
    </div>
  );
}
