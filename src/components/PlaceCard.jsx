// Added by Musaddik
// PlaceCard.jsx — Displays basic information, Moodie AI reasoning, and interactive AI follow-up details

import { useState } from 'react';
import { askAboutPlace } from '../api/recommendations';

const PREDEFINED_QUESTIONS = [
  { id: 'vibe', label: 'Vibe & Best Time', emoji: '🌟', question: "What's the vibe here and what is the best time to visit?" },
  { id: 'highlights', label: 'Must-Try Highlights', emoji: '☕', question: "What are the must-try items, top activities, or special highlights here?" },
  { id: 'tips', label: 'Insider Tips & Info', emoji: '💡', question: "What are some helpful insider tips, parking advice, or things to know before going?" },
];

export default function PlaceCard({ place, onClose }) {
  const [isReasonOpen, setIsReasonOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [activeQuestion, setActiveQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!place) return null;

  const name = place.displayName?.text || place.name || 'Unknown Place';
  const address = place.formattedAddress || place.address || '';
  const reason = place.reason || (place.matchedKeyword
    ? `Matches your "${place.mood || 'selected'}" mood by bringing "${place.matchedKeyword}" vibes to your day.`
    : `Curated by Moodie to match your "${place.mood || 'current'}" mood perfectly.`);

  const handleAsk = async (questionText) => {
    if (!questionText?.trim() || isAsking) return;
    setActiveQuestion(questionText);
    setIsAsking(true);
    setErrorMsg('');
    setAnswer('');

    try {
      const res = await askAboutPlace(name, address, questionText, place.mood);
      setAnswer(res.answer || "Here is what I found for you! Enjoy your visit! ✨");
    } catch (err) {
      setErrorMsg(err.message || "Couldn't retrieve details right now. Please try again! 🤔");
    } finally {
      setIsAsking(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customQuestion.trim()) {
      handleAsk(customQuestion);
      setCustomQuestion('');
    }
  };

  return (
    <div
      className="card-enter"
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #EDE8E0',
        overflow: 'hidden',
        width: '320px',
        maxHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Decorative colored header accent line */}
      <div style={{ height: '5px', background: 'linear-gradient(90deg, #C4B5FD 0%, #FDBA74 50%, #FCA5A5 100%)', flexShrink: 0 }} />

      <div style={{ padding: '16px 16px 14px', overflowY: 'auto', flex: 1 }}>
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
          <p style={{ fontSize: '12px', color: '#9C8B7A', margin: '0 0 10px', lineHeight: 1.45 }}>
            📍 {address}
          </p>
        )}

        {/* Moodie AI Reasoning Dropdown / Accordion */}
        <div style={{ marginBottom: '10px' }}>
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

        {/* ── Follow-Up Section: Ask Moodie AI About This Place ── */}
        <div style={{ marginBottom: '12px' }}>
          <button
            type="button"
            onClick={() => setIsFollowUpOpen(!isFollowUpOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              background: isFollowUpOpen ? '#FFF9EB' : '#FAF8F5',
              border: isFollowUpOpen ? '1px solid #FDE68A' : '1px solid #EDE8E0',
              borderRadius: '12px',
              padding: '7px 11px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              if (!isFollowUpOpen) e.currentTarget.style.background = '#F5EFE6';
            }}
            onMouseOut={(e) => {
              if (!isFollowUpOpen) e.currentTarget.style.background = '#FAF8F5';
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: isFollowUpOpen ? '#B45309' : '#5C4838' }}>
              <span>💬</span>
              <span>Ask Moodie for Details</span>
            </span>
            <span
              style={{
                fontSize: '11px',
                color: isFollowUpOpen ? '#B45309' : '#8C7A6B',
                transform: isFollowUpOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
              }}
            >
              ▼
            </span>
          </button>

          {/* Expandable Follow-Up Body */}
          {isFollowUpOpen && (
            <div
              style={{
                marginTop: '6px',
                background: '#FFFDF9',
                border: '1px solid #F1E9DA',
                borderRadius: '12px',
                padding: '10px 10px',
                animation: 'bubble-pop 0.2s ease-out',
              }}
            >
              <p style={{ margin: '0 0 7px', fontSize: '11px', fontWeight: 700, color: '#8C7A6B' }}>
                Choose a question or type your own:
              </p>

              {/* 1-3 Pre-defined Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '8px' }}>
                {PREDEFINED_QUESTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAsk(item.question)}
                    disabled={isAsking}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: activeQuestion === item.question ? '#EDE9FE' : '#F7F3EE',
                      border: activeQuestion === item.question ? '1px solid #C4B5FD' : '1px solid transparent',
                      borderRadius: '8px',
                      padding: '5px 8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: activeQuestion === item.question ? '#6D28D9' : '#4A3B32',
                      cursor: isAsking ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={(e) => {
                      if (activeQuestion !== item.question && !isAsking) {
                        e.currentTarget.style.background = '#EFEAE1';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (activeQuestion !== item.question && !isAsking) {
                        e.currentTarget.style.background = '#F7F3EE';
                      }
                    }}
                  >
                    <span>{item.emoji}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span style={{ fontSize: '10px', color: '#9C8B7A' }}>→</span>
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  placeholder="Ask anything else..."
                  disabled={isAsking}
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    border: '1px solid #DCD5CB',
                    borderRadius: '8px',
                    padding: '5px 9px',
                    fontSize: '11px',
                    color: '#3D2C1E',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#A78BFA')}
                  onBlur={(e) => (e.target.style.borderColor = '#DCD5CB')}
                />
                <button
                  type="submit"
                  disabled={isAsking || !customQuestion.trim()}
                  style={{
                    background: '#7C3AED',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '5px 9px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: isAsking || !customQuestion.trim() ? 'not-allowed' : 'pointer',
                    opacity: isAsking || !customQuestion.trim() ? 0.5 : 1,
                  }}
                >
                  Ask
                </button>
              </form>

              {/* AI Response Output Bubble */}
              {isAsking && (
                <div
                  style={{
                    background: '#FAF5FF',
                    border: '1px solid #E9D5FF',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: '#7C3AED',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span className="animate-spin" style={{ display: 'inline-block' }}>✨</span>
                  <span>Moodie is thinking...</span>
                </div>
              )}

              {answer && !isAsking && (
                <div
                  style={{
                    background: '#FAF5FF',
                    border: '1px solid #DDD6FE',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    animation: 'bubble-pop 0.2s ease-out',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '5px' }}>
                    <span style={{ fontSize: '12px' }}>🤖</span>
                    <p style={{ margin: 0, fontSize: '11px', color: '#3D2C1E', lineHeight: 1.45, fontWeight: 500 }}>
                      {answer}
                    </p>
                  </div>
                </div>
              )}

              {errorMsg && (
                <div style={{ marginTop: '4px', color: '#DC2626', fontSize: '10px', fontWeight: 600 }}>
                  ⚠️ {errorMsg}
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
          onMouseOver={(e) => (e.currentTarget.style.background = '#EDE9FE')}
          onMouseOut={(e) => (e.currentTarget.style.background = '#F5F0FF')}
        >
          View on Maps ↗
        </a>
      </div>
    </div>
  );
}
