import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { FiExternalLink, FiMapPin, FiTrash2 } from "react-icons/fi";
import { getSavedPins, unsavePin } from "../api/pins";

const fallbackPinImage =
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=700&q=80";

export default function Saved({ user }) {
  const {
    isAuthenticated: isAuth0User,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
  } = useAuth0();

  const [savedPins, setSavedPins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const displayName = user?.userName || user?.username || "Mood Mapper";
  const moodCount = new Set(savedPins.map((pin) => pin.mood)).size;

  useEffect(() => {
    async function loadSavedPins() {
      try {
        setIsLoading(true);
        setError("");

        let token;

        if (isAuth0User) {
          token = await getAccessTokenSilently();
        }

        const pins = await getSavedPins(token);
        setSavedPins(Array.isArray(pins) ? pins : []);
      } catch (loadError) {
        setError(loadError.message || "Could not load saved pins.");
        setSavedPins([]);
      } finally {
        setIsLoading(false);
      }
    }

    if (!isAuth0Loading) {
      loadSavedPins();
    }
  }, [getAccessTokenSilently, isAuth0Loading, isAuth0User]);

  async function handleRemoveSaved(pinId) {
    const confirmed = window.confirm(
      "Remove this place from your saved pins?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(pinId);

      let token;

      if (isAuth0User) {
        token = await getAccessTokenSilently();
      }

      await unsavePin(pinId, token);
      setSavedPins((currentPins) =>
        currentPins.filter((pin) => String(pin.id) !== String(pinId)),
      );
    } catch (removeError) {
      setError(removeError.message || "Could not remove saved pin.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="saved-page">
      <section className="saved-hero">
        <div>
          <p className="saved-kicker">Saved Places</p>
          <h1>{displayName}'s favorites</h1>
          <p>
            Keep the places you want to revisit close by. Your saved Mood Pins
            stay synced with the database and can be removed any time.
          </p>
        </div>

        <div className="saved-stats">
          <div>
            <span>Saved</span>
            <strong>{savedPins.length}</strong>
          </div>
          <div>
            <span>Moods</span>
            <strong>{moodCount}</strong>
          </div>
        </div>
      </section>

      {error && (
        <p role="alert" className="saved-alert">
          {error}
        </p>
      )}

      {isLoading ? (
        <section className="saved-grid">
          {[1, 2, 3].map((item) => (
            <div key={item} className="saved-skeleton-card" />
          ))}
        </section>
      ) : savedPins.length > 0 ? (
        <section className="saved-grid">
          {savedPins.map((pin) => (
            <article key={pin.id} className="saved-card">
              <div className="saved-card-image-wrap">
                <img
                  src={pin.image || fallbackPinImage}
                  alt={pin.locationName || "Saved mood pin"}
                  className="saved-card-image"
                  onError={(event) => {
                    event.currentTarget.src = fallbackPinImage;
                  }}
                />
                <span className="saved-card-chip">{pin.mood}</span>
              </div>

              <div className="saved-card-body">
                <h2>{pin.locationName || "Unnamed place"}</h2>
                {pin.description && <p>{pin.description}</p>}

                <div className="saved-card-meta">
                  <span>
                    <FiMapPin />
                    {Number(pin.latitude).toFixed(4)},{" "}
                    {Number(pin.longitude).toFixed(4)}
                  </span>
                </div>

                <div className="saved-card-actions">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${pin.latitude},${pin.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="saved-map-link"
                  >
                    <FiExternalLink />
                    Maps
                  </a>

                  <button
                    type="button"
                    onClick={() => handleRemoveSaved(pin.id)}
                    disabled={removingId === pin.id}
                    className="saved-remove-button"
                  >
                    <FiTrash2 />
                    {removingId === pin.id ? "Removing" : "Remove"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="saved-empty">
          <h2>No favorites yet</h2>
          <p>
            Tap a heart on a map pin or nearby place card and it will show up
            here.
          </p>
        </section>
      )}
    </main>
  );
}
