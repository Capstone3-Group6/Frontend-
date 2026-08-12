// Added by Musaddik
import { Outlet } from "react-router";
import Navbar from './Navbar';

export default function Layout({ user, onLogout, authError }) {
  return (
    <div className='min-h-screen bg-[var(--bg)] text-[var(--text)]'>
      <Navbar user={user} onLogout={onLogout} />
      <main className='w-full'>
        {authError && (
          <div className='mx-auto max-w-7xl px-6 pt-4'>
            <p
              role="alert"
              className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500"
            >
              {authError}
            </p>
          </div>
        )}
        <Outlet />
      </main>
    </div>
  );
}