const Resume = () => {
  return (
    <div className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 inline-block">Resume</h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mt-2 opacity-70"></div>
        </div>
        
        <div className="glass-card p-8 md:p-12 rounded-3xl backdrop-blur-xl text-center">
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            My resume outlines my professional experience, education at Iqra University, and technical skills in full-stack development.
          </p>
          
          <div className="mb-10 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <iframe 
              src="/Resume.pdf.pdf" 
              width="100%" 
              height="800px" 
              title="Amjad Aziz Shah Resume"
              className="bg-slate-900"
            />
          </div>
          
          <a href="/Resume.pdf.pdf" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-1" download="Amjad_Aziz_Shah_Resume.pdf">
            Download Resume (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resume;
