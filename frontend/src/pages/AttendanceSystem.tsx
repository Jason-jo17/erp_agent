import { useState } from 'react';
import {
    CalendarCheck, Clock, Check, X,
    BarChart2, Search, Filter, Download
} from 'lucide-react';

const MOCK_ATTENDANCE_DATA = [
    { id: '1', name: 'Rahul Sharma', usn: '1RV23CS001', status: 'Present', arrival: '08:55 AM' },
    { id: '2', name: 'Priya Patel', usn: '1RV23CS002', status: 'Present', arrival: '08:58 AM' },
    { id: '3', name: 'Amit Kumar', usn: '1RV23CS003', status: 'Absent', arrival: '-' },
    { id: '4', name: 'Sneha Gupta', usn: '1RV23CS004', status: 'Late', arrival: '09:15 AM' },
    { id: '5', name: 'Vikram Singh', usn: '1RV23CS005', status: 'Present', arrival: '09:00 AM' },
];

export const AttendanceSystem = () => {
    const [view, setView] = useState<'student' | 'staff'>('student');

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <CalendarCheck className="w-6 h-6 text-indigo-600" />
                            Attendance System
                        </h1>
                        <p className="text-sm text-gray-500">Track and manage daily attendance.</p>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setView('student')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Student
                        </button>
                        <button
                            onClick={() => setView('staff')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'staff' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Staff
                        </button>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Present Today</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">1,245 <span className="text-sm font-normal text-gray-400">/ 1,350</span></h3>
                        </div>
                        <div className="p-2 bg-green-50 rounded-lg"><Check className="w-5 h-5 text-green-600" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Absent</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">85</h3>
                        </div>
                        <div className="p-2 bg-red-50 rounded-lg"><X className="w-5 h-5 text-red-600" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Late Arrival</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">20</h3>
                        </div>
                        <div className="p-2 bg-yellow-50 rounded-lg"><Clock className="w-5 h-5 text-yellow-600" /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Avg Attendance</p>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">92%</h3>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg"><BarChart2 className="w-5 h-5 text-indigo-600" /></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* ACTION BAR */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search by name or ID..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <select className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm">
                        <option>Today: 18 Dec 2025</option>
                        <option>Yesterday</option>
                    </select>
                    <select className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm">
                        <option>Computer Science</option>
                        <option>Electronics</option>
                    </select>
                    <select className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm">
                        <option>Sem 3 - Sec A</option>
                        <option>Sem 5 - Sec B</option>
                    </select>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-700">
                        <Download className="w-4 h-4" /> Report
                    </button>
                </div>

                {/* LIST */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                            <tr>
                                <th className="p-4 w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">USN / ID</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Arrival Time</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_ATTENDANCE_DATA.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="p-4"><input type="checkbox" className="rounded border-gray-300" /></td>
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                                        {row.name}
                                    </td>
                                    <td className="p-4 font-mono text-gray-500">{row.usn}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Present' ? 'bg-green-100 text-green-700' :
                                            row.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 font-medium">{row.arrival}</td>
                                    <td className="p-4">
                                        <button className="text-indigo-600 text-xs font-medium hover:underline">Mark Excuse</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
