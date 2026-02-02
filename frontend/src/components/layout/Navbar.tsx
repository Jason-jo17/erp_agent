import { useState, useEffect } from 'react';
import { Bell, User, Menu, Sun, Moon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

// ... (Interface Code)
interface NavbarProps {
    onMenuClick?: () => void;
    activeMode: boolean;
    onToggleActiveMode: () => void;
    mockMode: boolean;
    onToggleMockMode: () => void;
}

export const Navbar = ({ onMenuClick, activeMode, onToggleActiveMode, mockMode, onToggleMockMode }: NavbarProps) => {
    // ... state ...
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });
    const [showNotifications, setShowNotifications] = useState(false);

    // ... effects ...
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-[1000] shadow-sm dark:bg-gray-900 dark:border-gray-700">
            {/* ... Logo Section ... */}
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-md dark:hover:bg-gray-800">
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}
                <Link to="/" className="text-xl font-bold text-primary-600 flex items-center gap-2 dark:text-primary-400 cursor-pointer hover:opacity-80 transition-opacity">
                    🏛️ ABC Institute
                </Link>
            </div>

            <div className="hidden md:flex gap-1 flex-1 justify-center">
                {/* ... Links ... */}
                <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `px-4 py-2 rounded-md font-medium transition-all ${isActive
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/20 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/courses"
                    className={({ isActive }) => `px-4 py-2 rounded-md font-medium transition-all ${isActive
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/20 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                >
                    Academic
                </NavLink>
                <NavLink
                    to="/calendar"
                    className={({ isActive }) => `px-4 py-2 rounded-md font-medium transition-all ${isActive
                        ? 'text-primary-600 bg-primary-50 dark:text-primary-300 dark:bg-primary-900/20 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                >
                    Examinations
                </NavLink>
            </div>

            <div className="flex items-center gap-4">
                {/* Mock Mode Toggle */}
                <div className="flex items-center gap-2 mr-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700" title="Toggle Mock/Demo Mode">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{mockMode ? 'Mock' : 'Live UI'}</span>
                    <button
                        onClick={onToggleMockMode}
                        className={`relative w-8 h-4 rounded-full transition-colors duration-300 focus:outline-none ${mockMode ? 'bg-purple-500' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${mockMode ? 'translate-x-4' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Active Mode Toggle */}
                <div className="flex items-center gap-2 mr-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{activeMode ? 'Active' : 'Passive'}</span>
                    <button
                        onClick={onToggleActiveMode}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${activeMode ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${activeMode ? 'translate-x-5' : 'translate-x-0'
                                }`}
                        />
                    </button>
                </div>

                {/* Dark mode toggle button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors border border-transparent hover:border-gray-200 dark:hover:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-700"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                <button onClick={() => setShowNotifications(false)} className="text-xs text-gray-500 hover:text-gray-700">Close</button>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-red-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Compliance Audit Due</p>
                                        <p className="text-xs text-gray-500">The NAAC audit checklist is pending review.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Low Attendance Alert</p>
                                        <p className="text-xs text-gray-500">CS-Year3 attendance dropped below 75%.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">New Research Grant</p>
                                        <p className="text-xs text-gray-500">DST Grant application is open.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                    <div className="text-right hidden sm:block">
                    </div>
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center border border-primary-200">
                        <User className="w-5 h-5 text-primary-600" />
                    </div>
                </div>
            </div>
        </nav >
    );
};
