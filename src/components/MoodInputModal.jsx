// MoodInputModal.jsx — Moodie's popup input with typewriter-effect library placeholder

import { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import Moodie from './Moodie';

const MOOD_OPTIONS = [
  { label: '😊 Happy',     value: 'Happy',     bg: '#FDE68A' },
  { label: '🧘 Calm',      value: 'Calm',      bg: '#BAE6FD' },
  { label: '🎨 Creative',  value: 'Creative',  bg: '#FBCFE8' },
  { label: '⚡ Energetic', value: 'Energetic', bg: '#FED7AA' },
  { label: '💖 Romantic',  value: 'Romantic',  bg: '#FECDD3' },
  { label: '🧠 Focused',   value: 'Focused',   bg: '#DDD6FE' },
  { label: '✨ Inspiring', value: 'Inspiring', bg: '#D9F99D' },
];

const SUGGESTIONS = [
  "I'm feeling adventurous today...",
  "I need somewhere calm and cozy...",
  "I want to explore something creative...",
  "Feeling romantic — looking for a nice spot...",
  "I need an energy boost...",
  "Looking for somewhere to focus and think...",
  "I want to feel inspired...",
];

export default function MoodInputModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [moodText,     setMoodText]     = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef(null);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen, isLoading]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setMoodText('');
      setSelectedMood(null);
      setInputFocused(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (mood) => {
    const query = mood || moodText.trim();
    if (!query) return;
    setSelectedMood(mood || null);
    onSubmit(query);
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={() => !isLoading && onClose()}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(250,248,245,0.65)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          zIndex: 1100,
        }}
      />

      {/* ── Modal panel ── */}
      <div
        className="modal-enter"
        style={{
          position: 'fixed',
          bottom: '82px',
          right: '28px',
          zIndex: 1200,
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          width: '340px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.11), 0 4px 16px rgba(167,139,250,0.14)',
          border: '1px solid #EDE8E0',
        }}
      >
        {isLoading ? (
          /* ── Loading state ── */
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'14px', padding:'8px 0 4px' }}>
            <Moodie size="md" state="loading" />
            <div style={{ textAlign:'center' }}>
              <p style={{ fontSize:'17px', fontWeight:700, color:'#3D2C1E', margin:'0 0 10px' }}>
                Finding your vibe...
              </p>
              <div style={{ display:'flex', justifyContent:'center', gap:'6px' }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    style={{
                      width: 9, height: 9,
                      borderRadius: '50%',
                      background: '#C4B5FD',
                      animation: `loading-dot 1.2s ease-in-out ${delay}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Input state ── */
          <>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'18px' }}>
              <Moodie size="sm" state="waving" />
              <div>
                <p style={{ fontSize:'15px', fontWeight:700, color:'#3D2C1E', margin:0 }}>
                  Hey, I'm Moodie! 👋
                </p>
                <p style={{ fontSize:'12px', color:'#9C8B7A', margin:'3px 0 0' }}>
                  Tell me how you feel — I'll find the perfect spot
                </p>
              </div>
            </div>

            {/* ── Input with typewriter-effect as visual placeholder ── */}
            <div style={{ position:'relative', marginBottom:'14px' }}>

              {/* Typewriter placeholder — shown only when input is empty & unfocused */}
              {!moodText && !inputFocused && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '15px',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                    fontSize: '14px',
                    color: '#B0A090',
                    lineHeight: 1,
                  }}
                >
                  <Typewriter
                    options={{
                      strings: SUGGESTIONS,
                      autoStart: true,
                      loop: true,
                      delay: 65,
                      deleteSpeed: 35,
                      pauseFor: 1800,
                      cursorClassName: 'moodie-tw-cursor',
                      wrapperClassName: 'moodie-tw-wrapper',
                    }}
                  />
                </div>
              )}

              {/* Actual text input (transparent placeholder so typewriter shows through) */}
              <input
                ref={inputRef}
                value={moodText}
                onChange={e => setMoodText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit(null)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder=""
                style={{
                  width: '100%',
                  background: '#FAF8F5',
                  border: '2px solid',
                  borderColor: inputFocused ? '#C4B5FD' : '#EDE8E0',
                  borderRadius: '14px',
                  padding: '13px 50px 13px 15px',
                  fontSize: '14px',
                  color: '#3D2C1E',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s',
                  position: 'relative',
                  zIndex: 2,
                  background: 'transparent',
                }}
              />

              {/* Submit button */}
              {moodText.trim() && (
                <button
                  onClick={() => handleSubmit(null)}
                  style={{
                    position: 'absolute',
                    right: '8px', top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 3,
                    background: '#A78BFA',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    padding: '6px 11px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    lineHeight: 1,
                  }}
                >
                  Go ✨
                </button>
              )}

              {/* Input background (behind the transparent input so border shows) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#FAF8F5',
                  borderRadius: '14px',
                  border: `2px solid ${inputFocused ? '#C4B5FD' : '#EDE8E0'}`,
                  zIndex: 0,
                  transition: 'border-color 0.2s',
                  pointerEvents: 'none',
                }}
              />
            </div>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
              <div style={{ flex:1, height:'1px', background:'#EDE8E0' }} />
              <span style={{ fontSize:'11px', color:'#9C8B7A', whiteSpace:'nowrap' }}>or pick a mood</span>
              <div style={{ flex:1, height:'1px', background:'#EDE8E0' }} />
            </div>

            {/* Mood pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'7px' }}>
              {MOOD_OPTIONS.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => handleSubmit(mood.value)}
                  style={{
                    background: selectedMood === mood.value ? '#A78BFA' : mood.bg,
                    color: selectedMood === mood.value ? 'white' : '#3D2C1E',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '7px 13px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'transform 0.18s, background 0.18s',
                  }}
                  onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                  onMouseOut={e  => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
