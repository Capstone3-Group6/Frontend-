const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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
