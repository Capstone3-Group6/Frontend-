import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getProtected } from '../api/auth';

// A page to TEST the protected backend endpoint. ProtectedRoute makes sure you
// can only get here when logged in; the button then calls /api/protected and
// shows what came back.
//
// This is the one place where the two kinds of login look different in the
// frontend, so it's worth reading closely:
//
//   password user -> the JWT is in an httpOnly cookie. We send NOTHING extra;
//                    the browser attaches the cookie by itself.
//   Auth0 user    -> the token lives inside Auth0's SDK, so we have to fetch
//                    it and send it in an Authorization header.
//
// The backend's requireAuth accepts either, which is why ONE endpoint serves
// both. Look at `via` in the response to see which door you came through.
export default function ProtectedPage({ user }) {
  const { isAuthenticated: isAuth0User, getAccessTokenSilently } = useAuth0();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleTest() {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // Only ask Auth0 for a token if the session actually CAME from Auth0.
      // Calling this for a password user throws "Login required".
      const token = isAuth0User ? await getAccessTokenSilently() : undefined;

      const data = await getProtected(token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-3 py-8 sm:px-5 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-[rgba(22,22,22,0.07)] bg-[#FFFDFC] shadow-[0_28px_70px_rgba(22,22,22,0.11)]">
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-10">
          <aside className="rounded-[28px] bg-[#171326] p-6 text-white shadow-[0_22px_50px_rgba(23,19,38,0.22)]">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#FFFDFC] text-4xl shadow-[0_16px_34px_rgba(0,0,0,0.18)]">
              {user?.username?.[0]?.toUpperCase() || 'M'}
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-normal">
              {user?.username || 'Mood Mapper'}
            </h1>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/72">
              Mapping the city by feeling, one place at a time.
            </p>
          </aside>

          <div className="grid content-start gap-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ['Total Pins', '7'],
                ['Saved Places', '3'],
                ['Top Mood', 'Calm'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-[#E4DDD7] bg-[#FAF8F6] p-5"
                >
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-[#B4232C]">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-black text-[#171326]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-[#E4DDD7] bg-white p-5">
              <h2 className="text-xl font-black text-[#171326]">
                Account Health
              </h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6F6A66]">
                Signed in with{' '}
                <code className="rounded-lg bg-[#F7F3EE] px-2 py-1 text-[#171326]">
                  {isAuth0User ? 'Auth0 token' : 'JWT cookie'}
                </code>
                .
              </p>

              <button
                onClick={handleTest}
                disabled={isLoading}
                className="mt-5 rounded-2xl bg-[#B4232C] px-5 py-3 font-black text-white shadow-[0_14px_30px_rgba(180,35,44,0.22)] transition hover:-translate-y-0.5 hover:bg-[#8F1720] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Calling...' : 'Call /api/protected'}
              </button>

              {error && <p className="mt-4 text-sm font-bold text-red-500">{error}</p>}

              {result && (
                <pre className="mt-4 overflow-x-auto rounded-2xl border border-[#E4DDD7] bg-[#FAF8F6] p-4 text-left text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
