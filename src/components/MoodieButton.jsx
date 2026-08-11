// MoodieButton.jsx — Floating corner button: Moodie peeking above the emoji marquee

import { useState } from 'react';
import Moodie from './Moodie';
import EmojiMarquee from './EmojiMarquee';

export default function MoodieButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: '28px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* ── Moodie section ── */}
      <div
        role="button"
        aria-label="Open Moodie mood assistant"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => e.key === 'Enter' && onClick()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          marginBottom: '-12px', // pull Moodie behind the marquee strip
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          zIndex: 2,
        }}
      >
        {/* Speech bubble (hover only) */}
        {hovered && (
          <div
            className="bubble-enter"
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)',
              right: '4px',
              background: 'white',
              borderRadius: '14px 14px 4px 14px',
              padding: '9px 13px',
              boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              fontWeight: 600,
              color: '#3D2C1E',
              border: '1px solid #EDE8E0',
              pointerEvents: 'none',
            }}
          >
            hi! tell me how you're feeling 🌸
          </div>
        )}

        {/* Moodie robot — nudges up on hover */}
        <div
          style={{
            transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <Moodie size="sm" state="waving" />
        </div>
      </div>

      {/* ── Emoji marquee strip (sits in front of Moodie's body) ── */}
      <div style={{ position: 'relative', zIndex: 3 }}>
        <EmojiMarquee />
      </div>

      {/* Small breathing room at very bottom */}
      <div style={{ height: '10px' }} />
    </div>
  );
}
