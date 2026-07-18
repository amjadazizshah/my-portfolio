import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            if (data.token) {
                navigate('/admin');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 py-24">
            <div className="glass-card w-full max-w-md p-8 rounded-2xl">
                <h2 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Admin Access</h2>
                {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} 
                               className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-2 font-medium">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} 
                               className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
