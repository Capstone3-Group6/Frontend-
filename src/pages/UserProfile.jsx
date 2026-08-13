import { useEffect, useState } from "react";
import { getMyPins } from "../api/pins";

// rest of profile

export default function UserProfile({ user }) {
  const [moodPins, setMoodPins] = useState([]);
  const [pinsLoading, setPinsLoading] = useState(true);
  const [pinsError, setPinsError] = useState(null);
  console.log("The user is :", user);
  if (!user) {
    return <p>Loading profile...</p>;
  }
  console.log("The username is :", user.userName);
  console.log("The username is :", user.email);

  const avatarUrl = `https://api.dicebear.com/9.x/personas/svg?seed=${user.userName}`;

  useEffect(() => {
    async function loadMyPins() {
      try {
        setPinsLoading(true);
        setPinsError(null);

        const pins = await getMyPins();

        console.log("MY MOOD PINS:", pins);

        setMoodPins(pins);
      } catch (error) {
        console.error("Could not load mood pins:", error);

        setPinsError(error.message);
      } finally {
        setPinsLoading(false);
      }
    }

    loadMyPins();
  }, []);

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar">
          <img
            src={avatarUrl}
            alt={`${user.username}'s avatar`}
            className="profile-avatar-image"
          />
        </div>

        <div className="profile-info">
          <h1>{user.userName}</h1>

          <p>{user.email}</p>
          {user.bio ? (
            <p className="profile-bio">{user.bio}</p>
          ) : (
            <p className="profile-bio-empty">No bio yet</p>
          )}

          <pre>{JSON.stringify(moodPins, null, 2)}</pre>
        </div>
      </section>
    </main>
  );
}
