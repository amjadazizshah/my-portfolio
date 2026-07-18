import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white flex items-center">
          Amjad<span className="text-blue-500">.</span>
        </Link>
        <ul className="hidden md:flex space-x-8 items-center">
          <li><Link to="/" className="text-slate-300 hover:text-white transition-colors font-medium">Home</Link></li>
          <li><Link to="/projects" className="text-slate-300 hover:text-white transition-colors font-medium">Projects</Link></li>
          <li><Link to="/resume" className="text-slate-300 hover:text-white transition-colors font-medium">Resume</Link></li>
          <li><Link to="/blog" className="text-slate-300 hover:text-white transition-colors font-medium">Blog</Link></li>
          <li><Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
