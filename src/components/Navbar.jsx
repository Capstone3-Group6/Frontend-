// Added by Musaddik
import { NavLink } from "react-router";

function MoodLogo() {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[#F7F3EE] shadow-[0_12px_28px_rgba(22,22,22,0.14)] ring-1 ring-[#D9D4CE]">
      <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" aria-hidden="true">
        <path
          d="M20 36s12-10.12 12-22a12 12 0 1 0-24 0c0 11.88 12 22 12 22Z"
          fill="#161616"
        />
        <circle cx="20" cy="15.8" r="9.2" fill="#F7F3EE" />
        <path d="M15 14.8c1.2-.95 2.4-.95 3.6 0M21.4 14.8c1.2-.95 2.4-.95 3.6 0" stroke="#161616" strokeLinecap="round" strokeWidth="1.7" />
        <path
          d="M16 20.4c1.25 1.05 2.58 1.58 4 1.58s2.75-.53 4-1.58"
          stroke="#B4232C"
          strokeLinecap="round"
          strokeWidth="1.9"
        />
        <path
          d="M26.8 7.2 28 4.8l1.2 2.4 2.4 1-2.4 1L28 11.6l-1.2-2.4-2.4-1 2.4-1Z"
          fill="#B4232C"
        />
      </svg>
    </span>
  );
}

function Icon({ name }) {
  const base = "h-6 w-6";
  const paths = {
    explore: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.5 8.5-2.1 5-4.9 2.1 2.1-5 4.9-2.1Z" />
      </>
    ),
    saved: <path d="M6.5 4.75h11v15l-5.5-3.2-5.5 3.2v-15Z" />,
    add: (
      <>
        <path d="M12 21s6-5.42 6-11a6 6 0 1 0-12 0c0 5.58 6 11 6 11Z" />
        <path d="M12 7.75v5.5M9.25 10.5h5.5" />
      </>
    ),
    profile: (
      <>
        <circle cx="12" cy="8.25" r="3.5" />
        <path d="M5.5 19.25c1.25-3.1 3.42-4.65 6.5-4.65s5.25 1.55 6.5 4.65" />
      </>
    ),
    login: (
      <>
        <path d="M14 4.75h4.25v14.5H14" />
        <path d="M4.75 12h9.5M11 8.75 14.25 12 11 15.25" />
      </>
    ),
    signup: (
      <>
        <circle cx="9" cy="8.25" r="3.25" />
        <path d="M3.75 19c1.08-2.82 2.83-4.24 5.25-4.24 1.47 0 2.69.51 3.66 1.52" />
        <path d="M17.25 9.25v6M14.25 12.25h6" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4.75H5.75v14.5H10" />
        <path d="M19.25 12h-9.5M13 8.75 9.75 12 13 15.25" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      className={base}
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
    >
      {paths[name]}
    </svg>
  );
}

function NavItem({ to, icon, label, end = false }) {
  return (
    <div className="group relative flex h-10 items-center justify-center">
      <NavLink
        to={to}
        end={end}
        aria-label={label}
        className={({ isActive }) =>
          `flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-[transform,box-shadow,color,background-color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 ${
            isActive
              ? "bg-[#B4232C] text-white shadow-[0_10px_24px_rgba(180,35,44,0.22)] group-hover:shadow-[0_14px_30px_rgba(180,35,44,0.28)]"
              : "text-[#161616] group-hover:bg-[rgba(180,35,44,0.08)] group-hover:text-[#B4232C] group-hover:shadow-[0_10px_24px_rgba(180,35,44,0.12)]"
          }`
        }
      >
        <Icon name={icon} />
      </NavLink>
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#161616] px-2 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

function IconButton({ icon, label, onClick }) {
  return (
    <div className="group relative flex h-10 items-center justify-center">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-[#161616] transition-[transform,box-shadow,color,background-color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:bg-[rgba(180,35,44,0.08)] group-hover:text-[#B4232C] group-hover:shadow-[0_10px_24px_rgba(180,35,44,0.12)]"
      >
        <Icon name={icon} />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-[#161616] px-2 py-1 text-xs font-bold text-[#FFFDFC] opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

export default function Navbar({ user, onLogout }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(22,22,22,0.06)] bg-[rgba(255,253,250,0.78)] backdrop-blur-[14px] transition-all duration-200 hover:bg-[rgba(255,253,250,0.9)]">
      <nav className="mx-auto flex h-16 w-full max-w-[1500px] items-center gap-4 px-4 sm:px-6">
        <NavLink to="/" className="mr-auto flex items-center gap-3" aria-label="Mood Map home">
          <MoodLogo />
          <p className="text-lg font-black tracking-[-0.035em] text-[#161616]">
            Mood Map
          </p>
        </NavLink>

        <div className="flex items-center gap-6 sm:gap-7">
          <NavItem to="/" end icon="explore" label="Explore" />
          <NavItem to="/saved" icon="saved" label="Saved" />
          <NavItem to="/create" icon="add" label="Add Mood" />
          {user ? (
            <>
              <NavItem to="/protected" icon="profile" label="Profile" />
              <IconButton icon="logout" label="Log out" onClick={onLogout} />
            </>
          ) : (
            <>
              <NavItem to="/login" icon="login" label="Log in" />
              <NavItem to="/signup" icon="signup" label="Sign up" />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
