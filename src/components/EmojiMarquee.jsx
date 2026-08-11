// EmojiMarquee.jsx — Infinitely scrolling emoji strip

const EMOJIS = [
  '😊','🌟','🎵','😴','🎨','⚡','💖','🧠','✨','🍃',
  '🌸','🎯','🌊','🔥','🍀','🌙','🎭','🧁','🌺','💫',
];

export default function EmojiMarquee() {
  const doubled = [...EMOJIS, ...EMOJIS];

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '999px',
        padding: '7px 18px',
        boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
        border: '1px solid #EDE8E0',
        overflow: 'hidden',
        width: '280px',
        userSelect: 'none',
      }}
    >
      <div className="marquee-track">
        {doubled.map((emoji, i) => (
          <span key={i} style={{ fontSize: '19px', flexShrink: 0 }}>
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
