// MoodieButton.jsx — Prominent floating AI assistant launcher with animated avatar and speech bubble

import { useState } from 'react';
import Moodie from './Moodie';

export default function MoodieButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '28px',
        right: '28px',
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* ── Moodie floating action button ── */}
      <div
        role="button"
        aria-label="Ask Moodie AI"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
        }}
      >
        {/* Floating Speech Bubble */}
        <div
          className="bubble-enter"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 10px)',
            right: '0',
            background: '#FFFFFF',
            borderRadius: '16px 16px 4px 16px',
            padding: '8px 14px',
            boxShadow: '0 8px 24px rgba(61,44,30,0.14), 0 2px 6px rgba(0,0,0,0.06)',
            whiteSpace: 'nowrap',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#3D2C1E',
            border: '1.5px solid #EDE8E0',
            pointerEvents: 'none',
            opacity: hovered ? 1 : 0.92,
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span style={{ fontSize: '13px' }}>✨</span>
          <span>Tell Moodie how you feel!</span>
        </div>

        {/* Circular elevated badge container */}
        <div
          style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFFDFC 0%, #FAF6F0 100%)',
            border: '2.5px solid #EDE8E0',
            boxShadow: hovered
              ? '0 18px 44px rgba(180,35,44,0.28), 0 6px 16px rgba(61,44,30,0.14)'
              : '0 12px 34px rgba(61,44,30,0.18), 0 4px 12px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: hovered ? 'translateY(-4px) scale(1.06)' : 'translateY(0) scale(1)',
            transition: 'transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s ease',
          }}
        >
          {/* Moodie Robot Avatar */}
          <div style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Moodie size="sm" state={hovered ? 'waving' : 'idle'} style={{ width: '56px', height: '56px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
