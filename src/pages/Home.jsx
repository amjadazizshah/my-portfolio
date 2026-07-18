import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="py-12 md:py-24 px-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
        <div className="flex-1 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Hi, I'm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 block mt-2">Amjad Aziz Shah</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed mb-10 mx-auto md:mx-0">
            A passionate Software Engineer dedicated to building robust full-stack applications and solving complex problems.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <Link to="/contact" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 text-center">Get In Touch</Link>
            <Link to="/projects" className="glass hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-1 text-center">View My Work</Link>
          </div>
        </div>

        {/* Dynamic Profile Picture Section */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-slate-700/50 shadow-2xl animate-float">
            <img 
              src="/profile.png" 
              alt="Amjad Aziz Shah" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold inline-block relative">
            About Me
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full"></div>
          </h2>
        </div>
        
        <div className="glass-card p-8 md:p-12 rounded-3xl backdrop-blur-xl">
          <div className="space-y-6 text-slate-300 text-lg leading-relaxed mb-10">
            <p>
              Currently pursuing my BS in Software Engineering at Iqra University (2023-2027), I have developed a strong foundation in full-stack web and mobile application development.
            </p>
            <p>
              I specialize in React, Node.js, Python, and Django, and have hands-on experience integrating AI solutions, building RESTful APIs, and designing responsive user interfaces. My strengths lie in analytical thinking, quick learning, and effective troubleshooting.
            </p>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-6">Tech Stack</h3>
          <div className="flex flex-wrap gap-3 mb-10">
            {['C/C++', 'Java', 'JavaScript', 'Python', 'SQL', 'Django', 'Flask', 'React', 'React Native', 'HTML/CSS', 'MySQL', 'MongoDB'].map(skill => (
              <span key={skill} className="bg-slate-800/80 border border-slate-700 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:border-blue-500/50 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-6">Core Skills</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <li className="flex items-center space-x-2"><span className="text-blue-400">▹</span> <span>Problem Solving & Analytical Thinking</span></li>
            <li className="flex items-center space-x-2"><span className="text-blue-400">▹</span> <span>Debugging & Troubleshooting</span></li>
            <li className="flex items-center space-x-2"><span className="text-blue-400">▹</span> <span>Quick Learning Ability</span></li>
            <li className="flex items-center space-x-2"><span className="text-blue-400">▹</span> <span>Leadership & Coordination</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
