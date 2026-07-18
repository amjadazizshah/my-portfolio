import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../api';

const useImageOrientation = (url) => {
  const [portrait, setPortrait] = useState(false);
  useEffect(() => {
    if (!url) return;
    const img = new Image();
    img.onload = () => setPortrait(img.naturalHeight > img.naturalWidth);
    img.src = url;
  }, [url]);
  return portrait;
};

const ProjectCard = ({ project }) => {
  const imgSrc = project.imageUrl ? `http://localhost:3001${project.imageUrl}` : null;
  const isPortrait = useImageOrientation(imgSrc);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="card card-hover flex flex-col overflow-hidden group"
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-slate-100 ${isPortrait ? 'aspect-[3/4] max-h-72' : 'aspect-video'}`}>
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                Open Project →
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl">🚀</div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Screenshot coming soon</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags?.slice(0, 4).map(tag => (
            <span key={tag} className="badge">{tag}</span>
          ))}
          {project.tags?.length > 4 && (
            <span className="text-xs text-slate-400 font-medium px-2 py-1">+{project.tags.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects().then(setProjects).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-b border-slate-200 py-16 px-6 text-center">
        <span className="section-label block mb-2">Portfolio</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Projects & Experience</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          A curated showcase of what I've built. Click any card to explore it in full detail.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 text-slate-400">
            <div className="text-6xl mb-4">📂</div>
            <p>No projects yet — add some from the Admin Panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => <ProjectCard key={p.id || i} project={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
