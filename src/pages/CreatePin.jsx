import { useLocation, useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";

import CreatePinPanel from "../components/CreatePinPanel";
import { createPin } from "../api/pins";

export default function CreatePin() {
  const location = useLocation();
  const navigate = useNavigate();

  // Auth0
  const {
    isAuthenticated,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
  } = useAuth0();

  // Location selected from the map
  const selectedLocation = location.state;

  // --------------------------------------------------
  // No location selected
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Create Pin
  // --------------------------------------------------

  async function handleCreatePin(formData) {
    try {
      // Make sure Auth0 has finished loading
      if (isAuth0Loading) {
        throw new Error("Authentication is still loading. Please try again.");
      }

      // Make sure the user is logged into Auth0
      if (!isAuthenticated) {
        throw new Error("You must be logged in to create a mood pin.");
      }

      // ----------------------------------------------
      // Get the Auth0 access token
      // ----------------------------------------------

      const token = await getAccessTokenSilently();

      console.log("Access token received:", Boolean(token));

      if (!token) {
        throw new Error("Could not get Auth0 access token.");
      }

      // ----------------------------------------------
      // Create the pin
      // ----------------------------------------------

      const newPin = await createPin(
        {
          locationName: formData.locationName,

          mood: formData.mood,

          description: formData.description || formData.notes || "New Mood Pin",

          latitude: selectedLocation.latitude,

          longitude: selectedLocation.longitude,
        },
        token,
      );

      console.log("Pin created:", newPin);

      navigate("/explore", {
        state: {
          createdPin: newPin,
        },
      });
    } catch (error) {
      console.error("Could not create pin:", error);

      alert(error.message || "Could not create pin.");
    }
  }

  // --------------------------------------------------
  // Cancel
  // --------------------------------------------------

  function handleCancelPin() {
    navigate("/explore");
  }

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

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
