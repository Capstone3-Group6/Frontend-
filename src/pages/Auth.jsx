import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useAuth0 } from '@auth0/auth0-react';
import { login, signup } from '../api/auth';
import './Auth.css';

function AuthIcon({ type }) {
  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5.25 19c1.2-3.15 3.45-4.72 6.75-4.72S17.55 15.85 18.75 19" />
      </>
    ),
    mail: (
      <>
        <path d="M4.75 6.75h14.5v10.5H4.75z" />
        <path d="m5.25 7.25 6.75 5.5 6.75-5.5" />
      </>
    ),
    lock: (
      <>
        <path d="M7.25 10.75h9.5v8h-9.5z" />
        <path d="M9 10.75V8.5a3 3 0 1 1 6 0v2.25" />
      </>
    ),
    eye: (
      <>
        <path d="M3.75 12s2.9-5 8.25-5 8.25 5 8.25 5-2.9 5-8.25 5-8.25-5-8.25-5Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M3.75 12s2.9-5 8.25-5c1.32 0 2.49.3 3.51.74" />
        <path d="M20.25 12s-2.9 5-8.25 5c-1.38 0-2.59-.33-3.64-.81" />
        <path d="m4.75 4.75 14.5 14.5" />
      </>
    ),
    auth0: (
      <>
        <path d="m12 3.75 2.12 6.53h6.86l-5.55 4.03 2.12 6.53L12 16.8l-5.55 4.04 2.12-6.53-5.55-4.03h6.86L12 3.75Z" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className="auth-svg"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[type]}
    </svg>
  );
}

function FloatingField({
  label,
  name,
  type = 'text',
  icon,
  value,
  onChange,
  error,
  showPassword,
  onTogglePassword,
  ...inputProps
}) {
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const errorId = `${name}-error`;

  return (
    <div className="auth-field">
      <div className="auth-floating-wrap">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder=" "
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...inputProps}
        />
        <label htmlFor={name}>{label}</label>
        <span className="auth-field-icon">
          <AuthIcon type={icon} />
        </span>
        {isPassword && (
          <button
            type="button"
            className="auth-eye-button"
            onClick={onTogglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <AuthIcon type={showPassword ? 'eyeOff' : 'eye'} />
          </button>
        )}
      </div>
      {error && (
        <span id={errorId} role="alert" className="auth-field-error">
          {error}
        </span>
      )}
    </div>
  );
}

function AuthDivider() {
  return <div className="auth-divider">or</div>;
}

export default function Auth({ setUser, initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithRedirect } = useAuth0();
  const isAuth0Configured = Boolean(
    import.meta.env.VITE_AUTH0_DOMAIN &&
      import.meta.env.VITE_AUTH0_CLIENT_ID &&
      import.meta.env.VITE_AUTH0_AUDIENCE,
  );
  const redirectTo = location.state?.from ?? '/explore';

  const [authMode, setAuthMode] = useState(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signinData, setSigninData] = useState({
    identifier: '',
    password: '',
  });
  const [signinErrors, setSigninErrors] = useState({});

  const isSignup = authMode === 'signup';

  function validateSignup(data) {
    const errors = {};

    if (!data.username) {
      errors.username = 'Username is required';
    } else if (data.username.length < 3 || data.username.length > 20) {
      errors.username = 'Username must be between 3 and 20 characters';
    }

    if (!data.email) {
      errors.email = 'Email is required';
    } else if (!data.email.includes('@')) {
      errors.email = 'Enter a valid email address';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    return errors;
  }

  function validateSignin(data) {
    const errors = {};

    if (!data.identifier) {
      errors.identifier = 'Email or username is required';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    }

    return errors;
  }

  function changeMode(nextMode) {
    if (nextMode === authMode) return;

    setAuthMode(nextMode);
    setGeneralError('');
    setSignupErrors({});
    setSigninErrors({});
    setShowPassword(false);
    navigate(nextMode === 'signup' ? '/signup' : '/login', {
      replace: true,
      state: location.state,
    });
  }

  function handleSignupChange(event) {
    const { name, value } = event.target;

    setSignupData((previous) => ({ ...previous, [name]: value }));
    if (signupErrors[name]) {
      setSignupErrors((previous) => ({ ...previous, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  }

  function handleSigninChange(event) {
    const { name, value } = event.target;

    setSigninData((previous) => ({ ...previous, [name]: value }));
    if (signinErrors[name]) {
      setSigninErrors((previous) => ({ ...previous, [name]: '' }));
    }
    if (generalError) setGeneralError('');
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();

    const errors = validateSignup(signupData);
    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      const newUser = await signup(signupData);
      setUser(newUser);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSigninSubmit(event) {
    event.preventDefault();

    const errors = validateSignin(signinData);
    setSigninErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setGeneralError('');

    try {
      const loggedInUser = await login(signinData);
      setUser(loggedInUser);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAuth0Login() {
    if (!isAuth0Configured) {
      setGeneralError(
        'Auth0 is not configured yet. Use email and password, or add the Auth0 values to Frontend-/.env.',
      );
      return;
    }

    await loginWithRedirect();
  }

  return (
    <main className="auth-shell">
      <section
        className={`auth-card ${isSignup ? 'is-signup' : 'is-login'}`}
        aria-label={isSignup ? 'Mood Map signup' : 'Mood Map login'}
      >
        <div className="auth-form-slot auth-login-slot">
          <form
            id="loginForm"
            className="auth-form"
            onSubmit={handleSigninSubmit}
            noValidate
            aria-hidden={isSignup}
          >
            <p className="auth-brand-label">Mood Map</p>
            <h1>Welcome back</h1>
            <p className="auth-subtitle">
              Sign in and continue exploring places through moods and shared
              experiences.
            </p>

            {!isSignup && generalError && (
              <div className="auth-error-banner" role="alert">
                {generalError}
              </div>
            )}

            <FloatingField
              label="Email address or username"
              name="identifier"
              icon="mail"
              autoComplete="username"
              disabled={isLoading}
              value={signinData.identifier}
              onChange={handleSigninChange}
              error={signinErrors.identifier}
            />

            <FloatingField
              label="Password"
              name="password"
              type="password"
              icon="lock"
              autoComplete="current-password"
              disabled={isLoading}
              value={signinData.password}
              onChange={handleSigninChange}
              error={signinErrors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((value) => !value)}
            />

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" disabled={isLoading} />
                <span>Keep me signed in</span>
              </label>
              <a href="#" className="auth-forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-main-btn" disabled={isLoading}>
              {isLoading && !isSignup ? 'Signing in...' : 'Sign In'}
            </button>

            <AuthDivider />

            <button
              type="button"
              className="auth-oauth-btn"
              disabled={isLoading}
              onClick={handleAuth0Login}
            >
              <AuthIcon type="auth0" />
              Continue with Auth0
            </button>

            <p className="auth-switch">
              New to Mood Map?
              <button
                type="button"
                onClick={() => changeMode('signup')}
                disabled={isLoading}
              >
                Create account
              </button>
            </p>
          </form>
        </div>

        <div className="auth-form-slot auth-signup-slot">
          <form
            id="signupForm"
            className="auth-form"
            onSubmit={handleSignupSubmit}
            noValidate
            aria-hidden={!isSignup}
          >
            <p className="auth-brand-label">Mood Map</p>
            <h1>Create account</h1>
            <p className="auth-subtitle">
              Join Mood Map and start discovering places through the way they
              make people feel.
            </p>

            {isSignup && generalError && (
              <div className="auth-error-banner" role="alert">
                {generalError}
              </div>
            )}

            <FloatingField
              label="Username"
              name="username"
              icon="user"
              autoComplete="username"
              disabled={isLoading}
              value={signupData.username}
              onChange={handleSignupChange}
              error={signupErrors.username}
            />

            <FloatingField
              label="Email address"
              name="email"
              type="email"
              icon="mail"
              autoComplete="email"
              disabled={isLoading}
              value={signupData.email}
              onChange={handleSignupChange}
              error={signupErrors.email}
            />

            <FloatingField
              label="Password"
              name="password"
              type="password"
              icon="lock"
              autoComplete="new-password"
              disabled={isLoading}
              value={signupData.password}
              onChange={handleSignupChange}
              error={signupErrors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((value) => !value)}
            />

            <button type="submit" className="auth-main-btn" disabled={isLoading}>
              {isLoading && isSignup ? 'Creating account...' : 'Create Account'}
            </button>

            <AuthDivider />

            <button
              type="button"
              className="auth-oauth-btn"
              disabled={isLoading}
              onClick={handleAuth0Login}
            >
              <AuthIcon type="auth0" />
              Continue with Auth0
            </button>

            <p className="auth-switch">
              Already have an account?
              <button
                type="button"
                onClick={() => changeMode('login')}
                disabled={isLoading}
              >
                Sign In
              </button>
            </p>
          </form>
        </div>

        <aside className="auth-overlay" aria-live="polite">
          <div className="auth-overlay-panel auth-overlay-login">
            <p className="auth-overlay-brand">Mood Map</p>
            <h2>
              Feel the
              <span>place.</span>
            </h2>
            <p>
              Discover locations through shared emotions, from calm coffee
              shops to inspiring city views.
            </p>
            <span className="auth-overlay-prompt">Don't have an account?</span>
            <button
              type="button"
              className="auth-overlay-btn"
              onClick={() => changeMode('signup')}
              disabled={isLoading}
            >
              Create account
            </button>
            <div className="auth-mood-orbit" aria-hidden="true">
              <span>❤️</span>
            </div>
          </div>

          <div className="auth-overlay-panel auth-overlay-signup">
            <p className="auth-overlay-brand">Mood Map</p>
            <h2>
              Welcome
              <span>back.</span>
            </h2>
            <p>
              Your saved places, moods and discoveries are exactly where you
              left them.
            </p>
            <span className="auth-overlay-prompt">Already have an account?</span>
            <button
              type="button"
              className="auth-overlay-btn"
              onClick={() => changeMode('login')}
              disabled={isLoading}
            >
              Sign In
            </button>
            <div className="auth-mood-orbit" aria-hidden="true">
              <span>📍</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
