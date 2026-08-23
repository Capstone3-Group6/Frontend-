// Added by Musaddik
import { useState } from "react";
import { NavLink } from "react-router";

function MoodLogo() {
return ( <span className="flex h-10 w-10 items-center justify-center rounded-[18px] bg-[#F7F3EE] shadow-[0_12px_28px_rgba(22,22,22,0.14)] ring-1 ring-[#D9D4CE]"> <svg
     viewBox="0 0 40 40"
     className="h-8 w-8"
     fill="none"
     aria-hidden="true"
   > <path
       d="M20 36s12-10.12 12-22a12 12 0 1 0-24 0c0 11.88 12 22 12 22Z"
       fill="#161616"
     /> <circle cx="20" cy="15.8" r="9.2" fill="#F7F3EE" /> <path
       d="M15 14.8c1.2-.95 2.4-.95 3.6 0M21.4 14.8c1.2-.95 2.4-.95 3.6 0"
       stroke="#161616"
       strokeLinecap="round"
       strokeWidth="1.7"
     /> <path
       d="M16 20.4c1.25 1.05 2.58 1.58 4 1.58s2.75-.53 4-1.58"
       stroke="#B4232C"
       strokeLinecap="round"
       strokeWidth="1.9"
     /> <path
       d="M26.8 7.2 28 4.8l1.2 2.4 2.4 1-2.4 1L28 11.6l-1.2-2.4-2.4-1 2.4-1Z"
       fill="#B4232C"
     /> </svg> </span>
);
}

function Icon({ name }) {
const base = "h-6 w-6";

const paths = {
explore: (
<> <circle cx="12" cy="12" r="8.5" /> <path d="m15.5 8.5-2.1 5-4.9 2.1 2.1-5 4.9-2.1Z" />
</>
),
saved: <path d="M6.5 4.75h11v15l-5.5-3.2-5.5 3.2v-15Z" />,
profile: (
<> <circle cx="12" cy="8.25" r="3.5" /> <path d="M5.5 19.25c1.25-3.1 3.42-4.65 6.5-4.65s5.25 1.55 6.5 4.65" />
</>
),
login: (
<> <path d="M14 4.75h4.25v14.5H14" /> <path d="M4.75 12h9.5M11 8.75 14.25 12 11 15.25" />
</>
),
signup: (
<> <circle cx="9" cy="8.25" r="3.25" /> <path d="M3.75 19c1.08-2.82 2.83-4.24 5.25-4.24 1.47 0 2.69.51 3.66 1.52" /> <path d="M17.25 9.25v6M14.25 12.25h6" />
</>
),
logout: (
<> <path d="M10 4.75H5.75v14.5H10" /> <path d="M19.25 12h-9.5M13 8.75 9.75 12 13 15.25" />
</>
),
menu: (
<> <path d="M4 7h16" /> <path d="M4 12h16" /> <path d="M4 17h16" />
</>
),
close: (
<> <path d="m6 6 12 12" /> <path d="m18 6-12 12" />
</>
),
};

return ( <svg
   viewBox="0 0 24 24"
   className={base}
   fill="none"
   aria-hidden="true"
   stroke="currentColor"
   strokeLinecap="round"
   strokeLinejoin="round"
   strokeWidth="1.9"
 >
{paths[name]} </svg>
);
}

function NavItem({ to, icon, label, end = false, onClick }) {
return (
<NavLink
to={to}
end={end}
onClick={onClick}
className={({ isActive }) =>
`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
          isActive
            ? "bg-[#B4232C] text-white shadow-[0_12px_28px_rgba(180,35,44,0.20)]"
            : "text-[#161616] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
        }`
}
> <Icon name={icon} /> <span>{label}</span> </NavLink>
);
}

export default function Navbar({ user, onLogout }) {
const [isMenuOpen, setIsMenuOpen] = useState(false);

function closeMenu() {
setIsMenuOpen(false);
}

function handleLogout() {
closeMenu();
onLogout();
}

return ( <header className="sticky top-0 z-50 border-b border-[rgba(22,22,22,0.06)] bg-[rgba(255,253,250,0.88)] backdrop-blur-[14px]"> <nav className="mx-auto flex h-16 w-full max-w-[1520px] items-center px-3 sm:px-5 lg:px-8"> <NavLink
       to="/"
       onClick={closeMenu}
       className="mr-auto flex items-center gap-3"
       aria-label="Mood Map home"
     > <MoodLogo />

      <p className="text-lg font-black tracking-normal text-[#161616]">
        Mood Map
      </p>
    </NavLink>

    <div className="hidden items-center gap-1.5 sm:flex sm:gap-3 lg:gap-5">
      <NavLink
        to="/explore"
        aria-label="Explore"
        className={({ isActive }) =>
          `flex h-11 w-11 items-center justify-center rounded-full transition ${
            isActive
              ? "bg-[#B4232C] text-white shadow-[0_12px_28px_rgba(180,35,44,0.25)]"
              : "text-[#161616] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
          }`
        }
      >
        <Icon name="explore" />
      </NavLink>

      <NavLink
        to="/saved"
        aria-label="Saved"
        className={({ isActive }) =>
          `flex h-11 w-11 items-center justify-center rounded-full transition ${
            isActive
              ? "bg-[#B4232C] text-white shadow-[0_12px_28px_rgba(180,35,44,0.25)]"
              : "text-[#161616] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
          }`
        }
      >
        <Icon name="saved" />
      </NavLink>

      {user ? (
        <>
          <NavLink
            to="/profile"
            aria-label="Profile"
            className={({ isActive }) =>
              `flex h-11 w-11 items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-[#B4232C] text-white shadow-[0_12px_28px_rgba(180,35,44,0.25)]"
                  : "text-[#161616] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
              }`
            }
          >
            <Icon name="profile" />
          </NavLink>

          <button
            type="button"
            onClick={onLogout}
            aria-label="Log out"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#161616] transition hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
          >
            <Icon name="logout" />
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            aria-label="Log in"
            className={({ isActive }) =>
              `flex h-11 w-11 items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-[#B4232C] text-white"
                  : "text-[#161616] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
              }`
            }
          >
            <Icon name="login" />
          </NavLink>

          <NavLink
            to="/signup"
            aria-label="Sign up"
            className={({ isActive }) =>
              `flex h-11 w-11 items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-[#B4232C] text-white"
                  : "text-[#161616] hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
              }`
            }
          >
            <Icon name="signup" />
          </NavLink>
        </>
      )}
    </div>

    <button
      type="button"
      onClick={() => setIsMenuOpen((open) => !open)}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMenuOpen}
      className="flex h-11 w-11 items-center justify-center rounded-full text-[#161616] transition hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C] sm:hidden"
    >
      <Icon name={isMenuOpen ? "close" : "menu"} />
    </button>
  </nav>

  {isMenuOpen && (
    <div className="border-t border-[rgba(22,22,22,0.06)] bg-[#FFFDFC] px-3 pb-4 pt-3 shadow-[0_18px_40px_rgba(22,22,22,0.10)] sm:hidden">
      <div className="mx-auto flex max-w-[1520px] flex-col gap-1">
        <NavItem
          to="/explore"
          icon="explore"
          label="Explore"
          onClick={closeMenu}
        />

        <NavItem
          to="/saved"
          icon="saved"
          label="Saved"
          onClick={closeMenu}
        />

        {user ? (
          <>
            <NavItem
              to="/profile"
              icon="profile"
              label="Profile"
              onClick={closeMenu}
            />

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold text-[#161616] transition hover:bg-[rgba(180,35,44,0.08)] hover:text-[#B4232C]"
            >
              <Icon name="logout" />
              <span>Log out</span>
            </button>
          </>
        ) : (
          <>
            <NavItem
              to="/login"
              icon="login"
              label="Log in"
              onClick={closeMenu}
            />

            <NavItem
              to="/signup"
              icon="signup"
              label="Sign up"
              onClick={closeMenu}
            />
          </>
        )}
      </div>
    </div>
  )}
</header>


);
}
