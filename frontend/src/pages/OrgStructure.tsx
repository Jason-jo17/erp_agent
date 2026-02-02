import React, { useRef, useState } from 'react';
import { Network, Users, UserCheck, GraduationCap, ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

interface RoleNode {
    id: string;
    title: string;
    count: number;
    icon: React.ElementType;
    children?: RoleNode[];
    color: string;
}

const orgData: RoleNode = {
    id: 'board',
    title: 'Board of Governors / Trust',
    count: 12,
    icon: Network,
    color: 'bg-indigo-100 text-indigo-700',
    children: [
        {
            id: 'principal',
            title: 'Principal / Director',
            count: 1,
            icon: UserCheck,
            color: 'bg-purple-100 text-purple-700',
            children: [
                {
                    id: 'iqac',
                    title: 'IQAC Coordinator & Members',
                    count: 4,
                    icon: Network,
                    color: 'bg-purple-100 text-purple-700',
                },
                {
                    id: 'accreditation_manager',
                    title: 'Accreditation Manager',
                    count: 1,
                    icon: UserCheck,
                    color: 'bg-indigo-100 text-indigo-700',
                },
                {
                    id: 'coe',
                    title: 'Controller of Examinations',
                    count: 3,
                    icon: GraduationCap,
                    color: 'bg-blue-100 text-blue-700',
                },
                {
                    id: 'finance',
                    title: 'Finance Officer',
                    count: 2,
                    icon: UserCheck,
                    color: 'bg-green-100 text-green-700',
                },
                {
                    id: 'anti_ragging',
                    title: 'Anti-Ragging Committee',
                    count: 6,
                    icon: Users,
                    color: 'bg-red-100 text-red-700',
                },
                {
                    id: 'sc_st_cell',
                    title: 'SC/ST/OBC Cell',
                    count: 4,
                    icon: Users,
                    color: 'bg-indigo-100 text-indigo-700',
                },
                {
                    id: 'icc',
                    title: 'Internal Complaints Committee (ICC)',
                    count: 5,
                    icon: UserCheck,
                    color: 'bg-pink-100 text-pink-700',
                },
                {
                    id: 'grievance',
                    title: 'Grievance Redressal Committee',
                    count: 5,
                    icon: Users,
                    color: 'bg-orange-100 text-orange-700',
                },
                {
                    id: 'women_cell',
                    title: 'Women Empowerment Cell',
                    count: 4,
                    icon: Users,
                    color: 'bg-pink-100 text-pink-700',
                },
                {
                    id: 'deans',
                    title: 'Deans (Academic, Student Affairs, R&D)',
                    count: 5,
                    icon: GraduationCap,
                    color: 'bg-blue-100 text-blue-700',
                    children: [
                        {
                            id: 'hods',
                            title: 'Heads of Departments (HODs)',
                            count: 12,
                            icon: Users,
                            color: 'bg-cyan-100 text-cyan-700',
                            children: [
                                {
                                    id: 'faculty',
                                    title: 'Faculty Members (Prof, Assoc, Asst)',
                                    count: 154,
                                    icon: Users,
                                    color: 'bg-emerald-100 text-emerald-700',
                                    children: [
                                        {
                                            id: 'student',
                                            title: 'Students',
                                            count: 2000,
                                            icon: Users,
                                            color: 'bg-gray-100 text-gray-700',
                                        }
                                    ]
                                },
                                {
                                    id: 'staff',
                                    title: 'Technical & Admin Staff',
                                    count: 45,
                                    icon: Users,
                                    color: 'bg-slate-100 text-slate-700',
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'admin_officer',
                    title: 'Administrative Officer',
                    count: 1,
                    icon: UserCheck,
                    color: 'bg-orange-100 text-orange-700',
                    children: [
                        {
                            id: 'tpo',
                            title: 'Training & Placement Officer',
                            count: 2,
                            icon: Network,
                            color: 'bg-blue-100 text-blue-700',
                        },
                        {
                            id: 'librarian',
                            title: 'Librarian',
                            count: 3,
                            icon: UserCheck,
                            color: 'bg-yellow-100 text-yellow-700',
                        },
                        {
                            id: 'admin_staff',
                            title: 'Office Administration',
                            count: 20,
                            icon: Users,
                            color: 'bg-slate-100 text-slate-700',
                        }
                    ]
                }
            ]
        }
    ]
};

const TreeNode = ({ node, onNodeClick }: { node: RoleNode, onNodeClick?: (roleId: string) => void }) => (
    <div className="flex flex-col items-center">
        <div
            onClick={() => onNodeClick && onNodeClick(node.id)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 ${node.color} shadow-sm w-64 transition-all hover:scale-105 hover:shadow-md cursor-pointer hover:border-solid bg-white z-10`}
        >
            <node.icon className="w-8 h-8 mb-2" />
            <h3 className="font-bold text-center">{node.title}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 bg-white/50 rounded-full mt-1">
                {node.count} Members
            </span>
            <span className="text-[10px] mt-2 text-gray-500 opacity-60">Click to chat</span>
        </div>

        {node.children && (
            <div className="flex flex-col items-center">
                <div className="h-8 w-px bg-gray-300"></div>
                <div className="flex gap-8 relative flex-nowrap">
                    {node.children.length > 1 && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gray-300 -z-10" style={{ width: `calc(100% - 16rem)` }}></div>
                    )}
                    {node.children.map((child) => (
                        <div key={child.id} className="flex flex-col items-center relative pt-4 shrink-0">
                            {/* Connector lines */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300"></div>
                            <TreeNode node={child} onNodeClick={onNodeClick} />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export const OrgStructure = ({ onRoleSelect }: { onRoleSelect?: (roleId: string) => void }) => {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [pin, setPin] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');

    // Zoom & Pan State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleNodeClick = (roleId: string) => {
        setSelectedRole(roleId);
        setShowModal(true);
        setPin('');
        setError('');
    };

    const handleVerify = () => {
        if (pin === '1234') {
            setShowModal(false);
            if (onRoleSelect && selectedRole) {
                onRoleSelect(selectedRole);
            }
        } else {
            setError('Invalid PIN. Access Denied.');
        }
    };

    // Zoom Handlers
    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.4));
    const handleReset = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleFitToScreen = () => {
        if (containerRef.current && contentRef.current) {
            const container = containerRef.current.getBoundingClientRect();
            const content = contentRef.current.getBoundingClientRect();
            // Undo current scale to get natural size
            const naturalWidth = content.width / scale;
            const naturalHeight = content.height / scale;

            const scaleX = (container.width - 100) / naturalWidth; // 100px padding
            const scaleY = (container.height - 100) / naturalHeight;
            const newScale = Math.min(scaleX, scaleY, 1); // Don't zoom in if it fits, max 1

            setScale(newScale);
            // Center it
            setPosition({
                x: (container.width - naturalWidth * newScale) / 2,
                y: (container.height - naturalHeight * newScale) / 2
            });
        }
    };

    return (
        <div className="p-6 relative flex flex-col h-[calc(100vh-64px)]"> {/* Fixed height relative to viewport minus header */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b pb-4">
                {/* Zoom Controls - Moved to Top Left */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 z-[99]">
                    <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Zoom Out">
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-bold w-12 text-center text-gray-700">{Math.round(scale * 100)}%</span>
                    <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Zoom In">
                        <ZoomIn className="w-5 h-5" />
                    </button>
                    <div className="w-px h-5 bg-gray-300 mx-2"></div>
                    <button onClick={handleFitToScreen} className="p-1.5 hover:bg-gray-100 rounded text-blue-600 font-medium flex items-center gap-1" title="Fit to Screen">
                        <Maximize className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs">Fit</span>
                    </button>
                    <button onClick={handleReset} className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Reset">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Organizational Structure</h1>
                    <p className="text-gray-500">Select a role below to interact with its AI Agent.</p>
                </div>
            </div>

            <div className="flex-1 border rounded-lg bg-slate-50 relative overflow-hidden shadow-inner">
                {/* Scroll Container */}
                <div
                    ref={containerRef}
                    className="w-full h-full overflow-hidden p-0 relative cursor-move bg-slate-50"
                    onMouseDown={(e) => {
                        const ele = containerRef.current;
                        if (!ele) return;
                        ele.style.cursor = 'grabbing';
                        ele.style.userSelect = 'none';

                        const startX = e.clientX - position.x;
                        const startY = e.clientY - position.y;

                        const onMouseMove = (moveEvent: MouseEvent) => {
                            setPosition({
                                x: moveEvent.clientX - startX,
                                y: moveEvent.clientY - startY
                            });
                        };

                        const onMouseUp = () => {
                            ele.style.cursor = 'move';
                            ele.style.removeProperty('user-select');
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);
                        };

                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    }}
                >
                    {/* Content Container */}
                    <div
                        ref={contentRef}
                        className="absolute origin-top-left transition-transform duration-100 ease-out"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            width: 'max-content',
                            padding: '4rem'
                        }}
                    >
                        {/* Tree Wrapper */}
                        <div className="flex justify-center w-full">
                            <TreeNode node={orgData} onNodeClick={handleNodeClick} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Credential Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <UserCheck className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Verify Identity</h3>
                            <p className="text-sm text-gray-500">Enter secure PIN to access <strong>{selectedRole?.toUpperCase()}</strong> role.</p>
                        </div>

                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="Enter PIN (1234)"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                        />

                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerify}
                                className="flex-1 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm"
                            >
                                Verify Access
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
