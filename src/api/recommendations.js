// Added by Musaddik
// api/recommendations.js — calls the backend recommendations API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Fetches mood-based location recommendations.
 * @param {string} mood - The user's mood or custom feeling text.
 * @param {number} [latitude] - Optional latitude.
 * @param {number} [longitude] - Optional longitude.
 * @returns {Promise<{ mood: string, keywords: string[], recommendations: object[] }>}
 */
export async function getRecommendations(mood, latitude, longitude) {
  const res = await fetch(`${BASE_URL}/api/recommendations`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mood, latitude, longitude }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(
      body.error || `Could not fetch recommendations (${res.status})`,
    );
    error.code = body.code;
    error.detail = body.detail;
    error.missing = body.missing;
    error.provider = body.provider;
    throw error;
  }

  return res.json();
}

/**
 * Asks Moodie a follow-up question about a specific place.
 * @param {string} placeName - Name of the place.
 * @param {string} address - Address of the place.
 * @param {string} question - Question to ask Moodie.
 * @param {string} [mood] - Current mood.
 * @returns {Promise<{ answer: string }>}
 */
export async function askAboutPlace(placeName, address, question, mood) {
  const res = await fetch(`${BASE_URL}/api/recommendations/follow-up`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placeName, address, question, mood }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Could not get place details (${res.status})`);
  }

  return res.json();
}
