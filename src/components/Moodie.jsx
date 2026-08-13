// Added by Musaddik
// Moodie.jsx — Lottie-powered AI robot character with dynamic animations

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Animation URLs from LottieFiles CDN
const WAVING_LOTTIE = 'https://lottie.host/3a5fefd0-fdb6-4211-bc4d-b8e48eaba938/CBdUjTR77Q.lottie';
const LOADING_LOTTIE = 'https://lottie.host/f6aa3239-7de1-46fe-b155-0c6bc19725dc/x8R9zKQXqP.lottie';

const SIZES = { sm: 52, md: 88, lg: 120 };

export default function Moodie({ size = 'md', state = 'waving', style = {} }) {
  const px = SIZES[size];

  // Pick animation source based on state
  const isSearching = state === 'loading';
  const lottieSrc = isSearching ? LOADING_LOTTIE : WAVING_LOTTIE;

  // CSS animation classes from index.css:
  // - 'moodie-loading' pulses the drop shadow.
  // - 'moodie-bounce' floats Moodie up and down when idle.
  const containerClass = isSearching ? 'moodie-loading' : 'moodie-bounce';

  return (
    <div
      className={containerClass}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: px,
        height: px,
        ...style,
      }}
    >
      {/* 
        custom Lottie animation (LOADING_LOTTIE)
      */}
      <DotLottieReact
        src={lottieSrc}
        loop
        autoplay
        style={{ width: px, height: px, display: 'block' }}
      />
    </div>
  );
}
