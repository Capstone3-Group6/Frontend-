import { Outlet, useLocation } from 'react-router';
import Navbar from './Navbar';

// Layout is the frame every page shares: navbar on top, page below.
// <Outlet /> is the slot where the matched child route renders.
export default function Layout({ user, onLogout, authError }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className='flex min-h-screen flex-col text-left'>
      <Navbar user={user} onLogout={onLogout} />
      <main className={`mx-auto w-full flex-1 px-4 py-6 ${isHome ? 'max-w-5xl' : 'max-w-3xl'}`}>
        {authError && (
          <p
            role='alert'
            className='mb-6 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-500'
          >
            {authError}
          </p>
        )}
        <Outlet />
      </main>
    </div>
  );
}
