const Resume = () => (
  <div>
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 px-6 text-center">
      <span className="section-label block mb-2">Career</span>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Resume</h1>
      <p className="text-slate-500 max-w-md mx-auto">My education, skills, and experience at a glance.</p>
    </div>

    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="card shadow-card overflow-hidden">
        {/* Download bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Amjad_Aziz_Shah_Resume.pdf</p>
          <a
            href="/Resume.pdf.pdf"
            download="Amjad_Aziz_Shah_Resume.pdf"
            className="btn-primary text-sm !py-2 !px-5"
          >
            ⬇ Download PDF
          </a>
        </div>

        {/* Preview */}
        <div className="bg-slate-100">
          <iframe
            src="/Resume.pdf.pdf"
            width="100%"
            height="900px"
            title="Amjad Aziz Shah Resume"
            className="block"
          />
        </div>
      </div>
    </div>
  </div>
);

export default Resume;
