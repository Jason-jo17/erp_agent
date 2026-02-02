import { useState } from 'react';
import {
    Users, Calendar, Search, MoreVertical,
    Mail, Phone, FileText, CheckCircle, XCircle
} from 'lucide-react';

type Tab = 'directory' | 'payroll' | 'leave';

interface Employee {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone: string;
    status: 'Active' | 'On Leave';
    avatar: string;
}

const MOCK_EMPLOYEES: Employee[] = [
    { id: '1', name: 'Dr. Sarah Johnson', role: 'Professor', department: 'Computer Science', email: 'sarah.j@college.edu', phone: '+91 98765 43210', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=0D8ABC&color=fff' },
    { id: '2', name: 'Prof. Michael Chen', role: 'Assoc. Professor', department: 'Electronics', email: 'm.chen@college.edu', phone: '+91 98765 43211', status: 'On Leave', avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random' },
    { id: '3', name: 'Ms. Emily Davis', role: 'Lab Assistant', department: 'Mechanical', email: 'emily.d@college.edu', phone: '+91 98765 43212', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=random' },
    { id: '4', name: 'Mr. Robert Wilson', role: 'Admin Officer', department: 'Administration', email: 'rob.w@college.edu', phone: '+91 98765 43213', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Robert+Wilson&background=random' },
];

const MOCK_LEAVE_REQUESTS = [
    { id: '1', employee: 'Prof. Michael Chen', type: 'Sick Leave', dates: '12 Dec - 15 Dec', reason: 'Viral Fever', status: 'Pending' },
    { id: '2', employee: 'Dr. Sarah Johnson', type: 'Conference', dates: '20 Jan - 22 Jan', reason: 'ICIC 2025 Paper Presentation', status: 'Approved' },
];

const MOCK_PAYROLL = [
    { id: '1', employee: 'Dr. Sarah Johnson', basic: 120000, allowances: 30000, deductions: 5000, net: 145000, status: 'Paid' },
    { id: '2', employee: 'Prof. Michael Chen', basic: 90000, allowances: 20000, deductions: 4000, net: 106000, status: 'Pending' },
    { id: '3', employee: 'Ms. Emily Davis', basic: 40000, allowances: 5000, deductions: 2000, net: 43000, status: 'Paid' },
];

export const HumanResources = () => {
    const [activeTab, setActiveTab] = useState<Tab>('directory');

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Users className="w-6 h-6 text-indigo-600" />
                            Human Resources
                        </h1>
                        <p className="text-sm text-gray-500">Manage staff, payroll, and leave requests.</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center gap-2">
                        <Users className="w-4 h-4" /> Add Employee
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('directory')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'directory' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Directory
                    </button>
                    <button
                        onClick={() => setActiveTab('payroll')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'payroll' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Payroll
                    </button>
                    <button
                        onClick={() => setActiveTab('leave')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'leave' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Leave Requests <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">2</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* DIRECTORY TAB */}
                {activeTab === 'directory' && (
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search by name, role, or ID..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <select className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm">
                                <option>All Departments</option>
                                <option>Computer Science</option>
                                <option>Electronics</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_EMPLOYEES.map(emp => (
                                <div key={emp.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                    <img src={emp.avatar} alt={emp.name} className="w-12 h-12 rounded-full" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900">{emp.name}</h3>
                                            <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                                        </div>
                                        <p className="text-indigo-600 text-sm font-medium">{emp.role}</p>
                                        <p className="text-gray-500 text-xs mb-3">{emp.department}</p>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Mail className="w-3 h-3" /> {emp.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                                <Phone className="w-3 h-3" /> {emp.phone}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {emp.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PAYROLL TAB */}
                {activeTab === 'payroll' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                    <th className="p-4">Employee</th>
                                    <th className="p-4">Basic Pay</th>
                                    <th className="p-4">Allowances</th>
                                    <th className="p-4">Deductions</th>
                                    <th className="p-4 font-bold text-gray-800">Net Salary</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_PAYROLL.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium">{p.employee}</td>
                                        <td className="p-4">₹{p.basic.toLocaleString()}</td>
                                        <td className="p-4 text-green-600">+₹{p.allowances.toLocaleString()}</td>
                                        <td className="p-4 text-red-600">-₹{p.deductions.toLocaleString()}</td>
                                        <td className="p-4 font-bold text-gray-900">₹{p.net.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium border border-indigo-200 px-3 py-1 rounded flex items-center gap-1">
                                                <FileText className="w-3 h-3" /> Slip
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* LEAVE TAB */}
                {activeTab === 'leave' && (
                    <div className="space-y-4 max-w-4xl">
                        {MOCK_LEAVE_REQUESTS.map(req => (
                            <div key={req.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{req.employee}</h4>
                                        <p className="text-sm text-gray-500">{req.type} • <span className="font-medium text-gray-800">{req.dates}</span></p>
                                        <p className="text-xs text-gray-400 mt-1">Reason: "{req.reason}"</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {req.status === 'Pending' ? (
                                        <>
                                            <button className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                                                <CheckCircle className="w-4 h-4" /> Approve
                                            </button>
                                            <button className="flex items-center gap-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                        </>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                            Approved
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
