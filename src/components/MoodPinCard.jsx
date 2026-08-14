import { Link } from "react-router";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function MoodPinCard({ pin }) {
  return (
    <article className="mood-pin-card">
      <div className="mood-pin-mood">
        {pin.mood}
      </div>

      <h3 className="mood-pin-title">
        {pin.locationName}
      </h3>

      {pin.description && (
        <p className="mood-pin-description">
          {pin.description}
        </p>
      )}
       <div className="mood-pin-location">
        <span>📍</span>
        <span>
          {pin.latitude}, {pin.longitude}
        </span>
      </div>
<FaEdit/>
<MdDelete />
    </article>
  );
}