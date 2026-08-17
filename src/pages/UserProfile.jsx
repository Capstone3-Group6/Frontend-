import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getMyPins, deletePin } from "../api/pins";
import MoodPinCard from "../components/MoodPinCard";

// rest of profile

export default function UserProfile({ user }) {
  const navigate = useNavigate();
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

  async function handleDeletePin(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Mood Pin?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePin(id);
      setMoodPins((currentPins) =>
        currentPins.filter((pin) => String(pin.id) !== String(id)),
      );
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  }

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

          <p className="profile-email">{user.email}</p>
          {user.bio ? (
            <p className="profile-bio">{user.bio}</p>
          ) : (
            <p className="profile-bio-empty">No bio yet</p>
          )}
        </div>

        <div className="profile-pin-count">
          <span>Total Pins</span>
          <strong>{moodPins.length}</strong>
        </div>
      </section>
      <section className="profile-pins">
        <h2>My Mood Pins</h2>

        <div className="profile-pins-grid">
          {moodPins.map((pin) => (
            <MoodPinCard key={pin.id} pin={pin} onDelete={handleDeletePin} />
          ))}
        </div>
      </section>
    </main>
  );
}
