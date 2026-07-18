import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 mt-auto">
    <div className="max-w-6xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <p className="text-white text-xl font-black mb-2">Amjad<span className="text-blue-400">.</span></p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Software Engineer building robust full-stack applications with passion for clean code and great UX.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Quick Links</p>
          <ul className="space-y-2 text-sm">
            {[['Home','/'],['Projects','/projects'],['Resume','/resume'],['Blog','/blog'],['Contact','/contact']].map(([label, path]) => (
              <li key={path}>
                <Link to={path} className="text-slate-400 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2.5 text-slate-400">
              <FaEnvelope className="text-blue-400 shrink-0" />
              <a href="mailto:amjadshahg26@gmail.com" className="hover:text-white transition-colors">amjadshahg26@gmail.com</a>
            </li>
            <li className="flex items-center gap-2.5 text-slate-400">
              <FaPhone className="text-blue-400 shrink-0" />
              <span>+92 329-501-5604</span>
            </li>
            <li className="flex items-center gap-2.5 text-slate-400">
              <FaMapMarkerAlt className="text-blue-400 shrink-0" />
              <span>I9 Markaz, Islamabad</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Amjad Aziz Shah. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/amjadazizshah" target="_blank" rel="noreferrer"
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors text-slate-300 hover:text-white">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/muhammad-amjad-aziz-shah-07a230383" target="_blank" rel="noreferrer"
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors text-slate-300 hover:text-white">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
