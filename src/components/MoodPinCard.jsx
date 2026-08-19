import { Link } from "react-router";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";

const fallbackPinImage =
  "https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=700&q=80";

export default function MoodPinCard({ pin, onDelete }) {
  return (
    <article className="mood-pin-card">
      <div className="mood-pin-image-wrap">
        <img
          src={pin.image || fallbackPinImage}
          alt={pin.locationName || "Mood pin"}
          className="mood-pin-image"
          onError={(event) => {
            event.currentTarget.src = fallbackPinImage;
          }}
        />
        <div className="mood-pin-image-overlay" />
        <div className="mood-pin-actions">
          <Link
            className="mood-pin-action"
            to={`/pins/${pin.id}/edit`}
            aria-label="Edit pin"
          >
            <FaEdit />
          </Link>
          <button
            type="button"
            className="mood-pin-action mood-pin-action-danger"
            onClick={() => onDelete(pin.id)}
            aria-label="Delete pin"
          >
            <MdDelete />
          </button>
        </div>
      </div>

      <div className="mood-pin-body">
        <div className="mood-pin-mood">{pin.mood}</div>

        <h3 className="mood-pin-title">{pin.locationName || "Unnamed place"}</h3>

        {pin.description && (
          <p className="mood-pin-description">{pin.description}</p>
        )}

        <div className="mood-pin-location">
          <FiMapPin />
          <span>
            {Number(pin.latitude).toFixed(4)}, {Number(pin.longitude).toFixed(4)}
          </span>
        </div>
      </div>
    </article>
  );
}
