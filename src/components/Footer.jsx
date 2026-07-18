import { FaGithub, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="glass-card mt-auto border-t-0 rounded-none py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <div className="flex space-x-6 text-2xl mb-6">
          <a href="https://github.com/amjadazizshah" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors transform hover:scale-110"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/muhammad-amjad-aziz-shah-07a230383" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white transition-colors transform hover:scale-110"><FaLinkedin /></a>
        </div>
        <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-3 md:space-y-0 text-slate-400 mb-8 text-sm">
          <div className="flex items-center space-x-2">
             <FaEnvelope className="text-blue-400" /> <span>amjadshahg26@gmail.com</span>
          </div>
          <div className="flex items-center space-x-2">
             <FaPhone className="text-blue-400" /> <span>+92 329-501-5604</span>
          </div>
          <div className="flex items-center space-x-2">
             <FaMapMarkerAlt className="text-blue-400" /> <span>I9 Markaz, Islamabad</span>
          </div>
        </div>
        <p className="text-slate-500 text-sm">&copy; {new Date().getFullYear()} Amjad Aziz Shah. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
