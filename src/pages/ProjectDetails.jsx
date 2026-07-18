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
    const load = async () => {
      try {
        const data = await fetchProject(id);
        if (data.error) { navigate('/projects'); return; }
        setProject(data);
      } catch {
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  // Detect image orientation once project is loaded
  useEffect(() => {
    if (!project?.imageUrl) return;
    const img = new Image();
    img.onload = () => setImgPortrait(img.naturalHeight > img.naturalWidth);
    img.src = `http://localhost:3001${project.imageUrl}`;
  }, [project]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  const imgSrc = project.imageUrl ? `http://localhost:3001${project.imageUrl}` : null;

  return (
    <div className="py-10 px-4 md:px-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 mb-10 group text-sm font-medium"
        >
          <span className="bg-slate-800 group-hover:bg-blue-600/20 border border-slate-700 group-hover:border-blue-500/50 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200">←</span>
          Back to Projects
        </Link>

        {/* Hero Section */}
        <div className="glass-card rounded-3xl overflow-hidden mb-8 border border-slate-700/50 shadow-2xl">
          {imgSrc ? (
            <div className={`relative bg-slate-950 w-full overflow-hidden flex items-center justify-center ${imgPortrait ? 'py-8' : ''}`}>
              {/* Blurred bg for portrait images */}
              {imgPortrait && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110"
                  style={{ backgroundImage: `url(${imgSrc})` }}
                />
              )}
              <img
                src={imgSrc}
                alt={project.title}
                className={`relative z-10 ${imgPortrait
                  ? 'max-h-[75vh] max-w-sm w-auto object-contain rounded-xl shadow-2xl'
                  : 'w-full object-contain max-h-[60vh]'
                }`}
              />
            </div>
          ) : (
            <div className="w-full h-64 md:h-80 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-5xl">
                🚀
              </div>
              <div className="text-center">
                <p className="text-slate-400 font-medium">No Screenshot Yet</p>
                <p className="text-slate-600 text-sm mt-1">Add one from the Admin Panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Project Info Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12">
          {/* Title + Live Button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-6">
            <div>
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">Project</p>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-white leading-tight">
                {project.title}
              </h1>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-blue-500/40 text-sm"
              >
                View Live
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-8">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="text-sm font-medium bg-gradient-to-r from-blue-500/10 to-emerald-500/10 text-blue-300 border border-blue-500/20 px-4 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
              About this Project
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Bottom navigation */}
          <div className="mt-10 pt-8 border-t border-slate-700/50 flex justify-between items-center">
            <Link
              to="/projects"
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              All Projects
            </Link>
            <Link
              to="/contact"
              className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              Hire Me →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
