import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deletePin } from "../api/pins";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const moods = [
  "Calm",
  "Creative",
  "Fun",
  "Energetic",
  "Romantic",
  "Focused",
  "Inspiring",
];

export default function EditPin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    locationName: "",
    mood: "Calm",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchPin();
  }, [id]);

  async function fetchPin() {
    try {
      setIsLoading(true);
      setFormError("");

      const response = await fetch(`${API_URL}/pins/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      setForm({
        locationName: data.locationName,
        mood: data.mood,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    } catch (error) {
      console.error("Failed to load pin:", error);
      setFormError("Failed to load the pin.");
    } finally {
      setIsLoading(false);
    }
  }

  function onFormChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.locationName.trim()) {
      setFormError("Place name is required.");
      return;
    }

    if (!form.mood) {
      setFormError("Please select a mood.");
      return;
    }

    try {
      setFormError("");

      const response = await fetch(`${API_URL}/pins/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationName: form.locationName.trim(),
          mood: form.mood,
          description: form.description.trim(),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));

        throw new Error(
          body.error || `Server responded with ${response.status}`,
        );
      }

      const updatedPin = await response.json();

      navigate("/profile");
    } catch (error) {
      console.error("Failed to update pin:", error);
      setFormError(error.message || "Failed to update the pin.");
    }
  }

  function handleCancel() {
    navigate("/explore");
  }


  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="font-bold text-[#6F6A66]">Loading Mood Pin...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      <div className="rounded-[32px] bg-white p-6 shadow-lg sm:p-8">
        <h1 className="text-3xl font-black text-[#171326]">✏️ Edit Mood Pin</h1>

        <p className="mt-2 text-[#6F6A66]">
          Change the information below and save your changes.
        </p>

        <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
          {formError && (
            <p className="rounded-2xl bg-red-50 p-4 font-semibold text-red-700">
              {formError}
            </p>
          )}

          <label>
            <span className="text-sm font-bold text-[#171326]">Place Name</span>

            <input
              type="text"
              name="locationName"
              value={form.locationName}
              onChange={onFormChange}
              className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#DDD8D2] px-4 py-3 outline-none focus:border-[#B4232C]"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-[#171326]">Mood</span>

            <select
              name="mood"
              value={form.mood}
              onChange={onFormChange}
              className="mt-2 min-h-[52px] w-full rounded-2xl border border-[#DDD8D2] px-4 py-3 outline-none focus:border-[#B4232C]"
            >
              {moods.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-sm font-bold text-[#171326]">
              Description
            </span>

            <textarea
              name="description"
              value={form.description}
              onChange={onFormChange}
              rows="4"
              maxLength="180"
              className="mt-2 w-full resize-none rounded-2xl border border-[#DDD8D2] px-4 py-3 outline-none focus:border-[#B4232C]"
            />

            <span className="mt-1 block text-right text-xs text-[#6F6A66]">
              {form.description.length}/180
            </span>
          </label>

          <div className="rounded-2xl bg-[#F8F6F3] p-4">
            <p className="text-sm font-bold text-[#171326]">📍 Pin location</p>

            <p className="mt-1 text-sm text-[#6F6A66]">
              Latitude: {form.latitude}
            </p>

            <p className="text-sm text-[#6F6A66]">
              Longitude: {form.longitude}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-2xl border border-[#DDD8D2] px-5 py-3 font-bold text-[#6F6A66]"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 rounded-2xl bg-[#B4232C] px-5 py-3 font-bold text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
