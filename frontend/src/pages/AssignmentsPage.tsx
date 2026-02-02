import { useState } from 'react';
import {
    BookOpen, Upload, FileText, Clock,
    Search, Filter, MoreVertical
} from 'lucide-react';

const MOCK_ASSIGNMENTS = [
    { id: '1', title: 'Data Structures Project', subject: 'CS302', dueDate: '2025-12-25', status: 'Pending', type: 'Project' },
    { id: '2', title: 'Calculus Quiz', subject: 'MAT301', dueDate: '2025-12-20', status: 'Submitted', type: 'Quiz' },
    { id: '3', title: 'Circuit Analysis Lab', subject: 'EC303', dueDate: '2025-12-18', status: 'Overdue', type: 'Lab Report' },
];

const MOCK_SUBMISSIONS = [
    { id: '1', student: 'Rahul Sharma', usn: '1RV23CS001', file: 'ds_project_rahul.pdf', submittedAt: 'Dec 18, 10:00 AM', status: 'Graded', score: '18/20' },
    { id: '2', student: 'Priya Patel', usn: '1RV23CS002', file: 'ds_project_priya.pdf', submittedAt: 'Dec 18, 11:30 AM', status: 'Pending Review', score: '-' },
];

export const AssignmentsPage = () => {
    const [role, setRole] = useState<'student' | 'faculty'>('student');

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        Assignments
                    </h1>
                    <p className="text-sm text-gray-500">Manage course work, submissions, and grading.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setRole('student')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Student View
                    </button>
                    <button
                        onClick={() => setRole('faculty')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${role === 'faculty' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Faculty View
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {role === 'student' ? (
                    <div className="space-y-6">
                        {/* Student View */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MOCK_ASSIGNMENTS.map(agn => (
                                <div key={agn.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${agn.type === 'Project' ? 'bg-purple-50 text-purple-600' :
                                            agn.type === 'Quiz' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                            }`}>
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${agn.status === 'Submitted' ? 'bg-green-100 text-green-700' :
                                            agn.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {agn.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-1">{agn.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{agn.subject}</p>

                                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Due {agn.dueDate}
                                        </div>
                                        {agn.status === 'Pending' && (
                                            <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                                                <Upload className="w-3 h-3" /> Submit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Faculty View */}
                        <div className="flex gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input type="text" placeholder="Search submissions..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
                                <Filter className="w-4 h-4" /> Filter
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-700">
                                Submissions for Data Structures Project
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                    <tr>
                                        <th className="p-4">Student</th>
                                        <th className="p-4">USN</th>
                                        <th className="p-4">File</th>
                                        <th className="p-4">Submitted At</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Score</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {MOCK_SUBMISSIONS.map(sub => (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium">{sub.student}</td>
                                            <td className="p-4 font-mono text-gray-500">{sub.usn}</td>
                                            <td className="p-4 flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                                                <FileText className="w-3 h-3" /> {sub.file}
                                            </td>
                                            <td className="p-4 text-gray-500">{sub.submittedAt}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${sub.status === 'Graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold">{sub.score}</td>
                                            <td className="p-4">
                                                <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
