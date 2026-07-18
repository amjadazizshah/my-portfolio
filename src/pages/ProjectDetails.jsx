import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchProject } from '../api';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgPortrait, setImgPortrait] = useState(false);

  useEffect(() => {
    fetchProject(id)
      .then(data => {
        if (data.error) { navigate('/projects'); return; }
        setProject(data);
      })
      .catch(() => navigate('/projects'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!project?.imageUrl) return;
    const img = new Image();
    img.onload = () => setImgPortrait(img.naturalHeight > img.naturalWidth);
    img.src = `http://localhost:3001${project.imageUrl}`;
  }, [project]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Loading project...</p>
      </div>
    </div>
  );

  if (!project) return null;
  const imgSrc = project.imageUrl ? `http://localhost:3001${project.imageUrl}` : null;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Back nav */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors group">
            <span className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center bg-white group-hover:border-blue-300 group-hover:text-blue-600 transition-all">←</span>
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Image hero */}
        <div className="card overflow-hidden mb-8 shadow-card">
          {imgSrc ? (
            <div className={`relative bg-slate-100 w-full flex items-center justify-center ${imgPortrait ? 'py-10 px-6' : ''}`}>
              {imgPortrait && (
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl scale-110"
                  style={{ backgroundImage: `url(${imgSrc})` }}
                />
              )}
              <img
                src={imgSrc}
                alt={project.title}
                className={`relative z-10 ${
                  imgPortrait
                    ? 'max-h-[75vh] max-w-xs w-auto object-contain rounded-xl shadow-2xl'
                    : 'w-full object-contain max-h-[60vh]'
                }`}
              />
            </div>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center text-5xl">🚀</div>
              <p className="text-slate-400 font-medium">No Screenshot Yet — add one from Admin Panel</p>
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="card p-8 md:p-12 shadow-card">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
            <div>
              <span className="section-label block mb-2">Project</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{project.title}</h1>
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="btn-primary shrink-0 flex items-center gap-2 text-sm">
                View Live
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map(t => <span key={t} className="badge">{t}</span>)}
            </div>
          )}

          <hr className="border-slate-200 mb-8" />

          {/* Description */}
          <h2 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-600 rounded-full inline-block" />
            About this Project
          </h2>
          <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap">{project.description}</p>

          {/* Footer nav */}
          <div className="mt-10 pt-8 border-t border-slate-200 flex justify-between items-center flex-wrap gap-4">
            <Link to="/projects" className="text-slate-500 hover:text-slate-900 text-sm font-semibold transition-colors flex items-center gap-2">
              ← All Projects
            </Link>
            <Link to="/contact" className="btn-primary text-sm">
              Hire Me →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
