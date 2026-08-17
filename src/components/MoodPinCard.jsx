import { Link } from "react-router";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function MoodPinCard({ pin, onDelete}) {
  return (
    <article className="mood-pin-card">
      <div className="mood-pin-mood">{pin.mood}</div>

      <h3 className="mood-pin-title">{pin.locationName}</h3>

      {pin.description && (
        <p className="mood-pin-description">{pin.description}</p>
      )}
      <div className="mood-pin-location">
        <span>📍</span>
        <span>
          {pin.latitude}, {pin.longitude}
        </span>
      </div>
      <Link className="edit-icon" to={`/pins/${pin.id}/edit`}><FaEdit/></Link>
       <button
        type="button"
        className="delete-icon"
        onClick={() => onDelete(pin.id)}
        aria-label="Delete pin"
      >
        <MdDelete />
      </button>
    </article>
  );
}
