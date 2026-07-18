import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, addProject, editProject, deleteProject, uploadImage, fetchBlogs } from '../api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs]       = useState([]);
  const [activeTab, setActiveTab] = useState('projects');
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle]         = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags]           = useState('');
  const [link, setLink]           = useState('');
  const [file, setFile]           = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/login');
    else loadData();
  }, [navigate]);

  const loadData = async () => {
    const [p, b] = await Promise.all([fetchProjects(), fetchBlogs()]);
    setProjects(p);
    setBlogs(b);
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setTags(''); setLink('');
    setFile(null); setExistingImageUrl(''); setEditingId(null);
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setTags(p.tags?.join(', ') || '');
    setLink(p.link || '');
    setExistingImageUrl(p.imageUrl || '');
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    let imageUrl = existingImageUrl;
    if (file) {
      const res = await uploadImage(file);
      if (res.imageUrl) imageUrl = res.imageUrl;
    }
    const data = {
      title, description,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl, link,
    };
    if (editingId) await editProject(editingId, data);
    else           await addProject(data);
    resetForm(); loadData(); setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await deleteProject(id);
    if (editingId === id) resetForm();
    loadData();
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-400 text-xs mt-0.5">Manage your portfolio content</p>
          </div>
          <button onClick={() => { localStorage.removeItem('adminToken'); navigate('/login'); }}
            className="text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-200 rounded-xl p-1 w-fit">
          {['projects', 'blogs'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="card shadow-card p-6">
              <h2 className="text-lg font-extrabold text-slate-900 mb-5">
                {editingId ? `✏️ Editing Project #${editingId}` : '➕ Add New Project'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Title *</label>
                  <input type="text" value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Project Title"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Description *</label>
                  <textarea value={description} onChange={e=>setDescription(e.target.value)} required rows="4" placeholder="Describe the project..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white resize-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Tags (comma separated)</label>
                  <input type="text" value={tags} onChange={e=>setTags(e.target.value)} placeholder="React, Node.js, Python"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Live URL (optional)</label>
                  <input type="url" value={link} onChange={e=>setLink(e.target.value)} placeholder="https://example.com"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block">Screenshot</label>
                  {existingImageUrl && (
                    <img src={`http://localhost:3001${existingImageUrl}`} alt="current"
                      className="w-20 h-14 object-cover rounded-lg border border-slate-200 mb-2" />
                  )}
                  <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])}
                    className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-semibold hover:file:bg-blue-100 transition" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={saving} className="flex-1 btn-primary text-sm disabled:opacity-60">
                    {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Project'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm}
                      className="px-5 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 mb-5">
                Existing Projects <span className="text-slate-400 font-normal text-base">({projects.length})</span>
              </h2>
              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
                {projects.length === 0 && (
                  <div className="text-center py-16 text-slate-400 card">
                    <p className="text-4xl mb-3">📂</p>
                    <p className="text-sm">No projects yet. Add your first one!</p>
                  </div>
                )}
                {projects.map(p => (
                  <div key={p.id} className={`card p-4 flex gap-4 items-center transition-all ${editingId === p.id ? 'ring-2 ring-blue-500' : ''}`}>
                    {p.imageUrl ? (
                      <img src={`http://localhost:3001${p.imageUrl}`} alt={p.title}
                        className="w-16 h-12 object-cover rounded-lg shrink-0 border border-slate-200" />
                    ) : (
                      <div className="w-16 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl shrink-0">🚀</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{p.title}</p>
                      <p className="text-slate-400 text-xs truncate mt-0.5">{p.description}</p>
                      <div className="flex gap-1 mt-1.5">
                        {p.tags?.slice(0, 3).map(t => <span key={t} className="badge !text-[10px] !px-2 !py-0.5">{t}</span>)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => handleEditClick(p)}
                        className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
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
          <div className="card shadow-card p-10 text-center">
            <p className="text-5xl mb-4">📝</p>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Blog Management</h3>
            <p className="text-slate-500">Currently tracking <span className="text-blue-600 font-bold">{blogs.length}</span> blog posts. Full blog editor coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
