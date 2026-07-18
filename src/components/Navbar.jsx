import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-black tracking-tight text-slate-900">
          Amjad<span className="text-blue-600">.</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-1">
          {[
            { label: 'Home',     path: '/' },
            { label: 'Projects', path: '/projects' },
            { label: 'Resume',   path: '/resume' },
            { label: 'Blog',     path: '/blog' },
          ].map(({ label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to="/contact"
              className="ml-2 btn-primary text-sm !py-2 !px-5"
            >
              Contact Me
            </Link>
          </li>
        </ul>

        {/* Mobile burger */}
        <button
          className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-slate-700 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-1">
          {[
            { label: 'Home',     path: '/' },
            { label: 'Projects', path: '/projects' },
            { label: 'Resume',   path: '/resume' },
            { label: 'Blog',     path: '/blog' },
            { label: 'Contact',  path: '/contact' },
          ].map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isActive(path)
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
