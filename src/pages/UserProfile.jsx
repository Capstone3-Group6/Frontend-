import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getMyPins, deletePin } from "../api/pins";
import { updateMyProfile } from "../api/users";
import MoodPinCard from "../components/MoodPinCard";

const avatarSeeds = ["Nova", "Milo", "Sage", "Luna", "Kai", "Zara"];

function avatarForSeed(seed) {
  return `https://api.dicebear.com/9.x/personas/svg?seed=${seed}`;
}

function resizeAvatarFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 520;
        const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };

      image.onerror = () => reject(new Error("Could not read this image."));
      image.src = reader.result;
    };

    reader.onerror = () => reject(new Error("Could not upload this image."));
    reader.readAsDataURL(file);
  });
}

export default function UserProfile({ user, setUser }) {
  const {
    isAuthenticated: isAuth0User,
    getAccessTokenSilently,
  } = useAuth0();
  const [moodPins, setMoodPins] = useState([]);
  const [pinsLoading, setPinsLoading] = useState(true);
  const [pinsError, setPinsError] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-state-card">Loading profile...</div>
      </main>
    );
  }

  const displayName = user.userName || user.username || "Mood Mapper";
  const avatarUrl =
    selectedAvatar || user.profileImage || avatarForSeed(displayName);
  const uniqueMoods = new Set(moodPins.map((pin) => pin.mood)).size;
  const newestPin = moodPins[0];

  useEffect(() => {
    async function loadMyPins() {
      try {
        setPinsLoading(true);
        setPinsError(null);

        const pins = await getMyPins();
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

  useEffect(() => {
    setSelectedAvatar(user.profileImage || "");
  }, [user.profileImage]);

  async function handleAvatarUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setProfileMessage("");
      setProfileError("");
      const resizedAvatar = await resizeAvatarFile(file);
      setSelectedAvatar(resizedAvatar);
    } catch (error) {
      setProfileError(error.message || "Could not upload this image.");
    } finally {
      event.target.value = "";
    }
  }

  function handleChooseAvatar(avatar) {
    setSelectedAvatar(avatar);
      setProfileMessage("");
      setProfileError("");
  }

  async function handleSaveAvatar() {
    try {
      setIsSavingProfile(true);
      setProfileMessage("");
      setProfileError("");

      let token;

      if (isAuth0User) {
        token = await getAccessTokenSilently();
      }

      const updatedUser = await updateMyProfile(
        {
          userName: user.userName || user.username,
          bio: user.bio,
          profileImage: selectedAvatar,
        },
        token,
      );

      setUser?.(updatedUser);
      setProfileMessage("Profile picture updated.");
    } catch (error) {
      setProfileError(error.message || "Could not update profile picture.");
    } finally {
      setIsSavingProfile(false);
    }
  }

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
      <section className="profile-hero">
        <div className="profile-hero-main">
          <div className="profile-avatar">
            <img
              src={avatarUrl}
              alt={`${displayName}'s avatar`}
              className="profile-avatar-image"
            />
          </div>

          <div className="profile-info">
            <p className="profile-kicker">Mood Map Profile</p>
            <h1>{displayName}</h1>

            <p className="profile-email">{user.email}</p>
            {user.bio ? (
              <p className="profile-bio">{user.bio}</p>
            ) : (
              <p className="profile-bio-empty">
                Add a bio later to tell people what kind of places you love.
              </p>
            )}
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span>Total Pins</span>
            <strong>{moodPins.length}</strong>
          </div>
          <div className="profile-stat">
            <span>Moods</span>
            <strong>{uniqueMoods}</strong>
          </div>
          <div className="profile-stat profile-stat-wide">
            <span>Latest</span>
            <strong>{newestPin?.mood || "None"}</strong>
          </div>
        </div>
      </section>

      <section className="profile-avatar-panel">
        <div>
          <p className="profile-kicker">Profile picture</p>
          <h2>Choose your look</h2>
          <p>
            Upload a photo or pick a clean generated avatar. Save it and your
            new picture will show across Mood Map.
          </p>
        </div>

        <div className="profile-avatar-tools">
          <label className="profile-upload-button">
            Upload photo
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarUpload}
            />
          </label>

          <div className="profile-avatar-options">
            {avatarSeeds.map((seed) => {
              const avatar = avatarForSeed(seed);
              const isSelected = selectedAvatar === avatar;

              return (
                <button
                  type="button"
                  key={seed}
                  onClick={() => handleChooseAvatar(avatar)}
                  className={isSelected ? "is-selected" : ""}
                  aria-label={`Choose ${seed} avatar`}
                >
                  <img src={avatar} alt="" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSaveAvatar}
            disabled={isSavingProfile || !selectedAvatar}
            className="profile-save-button"
          >
            {isSavingProfile ? "Saving..." : "Save picture"}
          </button>

          {(profileMessage || profileError) && (
            <p
              className={
                profileError ? "profile-avatar-error" : "profile-avatar-message"
              }
            >
              {profileError || profileMessage}
            </p>
          )}
        </div>
      </section>

      <section className="profile-pins">
        <div className="profile-section-heading">
          <div>
            <p className="profile-kicker">Your places</p>
            <h2>My Mood Pins</h2>
          </div>
          <span>{moodPins.length} total</span>
        </div>

        {pinsError && (
          <p className="profile-state-card profile-error">{pinsError}</p>
        )}

        {pinsLoading ? (
          <div className="profile-pins-grid">
            {[1, 2, 3].map((item) => (
              <div key={item} className="profile-skeleton-card" />
            ))}
          </div>
        ) : moodPins.length > 0 ? (
          <div className="profile-pins-grid">
            {moodPins.map((pin) => (
              <MoodPinCard key={pin.id} pin={pin} onDelete={handleDeletePin} />
            ))}
          </div>
        ) : (
          <div className="profile-empty">
            <h3>No pins yet</h3>
            <p>
              Create your first Mood Pin from the map and it will appear here
              with its photo, mood, and location.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
