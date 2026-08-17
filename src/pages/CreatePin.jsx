import { useLocation, useNavigate } from "react-router";
import CreatePinPanel from "../components/CreatePinPanel";
import { createPin } from "../api/pins";

export default function CreatePin() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLocation = location.state;

  if (!selectedLocation) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="text-5xl">📍</div>

          <h1 className="mt-4 text-2xl font-black text-[#161616]">
            No location selected
          </h1>

          <p className="mt-2 text-[#6F6A66]">
            Go to Explore, click Add Mood Pin, then choose a location on the
            map.
          </p>

          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="mt-6 rounded-xl bg-[#B4232C] px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  async function handleCreatePin(formData) {
    try {
      const newPin = await createPin({
        locationName: formData.locationName,
        mood: formData.mood,
        description: formData.description || formData.notes || "New Mood Pin",
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });

      navigate("/explore", {
        state: {
          createdPin: newPin,
        },
      });
    } catch (error) {
      console.error("Could not create pin", error);
    }
  }

  function handleCancelPin() {
    navigate("/explore");
  }

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6">
      <CreatePinPanel
        location={selectedLocation}
        onSubmit={handleCreatePin}
        onCancel={handleCancelPin}
      />
    </section>
  );
}
