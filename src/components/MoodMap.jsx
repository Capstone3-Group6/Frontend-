import { useState } from 'react';
import L from 'leaflet';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';

// `useState` lets us store the pins currently shown on the map.
//
// `L` is Leaflet itself.
// We use `L.divIcon()` to create custom Mood Map markers.
//
// React Leaflet gives us:
//
// MapContainer = creates the map
// TileLayer    = loads OpenStreetMap
// Marker       = places a pin on the map
// Popup        = shows details when a pin is clicked
// useMapEvents = listens for map events like clicks


const createMoodIcon = (mood) => {
  // This function creates a custom Leaflet marker
  // based on the mood attached to the pin.

  const moodData = {
    Happy: {
      label: 'Happy',
      face: '😊',
    },

    Calm: {
      label: 'Calm',
      face: '😌',
    },

    Creative: {
      label: 'Creative',
      face: '🎨',
    },

    Energetic: {
      label: 'Energetic',
      face: '⚡',
    },

    Romantic: {
      label: 'Romantic',
      face: '❤️',
    },

    Focused: {
      label: 'Focused',
      face: '🌿',
    },

    Inspiring: {
      label: 'Inspiring',
      face: '✨',
    },
  };

  // Each mood has:
  //
  // label = text shown on hover
  // face  = temporary icon inside the marker
  //
  // Later we can replace these emojis
  // with custom SVG mood faces.


  const selectedMood = moodData[mood] || moodData.Happy;

  // If the mood exists, use it.
  //
  // If it does not exist,
  // fall back to Happy.


  return L.divIcon({
    className: 'mood-marker-wrapper',

    // This class is used in index.css
    // for marker styling and hover effects.


    html: `
      <div class="mood-marker-item">

        <div class="mood-marker">
          <div class="mood-face mood-face-icon">
            ${selectedMood.face}
          </div>
        </div>

        <span class="mood-marker-label">
          ${selectedMood.label}
        </span>

      </div>
    `,

    // The marker contains:
    //
    // custom marker shape
    // mood face/icon
    // hidden hover label


    iconSize: [60, 75],

    // Gives the marker enough room
    // for both the icon and hover label.


    iconAnchor: [30, 54],

    // This tells Leaflet where the real geographic point is.
    //
    // The point is near the bottom-center of the marker.


    popupAnchor: [0, -52],

    // Makes the popup appear above the marker.
  });
};


function AddMarker({ setPins }) {
  // This component listens for clicks anywhere on the map.
  //
  // When the user clicks a location,
  // we create a new temporary Mood Pin.

  useMapEvents({
    click(e) {
      // `e.latlng` contains the latitude and longitude
      // of the location the user clicked.

      const newPin = {
        id: Date.now(),

        // Temporary unique ID.
        // Later the database will create the real ID.


        lat: e.latlng.lat,
        lng: e.latlng.lng,

        // Exact location clicked on the map.


        placeName: 'New Mood Place',

        // Temporary place name.
        // Later this comes from the Add Mood form.


        mood: 'Happy',

        // For now every new clicked pin starts as Happy.
        //
        // Later the user will choose the mood.


        description: 'A new mood pin added from the map.',

        // Temporary description.


        username: '@samiallo',

        // Temporary username.
        // Later this will come from the logged-in user.


        image:
          'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80',

        // Temporary place image.


        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',

        // Temporary user avatar.
      };


      setPins((currentPins) => [...currentPins, newPin]);

      // This adds the new pin to the existing array.
      //
      // React sees the state update
      // and automatically renders the new marker.
    },
  });


  return null;

  // This component has no visible UI.
  // It only listens for map clicks.
}


export default function MoodMap() {
  const center = [40.7128, -74.006];

  // Starting position of the map.
  //
  // These coordinates are New York City.


  const [pins, setPins] = useState([
    {
      id: 1,

      lat: 40.7128,
      lng: -74.006,

      placeName: 'Mood Map Test Place',

      mood: 'Happy',

      description:
        'A fun place with good energy and a positive atmosphere.',

      username: '@samiallo',

      image:
        'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    },

    {
      id: 2,

      lat: 40.7228,
      lng: -74.016,

      placeName: 'Quiet Waterfront',

      mood: 'Calm',

      description:
        'A peaceful waterfront spot where you can relax and reset.',

      username: '@maya',

      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },

    {
      id: 3,

      lat: 40.7028,
      lng: -73.996,

      placeName: 'Creative Corner',

      mood: 'Creative',

      description:
        'Street art, interesting people, and creative energy everywhere.',

      username: '@leo',

      image:
        'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    },

    {
      id: 4,

      lat: 40.732,
      lng: -73.995,

      placeName: 'Energy Square',

      mood: 'Energetic',

      description:
        'Busy streets, music, movement, and nonstop energy.',

      username: '@alex',

      image:
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    },

    {
      id: 5,

      lat: 40.715,
      lng: -73.985,

      placeName: 'Romantic View',

      mood: 'Romantic',

      description:
        'A warm and beautiful place for an evening walk.',

      username: '@sofia',

      image:
        'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    },

    {
      id: 6,

      lat: 40.74,
      lng: -74.005,

      placeName: 'Focus Café',

      mood: 'Focused',

      description:
        'Quiet tables, good coffee, and a perfect atmosphere for studying.',

      username: '@daniel',

      image:
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
    },

    {
      id: 7,

      lat: 40.725,
      lng: -73.975,

      placeName: 'Inspiring View',

      mood: 'Inspiring',

      description:
        'A beautiful city view that makes you want to create something.',

      username: '@nina',

      image:
        'https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=600&q=80',

      avatar:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80',
    },
  ]);

  // These are temporary frontend sample pins.
  //
  // Later the backend/database will provide this data.


  return (
    <MapContainer
      center={center}
      zoom={13}
      dragging={true}
      scrollWheelZoom={true}
      doubleClickZoom={true}
      zoomControl={true}
      className='h-full w-full'
    >
      {/*
        MapContainer creates the real interactive map.

        dragging
        = user can move the map

        scrollWheelZoom
        = mouse-wheel zoom

        doubleClickZoom
        = double-click zoom

        zoomControl
        = + and - buttons
      */}


      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/*
        This loads the real OpenStreetMap tiles.
      */}


      <AddMarker setPins={setPins} />

      {/*
        This allows the user to click anywhere
        and add a temporary new pin.
      */}


      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createMoodIcon(pin.mood)}
        >
          {/*
            Creates one Marker for every object in `pins`.

            createMoodIcon(pin.mood)

            reads the mood and gives the marker
            the correct visual.
          */}


          <Popup>
            <div className='w-[240px]'>
              {/*
                This is our Mood Map place card.

                It stays compact so it does not cover
                too much of the map.
              */}


              <img
                src={pin.image}
                alt={pin.placeName}
                className='h-28 w-full rounded-xl object-cover'
              />

              {/*
                Place photo.

                object-cover prevents stretching.
              */}


              <div className='mt-3'>
                <div className='flex items-start justify-between gap-3'>
                  {/*
                    Top part contains:

                    mood
                    place name
                    save button
                  */}


                  <div>
                    <span className='inline-flex rounded-full bg-[#F5DADB] px-2 py-1 text-[11px] font-semibold text-[#7D1820]'>
                      {pin.mood}
                    </span>

                    {/* Mood badge. */}


                    <h3 className='mt-2 text-base font-bold text-[#161616]'>
                      {pin.placeName}
                    </h3>

                    {/* Place name. */}
                  </div>


                  <button
                    className='flex h-8 w-8 items-center justify-center rounded-full text-[#6F6A66] transition hover:scale-110 hover:bg-[#F7F3EE] hover:text-[#B4232C]'
                    aria-label='Save place'
                  >
                    ♡
                  </button>

                  {/*
                    Temporary save button.

                    Later this can save a mood pin
                    to the user's favorites.
                  */}
                </div>


                <p className='mt-2 text-sm leading-5 text-[#6F6A66]'>
                  {pin.description}
                </p>

                {/* Short place description. */}


                <div className='mt-4 flex items-center justify-between gap-3'>
                  {/*
                    Bottom row contains:

                    avatar
                    username
                    Details button
                  */}


                  <div className='flex min-w-0 items-center gap-2'>
                    <img
                      src={pin.avatar}
                      alt={pin.username}
                      className='h-7 w-7 shrink-0 rounded-full object-cover'
                    />

                    {/* User avatar. */}


                    <span className='truncate text-xs font-semibold text-[#161616]'>
                      {pin.username}
                    </span>

                    {/* Username. */}
                  </div>


                  <button
                    className='shrink-0 rounded-lg bg-[#B4232C] px-3 py-2 text-xs font-semibold text-white transition hover:scale-105 hover:bg-[#7D1820]'
                  >
                    Details
                  </button>

                  {/*
                    Later this can open a full pin-detail page.

                    Example route:

                    /pins/7
                  */}
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}