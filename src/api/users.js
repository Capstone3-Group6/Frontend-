const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function updateMyProfile(profileData, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    credentials: "include",
    headers,
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Could not update profile (${response.status})`);
  }

  return response.json();
}
