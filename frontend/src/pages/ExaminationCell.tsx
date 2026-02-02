import { useState } from 'react';
import {
    ClipboardList, Calendar, FileCheck, CheckCircle,
    Download, Plus, Clock, UserCheck
} from 'lucide-react';

type Tab = 'schedule' | 'results' | 'hall-tickets';

const MOCK_EXAM_SCHEDULE = [
    { id: '1', name: 'Engineering Mathematics III', code: 'MAT301', date: '2025-12-20', time: '10:00 AM - 01:00 PM', hall: 'Exam Hall A', status: 'Scheduled' },
    { id: '2', name: 'Data Structures', code: 'CS302', date: '2025-12-22', time: '10:00 AM - 01:00 PM', hall: 'Exam Hall B', status: 'Scheduled' },
    { id: '3', name: 'Digital Logic Design', code: 'EC303', date: '2025-12-24', time: '02:00 PM - 05:00 PM', hall: 'Lab Complex 1', status: 'Draft' },
];

const MOCK_RESULTS = [
    { id: '1', student: 'Rahul Sharma', usn: '1RV23CS001', subject: 'Data Structures', marks: 85, grade: 'A', status: 'Published' },
    { id: '2', student: 'Priya Patel', usn: '1RV23CS002', subject: 'Data Structures', marks: 92, grade: 'S', status: 'Published' },
    { id: '3', student: 'Amit Kumar', usn: '1RV23CS003', subject: 'Data Structures', marks: 45, grade: 'E', status: 'Published' },
];

export const ExaminationCell = () => {
    const [activeTab, setActiveTab] = useState<Tab>('schedule');

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <ClipboardList className="w-6 h-6 text-indigo-600" />
                            Examination Cell
                        </h1>
                        <p className="text-sm text-gray-500">Manage schedules, hall tickets, and results.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium text-sm flex items-center gap-2">
                            <Download className="w-4 h-4" /> Export Data
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Schedule Exam
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'schedule' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Exam Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('hall-tickets')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'hall-tickets' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Hall Tickets
                    </button>
                    <button
                        onClick={() => setActiveTab('results')}
                        className={`pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'results' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Results Processing
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* SCHEDULE TAB */}
                {activeTab === 'schedule' && (
                    <div className="space-y-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Upcoming Exams</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Centers Allocated</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">4</h3>
                                    </div>
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
                                    </div>
                                    <div className="p-2 bg-yellow-50 rounded-lg">
                                        <FileCheck className="w-5 h-5 text-yellow-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                        <th className="p-4">Subject Code</th>
                                        <th className="p-4">Subject Name</th>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Hall</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {MOCK_EXAM_SCHEDULE.map(exam => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-mono text-gray-600">{exam.code}</td>
                                            <td className="p-4 font-medium text-gray-900">{exam.name}</td>
                                            <td className="p-4">{exam.date}</td>
                                            <td className="p-4 flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-gray-400" /> {exam.time}
                                            </td>
                                            <td className="p-4">{exam.hall}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${exam.status === 'Scheduled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {exam.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* RESULTS TAB */}
                {activeTab === 'results' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
                            <input type="text" placeholder="Search USN..." className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white" />
                            <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                                <option>All Subjects</option>
                                <option>Data Structures</option>
                            </select>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                    <th className="p-4">USN</th>
                                    <th className="p-4">Student Name</th>
                                    <th className="p-4">Subject</th>
                                    <th className="p-4">Marks</th>
                                    <th className="p-4">Grade</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_RESULTS.map(res => (
                                    <tr key={res.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-mono text-gray-600">{res.usn}</td>
                                        <td className="p-4 font-medium">{res.student}</td>
                                        <td className="p-4">{res.subject}</td>
                                        <td className="p-4 font-bold">{res.marks}</td>
                                        <td className="p-4">
                                            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-xs ${res.grade === 'S' || res.grade === 'A' ? 'bg-green-100 text-green-700' :
                                                res.grade === 'F' || res.grade === 'E' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {res.grade}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">{res.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* HALL TICKETS TAB */}
                {activeTab === 'hall-tickets' && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                            <UserCheck className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-700">Hall Ticket Generator</h3>
                        <p className="text-sm mb-6">Select a semester and branch to generate tickets.</p>
                        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Generate Tickets</button>
                    </div>
                )}
            </div>
        </div>
    );
};
