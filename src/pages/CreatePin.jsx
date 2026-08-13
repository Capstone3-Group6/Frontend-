import { useLocation, useNavigate } from 'react-router';
import CreatePinPanel from '../components/CreatePinPanel';
import { saveTemporaryPin } from '../api/pins';

export default function CreatePin() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedLocation = location.state;
  const defaultPinImage =
    'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80';

  // selectedLocation comes from MoodMap.jsx after the user clicks
  // a point on the Leaflet map while Add Mood Pin mode is active.

  if (!selectedLocation) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="text-5xl">📍</div>
          <h1 className="mt-4 text-2xl font-black text-[#161616]">
            No location selected
          </h1>
          <p className="mt-2 text-[#6F6A66]">
            Go to Explore, click Add Mood Pin, then choose a location on the map.
          </p>
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="mt-6 rounded-xl bg-[#B4232C] px-6 py-3 font-semibold text-white transition hover:scale-105"
          >
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  function handleCreatePin(formData) {
    const newPin = {
      id: Date.now(),
      lat: selectedLocation.latitude,
      lng: selectedLocation.longitude,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      placeName: formData.placeName,
      mood: formData.mood,
      description: formData.description || formData.notes || 'A new mood pin.',
      notes: formData.notes,
      photoName: formData.photoName,
      privacy: formData.privacy || 'Public',
      username: '@samiallo',
      image: formData.image || defaultPinImage,
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    };

    // Temporary frontend persistence:
    // saveTemporaryPin writes to localStorage so the pin is still
    // available after navigating back to /explore or refreshing.
    //
    // Later this block should be replaced by POST /api/pins.
    saveTemporaryPin(newPin);

    navigate('/explore', {
      state: {
        createdPin: newPin,
      },
    });
  }

  function handleCancelPin() {
    navigate('/explore');

    // Cancel returns to the map without saving anything.
  }

  return (
    <section className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6">
      <CreatePinPanel
        location={selectedLocation}
        onCreate={handleCreatePin}
        onCancel={handleCancelPin}
      />
    </section>
  );
}
