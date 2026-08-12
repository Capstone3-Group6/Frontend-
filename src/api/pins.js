const TEMP_PINS_KEY = 'mood-map-temp-pins';

// Temporary frontend storage for mood pins while the backend
// GET /api/pins and POST /api/pins endpoints are still being built.
//
// Later:
// - readTemporaryPins() should be replaced by GET /api/pins
// - saveTemporaryPin() should be replaced by POST /api/pins

export function readTemporaryPins() {
  try {
    const savedPins = localStorage.getItem(TEMP_PINS_KEY);

    // localStorage stores only strings, so saved pins must be parsed
    // back into JavaScript objects before the map can render them.
    return savedPins ? JSON.parse(savedPins) : [];
  } catch (error) {
    console.error('Could not read temporary pins:', error);
    return [];
  }
}

export function saveTemporaryPin(pin) {
  const currentPins = readTemporaryPins();
  const nextPins = [...currentPins, pin];

  // This keeps pins visible after navigating from /create-pin
  // back to /explore, and even after a browser refresh during development.
  localStorage.setItem(TEMP_PINS_KEY, JSON.stringify(nextPins));

  return nextPins;
}
