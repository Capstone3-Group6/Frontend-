// Added by Musaddik
// PlaceCard.jsx — Displays basic information and Moodie AI reasoning for the selected place

import { useState } from 'react';

export default function PlaceCard({ place, onClose }) {
  const [isReasonOpen, setIsReasonOpen] = useState(false);

  if (!place) return null;

  const name = place.displayName?.text || place.name || 'Unknown Place';
  const address = place.formattedAddress || place.address || '';
  const reason = place.reason || (place.matchedKeyword
    ? `Matches your "${place.mood || 'selected'}" mood by bringing "${place.matchedKeyword}" vibes to your day.`
    : `Curated by Moodie to match your "${place.mood || 'current'}" mood perfectly.`);

  return (
    <div
      className="card-enter"
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #EDE8E0',
        overflow: 'hidden',
        width: '320px',
        paddingBottom: '16px',
        transition: 'all 0.25s ease',
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
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
              e.currentTarget.style.color = '#B91C1C';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#FAF8F5';
              e.currentTarget.style.color = '#9C8B7A';
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
          <p style={{ fontSize: '12px', color: '#9C8B7A', margin: '0 0 10px', lineHeight: 1.5 }}>
            📍 {address}
          </p>
        )}

        {/* Moodie AI Reasoning Dropdown / Accordion */}
        <div style={{ marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setIsReasonOpen(!isReasonOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: isReasonOpen ? '#FBF9FF' : '#F7F4EF',
              border: isReasonOpen ? '1px solid #DDD6FE' : '1px solid #EDE8E0',
              borderRadius: '12px',
              padding: '7px 11px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!isReasonOpen) e.currentTarget.style.background = '#EFEAE1';
            }}
            onMouseOut={(e) => {
              if (!isReasonOpen) e.currentTarget.style.background = '#F7F4EF';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: isReasonOpen ? '#7C3AED' : '#5C4838' }}>
              <span>✨</span>
              <span>Why Moodie picked this</span>
            </span>
            <span
              style={{
                fontSize: '11px',
                color: isReasonOpen ? '#7C3AED' : '#8C7A6B',
                transform: isReasonOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
              }}
            >
              ▼
            </span>
          </button>

          {/* Expandable Reasoning Body */}
          {isReasonOpen && (
            <div
              style={{
                marginTop: '6px',
                background: 'linear-gradient(135deg, #FAF5FF 0%, #FFF8F5 100%)',
                border: '1px solid #E9D5FF',
                borderRadius: '12px',
                padding: '10px 12px',
                animation: 'bubble-pop 0.2s ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', lineHeight: 1 }}>🤖</span>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 500, color: '#4C1D95', lineHeight: 1.45 }}>
                  {reason}
                </p>
              </div>
              {place.matchedKeyword && (
                <div style={{ marginTop: '6px', display: 'inline-block' }}>
                  <span
                    style={{
                      background: '#EDE9FE',
                      color: '#6D28D9',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      letterSpacing: '0.2px',
                    }}
                  >
                    🔍 Vibe: "{place.matchedKeyword}"
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

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
          onMouseOut={e => (e.currentTarget.style.background = '#F5F0FF')}
        >
          View on Maps ↗
        </a>
      </div>
    </div>
  );
}
