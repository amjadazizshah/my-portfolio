import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProjects } from '../api';

// Detect orientation of an image URL
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

const ProjectCard = ({ project, index }) => {
  const imgSrc = project.imageUrl ? `http://localhost:3001${project.imageUrl}` : null;
  const isPortrait = useImageOrientation(imgSrc);

  return (
    <Link
      to={`/projects/${project.id}`}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-400 cursor-pointer border border-transparent"
    >
      {/* Image area */}
      <div className={`relative overflow-hidden bg-slate-900 ${isPortrait ? 'aspect-[3/4] max-h-72' : 'aspect-video'}`}>
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="text-white text-xs font-bold bg-blue-600 px-3 py-1.5 rounded-full shadow-lg">
                View Details →
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              🚀
            </div>
            <span className="text-slate-500 text-xs tracking-wide uppercase font-medium">Screenshot coming soon</span>
            <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-400 transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tags?.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {project.tags?.length > 4 && (
            <span className="text-xs font-medium text-slate-500 px-2.5 py-1">
              +{project.tags.length - 4} more
            </span>
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
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-blue-400 font-semibold tracking-widest uppercase text-sm mb-3">Portfolio</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 inline-block leading-tight">
            Projects & Experience
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mt-4 opacity-70" />
          <p className="text-slate-400 mt-6 text-lg max-w-xl mx-auto">
            A curated showcase of projects I've built — click any card to explore it in full detail.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 text-slate-500">
            <div className="text-6xl mb-4">📂</div>
            <p className="text-xl">No projects yet. Add them from the Admin Panel!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
