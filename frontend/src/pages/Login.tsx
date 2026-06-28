import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';

interface LoginPageProps {
    onLogin: (username: string, role: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [role, setRole] = useState('admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setError("Please enter credentials.");
            return;
        }
        setLoading(true);
        
        const login = async () => {
            if (role === 'admin' && username === 'admin' && password === 'admin') {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            username: username,
                            password: password
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('access_token', data.access_token);
                    }
                } catch (e) {
                    console.error("Auth failed, falling back to mock", e);
                }
            } else if (role !== 'student') {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({ username: 'admin', password: 'admin' })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        localStorage.setItem('access_token', data.access_token);
                    } else {
                        localStorage.setItem('access_token', 'mock_token');
                    }
                } catch (e) {
                    console.error(e);
                    localStorage.setItem('access_token', 'mock_token');
                }
            } else {
                localStorage.setItem('access_token', 'mock_token');
            }
            localStorage.setItem('user_role', role);
            onLogin(username, role);
            navigate('/');
        };
        login().finally(() => setLoading(false));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-1">ERP Agent Nexus</h1>
                        <p className="text-blue-200 text-sm">Enterprise Resource Planning AI</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-blue-200 uppercase tracking-wider ml-1">Role</label>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-black/20 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                                {[
                                    'admin', 'faculty', 'student', 'iqac', 'hod', 'tpo', 
                                    'coe', 'finance', 'accreditation_manager', 'librarian', 
                                    'anti_ragging', 'sc_st_cell', 'icc', 'grievance', 
                                    'women_cell', 'principal'
                                ].map(r => (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRole(r)}
                                        className={`py-2 rounded-lg text-xs font-medium capitalize transition-all ${role === r ? 'bg-blue-500 text-white shadow-lg' : 'text-blue-300 hover:bg-white/5'}`}
                                    >
                                        {r.replace(/_/g, ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-3 top-3 w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="Username / ID"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-black/30 transition-all font-medium"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-black/30 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Access System <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="bg-black/20 p-4 text-center border-t border-white/5">
                    <p className="text-xs text-blue-300 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-3 h-3" /> Secure Educational Environment
                    </p>
                </div>
            </div>
        </div>
    );
};
