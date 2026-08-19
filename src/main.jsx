import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import {
  Auth0Context,
  Auth0Provider,
  initialContext,
} from '@auth0/auth0-react';
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

const missingAuth0Settings = [
  ['VITE_AUTH0_DOMAIN', authConfig.domain],
  ['VITE_AUTH0_CLIENT_ID', authConfig.clientId],
  ['VITE_AUTH0_AUDIENCE', authConfig.authorizationParams.audience],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

const isAuth0Configured = missingAuth0Settings.length === 0;

const disabledAuth0Context = {
  ...initialContext,
  isLoading: false,
  isAuthenticated: false,
  loginWithRedirect: async () => {
    throw new Error(
      `Auth0 is not configured. Missing: ${missingAuth0Settings.join(', ')}`,
    );
  },
  getAccessTokenSilently: async () => undefined,
  logout: () => {},
};

// This checks whether any required Auth0 values are missing.
//
// Example:
//
// if VITE_AUTH0_DOMAIN exists
// but VITE_AUTH0_CLIENT_ID does not,
// `missing` will contain:
//
// ['VITE_AUTH0_CLIENT_ID']

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

root.render(
  <StrictMode>
    {isAuth0Configured ? (
      <Auth0Provider {...authConfig}>{app}</Auth0Provider>
    ) : (
      <Auth0Context.Provider value={disabledAuth0Context}>
        {app}
      </Auth0Context.Provider>
    )}
  </StrictMode>,
);
