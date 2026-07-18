import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const skills = ['C/C++','Java','JavaScript','Python','SQL','Django','Flask','React','React Native','HTML/CSS','MySQL','MongoDB'];
const highlights = [
  { label: 'Problem Solving', icon: '🧠' },
  { label: 'Quick Learner',   icon: '⚡' },
  { label: 'Leadership',      icon: '🎯' },
  { label: 'Debugging',       icon: '🔧' },
];

const Home = () => (
  <div>
    {/* ── Hero ─────────────────────────────────────── */}
    <section className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col-reverse md:flex-row items-center gap-14">

        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <span className="section-label mb-4 block">Software Engineer</span>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
            Hi, I'm{' '}
            <span className="gradient-text block mt-1">Amjad Aziz</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-lg mb-10">
            I build full-stack web &amp; mobile applications — from React frontends to Node.js APIs — with a focus on clean code and great user experience.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <Link to="/projects" className="btn-primary">View My Work →</Link>
            <Link to="/contact"  className="btn-outline">Get In Touch</Link>
          </div>

          {/* Social row */}
          <div className="flex justify-center md:justify-start gap-4 mt-10">
            <a href="https://github.com/amjadazizshah" target="_blank" rel="noreferrer"
               className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors">
              <FaGithub className="text-lg" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/muhammad-amjad-aziz-shah-07a230383" target="_blank" rel="noreferrer"
               className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
              <FaLinkedin className="text-lg" /> LinkedIn
            </a>
            <a href="mailto:amjadshahg26@gmail.com"
               className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors">
              <FaEnvelope className="text-lg" /> Email
            </a>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 p-1 shadow-xl shadow-blue-200">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100">
                <img
                  src="/profile.png"
                  alt="Amjad Aziz Shah"
                  className="w-full h-full object-cover animate-float"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='%23cbd5e1'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
            {/* Floating badges */}
            <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg px-3 py-2 border border-slate-200 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>🎓</span> BS Software Eng.
            </div>
            <div className="absolute -top-4 -right-4 bg-blue-600 rounded-xl shadow-lg px-3 py-2 text-sm font-bold text-white">
              Open to Work ✓
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── About ─────────────────────────────────────── */}
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="section-label block mb-2">Background</span>
          <h2 className="text-4xl font-extrabold text-slate-900">About Me</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-5 text-slate-600 text-base leading-relaxed">
            <p>
              Currently pursuing my <strong className="text-slate-900">BS in Software Engineering</strong> at Iqra University (2023–2027), I have developed a strong foundation in full-stack web and mobile application development.
            </p>
            <p>
              I specialize in React, Node.js, Python, and Django, and have hands-on experience integrating AI solutions, building RESTful APIs, and designing responsive user interfaces.
            </p>
            <p>
              Outside of coding, I lead teams effectively and thrive in collaborative environments. My goal is to build software that makes a real difference.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {highlights.map(h => (
                <div key={h.label} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700">
                  <span>{h.icon}</span>{h.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <span key={s} className="badge">{s}</span>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
              <p className="font-bold text-lg mb-1">🎓 Education</p>
              <p className="text-blue-100 text-sm">BS Software Engineering</p>
              <p className="font-semibold mt-1">Iqra University, Islamabad</p>
              <p className="text-blue-100 text-sm mt-0.5">2023 – 2027 (Expected)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
