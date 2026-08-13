import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';

import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explore from './pages/Explore';
import CreatePin from './pages/CreatePin';

import { getMe, syncUser, logoutRequest } from './api/auth';

function App() {
  // User from our database
  const [user, setUser] = useState(null);

  // Checks whether our JWT cookie is still valid
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Stores Auth0/database sync errors
  const [authError, setAuthError] = useState(null);

  // Auth0
  const {
    isAuthenticated: isAuth0User,
    user: auth0User,
    isLoading: isAuth0Loading,
    getAccessTokenSilently,
    logout: auth0Logout,
  } = useAuth0();

  // Prevent protected routes from redirecting
  // while authentication is still being checked.
  const isLoading =
    isCheckingSession ||
    isAuth0Loading ||
    (isAuth0User && !user && !authError);

  // ---------------- CHECK EXISTING SESSION ----------------

  useEffect(() => {
    async function checkIfLoggedIn() {
      try {
        const me = await getMe();

        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    }

    checkIfLoggedIn();
  }, []);

  // ---------------- AUTH0 LOGIN ----------------

  useEffect(() => {
    if (!isAuth0User || !auth0User) return;

    async function saveAuth0User() {
      try {
        const token = await getAccessTokenSilently();

        const dbUser = await syncUser(token, {
          username:
            auth0User.nickname ||
            auth0User.email?.split('@')[0],
        });

        setUser(dbUser);
        setAuthError(null);
      } catch (error) {
        setAuthError(
          `Signed in with Auth0, but we couldn't load your account: ${error.message}`
        );
      }
    }

    saveAuth0User();
  }, [
    isAuth0User,
    auth0User,
    getAccessTokenSilently,
  ]);

  // ---------------- LOGOUT ----------------

  async function handleLogout() {
    try {
      await logoutRequest();
    } catch (error) {
      console.error('Logout failed:', error.message);
    }

    setUser(null);
    setAuthError(null);

    if (isAuth0User) {
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    }
  }

  // ---------------- ROUTES ----------------

  return (
    <Routes>
      <Route
        element={
          <Layout
            user={user}
            onLogout={handleLogout}
            authError={authError}
          />
        }
      >
        {/* Public routes */}

        <Route path='/' element={<HomePage />} />

        <Route path='/explore' element={<Explore />} />

        <Route
          path='/create-pin'
          element={<CreatePin />}
        />

        <Route
          path='/login'
          element={<Login setUser={setUser} />}
        />

        <Route
          path='/signup'
          element={<Signup setUser={setUser} />}
        />

        {/* Existing task routes */}

        <Route
          path='/tasks'
          element={<TasksPage />}
        />

        <Route
          path='/tasks/:id'
          element={<TaskDetailPage />}
        />

        {/* Protected routes */}

        {/* 
          Add your Profile route here later:

          <Route
            path='/profile'
            element={
              <ProtectedRoute
                user={user}
                isLoading={isLoading}
              >
                <Profile user={user} />
              </ProtectedRoute>
            }
          />
        */}

        {/* Catch-all */}

        <Route
          path='*'
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
