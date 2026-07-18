import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, addProject, editProject, deleteProject, uploadImage, fetchBlogs } from '../api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [activeTab, setActiveTab] = useState('projects');
    const [editingId, setEditingId] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState('');
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/login');
        } else {
            loadData();
        }
    }, [navigate]);

    const loadData = async () => {
        try {
            const p = await fetchProjects();
            setProjects(p);
            const b = await fetchBlogs();
            setBlogs(b);
        } catch (e) {
            console.error("Failed to load data", e);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    const resetForm = () => {
        setTitle(''); setDescription(''); setTags(''); setLink('');
        setFile(null); setExistingImageUrl(''); setEditingId(null); setFormError('');
    };

    const handleEditClick = (project) => {
        setEditingId(project.id);
        setTitle(project.title);
        setDescription(project.description);
        setTags(project.tags?.join(', ') || '');
        setLink(project.link || '');
        setExistingImageUrl(project.imageUrl || '');
        setFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        let imageUrl = existingImageUrl;

        if (file) {
            const res = await uploadImage(file);
            if (res.imageUrl) imageUrl = res.imageUrl;
        }

        const projectData = {
            title,
            description,
            tags: tags.split(',').map(t => t.trim()).filter(Boolean),
            imageUrl,
            link
        };

        if (editingId) {
            await editProject(editingId, projectData);
        } else {
            await addProject(projectData);
        }

        resetForm();
        loadData();
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Delete this project?')) {
            await deleteProject(id);
            if (editingId === id) resetForm();
            loadData();
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 py-12 w-full">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 mt-1">Manage your portfolio content</p>
                </div>
                <button onClick={handleLogout} className="bg-red-500/10 text-red-400 border border-red-500/30 px-5 py-2 rounded-xl hover:bg-red-500/30 transition-colors font-medium">
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-10 border-b border-slate-700/60">
                <button onClick={() => setActiveTab('projects')} className={`pb-3 px-5 font-semibold transition-colors ${activeTab === 'projects' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}>
                    Projects
                </button>
                <button onClick={() => setActiveTab('blogs')} className={`pb-3 px-5 font-semibold transition-colors ${activeTab === 'blogs' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}>
                    Blogs
                </button>
            </div>

            {activeTab === 'projects' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Form Panel */}
                    <div className="glass-card p-6 rounded-2xl">
                        <h2 className="text-xl font-bold mb-1 text-white">
                            {editingId ? '✏️ Edit Project' : '➕ Add New Project'}
                        </h2>
                        {editingId && (
                            <p className="text-blue-400 text-sm mb-4">Editing project ID #{editingId}</p>
                        )}
                        {formError && <p className="text-red-400 text-sm mb-4">{formError}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">Title *</label>
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">Description *</label>
                                <textarea
                                    placeholder="Describe your project..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    required
                                    rows="4"
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="React, Node.js, Python..."
                                    value={tags}
                                    onChange={e => setTags(e.target.value)}
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">Live URL (optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://yourproject.com"
                                    value={link}
                                    onChange={e => setLink(e.target.value)}
                                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-slate-400 text-sm mb-1 block">Screenshot Image</label>
                                {existingImageUrl && (
                                    <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
                                        <img src={`http://localhost:3001${existingImageUrl}`} alt="current" className="w-16 h-10 object-cover rounded border border-slate-700" />
                                        <span>Current image (upload new to replace)</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full text-slate-300 text-sm" />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg shadow-blue-500/20">
                                    {editingId ? 'Save Changes' : 'Add Project'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl font-semibold border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Projects List Panel */}
                    <div>
                        <h2 className="text-xl font-bold mb-5 text-white">Existing Projects ({projects.length})</h2>
                        <div className="space-y-4 max-h-[680px] overflow-y-auto pr-1">
                            {projects.length === 0 && (
                                <p className="text-slate-500 text-center py-8">No projects yet. Add your first one!</p>
                            )}
                            {projects.map(p => (
                                <div key={p.id} className={`glass-card p-4 rounded-xl flex gap-4 items-center transition-all border ${editingId === p.id ? 'border-blue-500/50' : 'border-transparent'}`}>
                                    {p.imageUrl ? (
                                        <img src={`http://localhost:3001${p.imageUrl}`} alt={p.title} className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-700" />
                                    ) : (
                                        <div className="w-16 h-12 rounded-lg shrink-0 bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">🚀</div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white truncate">{p.title}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5 truncate">{p.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {p.tags?.slice(0, 3).map(t => (
                                                <span key={t} className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => handleEditClick(p)}
                                            className="text-sm text-blue-400 hover:text-blue-300 px-3 py-1.5 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProject(p.id)}
                                            className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'blogs' && (
                <div className="glass-card p-8 rounded-2xl text-center">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-xl font-bold text-white mb-2">Blog Management</h3>
                    <p className="text-slate-400 mb-2">Currently tracking <span className="text-blue-400 font-semibold">{blogs.length}</span> blog posts.</p>
                    <p className="text-slate-500 text-sm">Full blog editor coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
