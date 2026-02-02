import { LayoutDashboard, Calendar, Users, BookOpen, CheckCircle, FileText, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, active, collapsed }: SidebarItemProps) => (
    <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer transition-all mb-1",
        active ? "bg-primary-500 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        collapsed && "justify-center px-2"
    )}>
        <Icon className="w-5 h-5 min-w-[20px]" />
        {!collapsed && <span className="font-medium text-sm truncate">{label}</span>}
    </div>
);

// Sidebar with Role-Based Filtering
interface SidebarProps {
    role?: 'principal' | 'faculty' | 'admin' | 'hod' | 'orchestrator' | 'student' | 'finance' | 'coe' | 'hr' | 'iqac' | 'tpo' | 'librarian' | 'accreditation_manager' | string;
    activeSessions?: string[];
    onSessionSelect?: (title: string) => void;
    onSessionDelete?: (title: string) => void;
}

export const Sidebar = ({ role = 'principal', activeSessions = [], onSessionSelect, onSessionDelete }: SidebarProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    return (
        <aside className={cn(
            "h-[calc(100vh-64px)] bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative",
            collapsed ? "w-20" : "w-72"
        )}>
            {/* Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 z-10"
            >
                {collapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
            </button>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">

                {/* Search / History (New) */}
                {!collapsed && (
                    <div className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search history..."
                                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <svg className="w-3 h-3 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        {activeSessions.length > 0 && (
                            <div className="mt-3 space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Recent Chats</p>
                                {activeSessions.map(s => (
                                    <div key={s} className="group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 text-xs text-gray-600 transition-colors">
                                        <div
                                            onClick={() => onSessionSelect?.(s)}
                                            className="flex items-center gap-2 flex-1 truncate"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                            <span className="truncate">{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSessionDelete?.(s);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition-all"
                                            title="Delete Chat"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Common */}
                <div onClick={() => navigate('/')} >
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active={window.location.pathname === '/' && !activeSessions.some(s => window.location.hash.includes(s))} collapsed={collapsed} />
                </div>

                {/* --- ACADEMIC SECTION --- */}
                {['principal', 'faculty', 'hod', 'admin', 'orchestrator', 'deans', 'board', 'secretary', 'trust'].includes(role) && (
                    <>
                        <div onClick={() => navigate('/students')} >
                            <SidebarItem icon={Users} label="Students" active={window.location.pathname === '/students'} collapsed={collapsed} />
                        </div>

                        <div className="my-4 border-t border-gray-100" />
                        {!collapsed && <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic</p>}

                        <div onClick={() => navigate('/courses')} >
                            <SidebarItem icon={BookOpen} label={role === 'faculty' ? "My Courses" : "All Courses"} active={window.location.pathname === '/courses'} collapsed={collapsed} />
                        </div>
                        <div onClick={() => navigate('/attendance')} >
                            <SidebarItem icon={CheckCircle} label="Attendance" active={window.location.pathname === '/attendance'} collapsed={collapsed} />
                        </div>
                        <div onClick={() => navigate('/recommendations')} >
                            <SidebarItem icon={CheckCircle} label="AI Recommendations" active={window.location.pathname === '/recommendations'} collapsed={collapsed} />
                        </div>
                    </>
                )}

                {/* --- ADMINISTRATION SECTION --- */}
                {/* Header only if any admin item is visible */}
                {['principal', 'admin', 'finance', 'coe', 'hr', 'iqac', 'orchestrator', 'board', 'secretary', 'trust', 'deans', 'tpo', 'librarian'].includes(role) && (
                    <>
                        <div className="my-4 border-t border-gray-100" />
                        {!collapsed && <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administration</p>}
                    </>
                )}

                {['principal', 'admin', 'finance', 'orchestrator', 'board', 'secretary', 'trust'].includes(role) && (
                    <>
                        <div onClick={() => navigate('/finance/budget')} >
                            <SidebarItem icon={FileText} label="Finance & Budget" active={window.location.pathname.includes('/finance') && !window.location.pathname.includes('approvals')} collapsed={collapsed} />
                        </div>
                        <div onClick={() => navigate('/finance/approvals')} >
                            <SidebarItem icon={CheckCircle} label="Approvals" active={window.location.pathname === '/finance/approvals'} collapsed={collapsed} />
                        </div>
                    </>
                )}

                {['principal', 'admin', 'hr', 'orchestrator', 'board', 'secretary', 'trust'].includes(role) && (
                    <div onClick={() => navigate('/hr')} >
                        <SidebarItem icon={Users} label="Human Resources" active={window.location.pathname === '/hr'} collapsed={collapsed} />
                    </div>
                )}

                {['principal', 'admin', 'coe', 'orchestrator', 'deans', 'board'].includes(role) && (
                    <div onClick={() => navigate('/exam')} >
                        <SidebarItem icon={BookOpen} label="Examination Cell" active={window.location.pathname === '/exam'} collapsed={collapsed} />
                    </div>
                )}

                {['principal', 'admin', 'finance', 'orchestrator', 'board'].includes(role) && (
                    <div onClick={() => navigate('/admin/purchase')} >
                        <SidebarItem icon={FileText} label="Purchase Orders" active={window.location.pathname.includes('/purchase')} collapsed={collapsed} />
                    </div>
                )}

                {['admin', 'orchestrator'].includes(role) && (
                    <div onClick={() => navigate('/admin/integrations')}>
                        <SidebarItem icon={LayoutDashboard} label="Integrations" active={window.location.pathname === '/admin/integrations'} collapsed={collapsed} />
                    </div>
                )}

                {['principal', 'admin', 'iqac', 'accreditation_manager', 'orchestrator', 'board', 'deans'].includes(role) && (
                    <div onClick={() => navigate('/accreditation')}>
                        <SidebarItem icon={CheckCircle} label="Accreditation" active={window.location.pathname === '/accreditation'} collapsed={collapsed} />
                    </div>
                )}

                {/* --- UNIVERSAL TOOLS --- */}
                {/* Everyone except students gets access to Report Builder (controlled by role inside) */}
                {role !== 'student' && (
                    <div onClick={() => navigate(`/reports/builder?role=${role}`)} className="mt-2">
                        <SidebarItem icon={FileText} label="Report Builder" active={window.location.pathname === '/reports/builder'} collapsed={collapsed} />
                    </div>
                )}


                {/* Role Specific: HOD Department View */}
                {role === 'hod' && (
                    <div onClick={() => navigate('/department/overview')}>
                        <SidebarItem icon={Users} label="Dept Overview" active={window.location.pathname === '/department/overview'} collapsed={collapsed} />
                    </div>
                )}

                {/* Role Specific: Faculty Tools */}
                {role === 'faculty' && (
                    <>
                        <div onClick={() => navigate('/calendar')}>
                            <SidebarItem icon={Calendar} label="Calendar" active={window.location.pathname === '/calendar'} collapsed={collapsed} />
                        </div>
                        <div onClick={() => navigate('/assignments')}>
                            <SidebarItem icon={FileText} label="Assignments" active={window.location.pathname === '/assignments'} collapsed={collapsed} />
                        </div>
                    </>
                )}

                {/* Common Bottom */}
                <div className="my-4 border-t border-gray-100" />
                <div onClick={() => navigate('/org-structure')}>
                    <SidebarItem icon={Users} label="Organization" active={window.location.pathname === '/org-structure'} collapsed={collapsed} />
                </div>
                <div onClick={() => navigate('/calendar')} >
                    <SidebarItem icon={Calendar} label="Academic Calendar" active={window.location.pathname === '/calendar'} collapsed={collapsed} />
                </div>
                <div onClick={() => navigate('/timetable')} >
                    <SidebarItem icon={Calendar} label="Timetable" active={window.location.pathname === '/timetable'} collapsed={collapsed} />
                </div>
            </div>
        </aside>
    );
};
