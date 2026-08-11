import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Auth0Provider } from '@auth0/auth0-react';
import 'leaflet/dist/leaflet.css'

import './index.css';
import App from './App.jsx';

// We only need App now.
// The temporary Navbar and HomePage imports are removed
// because we are going back to the real application flow.

const authConfig = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN,

  // Reads the Auth0 domain from your .env file.
  // Example:
  // VITE_AUTH0_DOMAIN=your-domain.us.auth0.com

  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,

  // Reads the Auth0 Client ID from your .env file.

  authorizationParams: {
    redirect_uri: window.location.origin,

    // After Auth0 login finishes,
    // send the user back to the same website origin.
    //
    // For local development this will usually be:
    // http://localhost:5173

    audience: import.meta.env.VITE_AUTH0_AUDIENCE,

    // Tells Auth0 which backend API
    // this frontend wants permission to access.

    scope: 'openid profile email',

    // Requests basic user information:
    //
    // openid  = allows OpenID Connect authentication
    // profile = gives basic profile information
    // email   = gives the user's email
  },
};

const root = createRoot(document.getElementById('root'));

// This finds the <div id="root"></div>
// from index.html and tells React:
// "Render the whole app inside this element."

const missing = [
  ['VITE_AUTH0_DOMAIN', authConfig.domain],
  ['VITE_AUTH0_CLIENT_ID', authConfig.clientId],
  ['VITE_AUTH0_AUDIENCE', authConfig.authorizationParams.audience],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

// This checks whether any required Auth0 values are missing.
//
// Example:
//
// if VITE_AUTH0_DOMAIN exists
// but VITE_AUTH0_CLIENT_ID does not,
// `missing` will contain:
//
// ['VITE_AUTH0_CLIENT_ID']

if (missing.length > 0) {
  // If Auth0 configuration is missing,
  // do NOT try to start Auth0.
  //
  // Instead, show a helpful error page.

  root.render(
    <div className='mx-auto max-w-lg p-8 text-left'>
      <h1 className='mb-3 text-2xl font-semibold text-[#111827]'>
        Missing Auth0 settings
      </h1>

      {/* Shows the main error title. */}

      <p className='mb-4'>
        This app can't start until these are set in a{' '}
        <code>.env</code> file at the project root:
      </p>

      {/* Explains where the missing values should be added. */}

      <ul className='mb-4 list-disc pl-6'>
        {missing.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>

      {/* 
        `.map()` creates one list item
        for every missing environment variable.
      */}

      <p>
        Fill in the Auth0 values in <code>.env</code>, then restart{' '}
        <code>npm run dev</code>.
      </p>
    </div>,
  );
} else {
  // If all required Auth0 values exist,
  // start the real Mood Map application.

  root.render(
    <StrictMode>
      {/*
        StrictMode helps React detect possible problems
        while we are developing.
      */}

      <Auth0Provider {...authConfig}>
        {/*
          Auth0Provider gives the entire React application
          access to Auth0 login information.

          That is why App.jsx can use:

          useAuth0()
        */}

        <BrowserRouter>
          {/*
            BrowserRouter enables React Router.

            It lets URLs like:

            /
            /login
            /signup
            /saved

            load different React pages without refreshing
            the whole browser.
          */}

          <App />

          {/*
            App.jsx contains our main routes,
            user state, login flow, logout flow,
            and all of our pages.
          */}
        </BrowserRouter>
      </Auth0Provider>
    </StrictMode>,
  );
}
