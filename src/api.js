const API_URL = 'http://localhost:3001/api';

export const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    return res.json();
};

export const fetchProject = async (id) => {
    const res = await fetch(`${API_URL}/projects/${id}`);
    return res.json();
};

export const fetchBlogs = async () => {
    const res = await fetch(`${API_URL}/blogs`);
    return res.json();
};

export const login = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
        localStorage.setItem('adminToken', data.token);
    }
    return data;
};

export const addProject = async (projectData) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(projectData)
    });
    return res.json();
};

export const editProject = async (id, projectData) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(projectData)
    });
    return res.json();
};

export const deleteProject = async (id) => {
    const token = localStorage.getItem('adminToken');
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
};

export const uploadImage = async (file) => {
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    return res.json();
};
