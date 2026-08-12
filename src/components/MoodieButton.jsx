// Added by Musaddik
// MoodieButton.jsx — Floating corner button: Moodie sits directly in the corner with hover bubble

import { useState } from 'react';
import Moodie from './Moodie';

export default function MoodieButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px', // floating slightly off the bottom corner
        right: '28px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* ── Moodie robot container ── */}
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
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
            psst... tell me how you're feeling 🌸
          </div>
        )}

        {/* Moodie robot — dynamic scaling / hover jump */}
        <div
          style={{
            transform: hovered ? 'translateY(-6px) scale(1.05)' : 'translateY(0) scale(1)',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Sits floating at sm size (52px) */}
          <Moodie size="sm" state="waving" />
        </div>
      </div>
    </div>
  );
}
