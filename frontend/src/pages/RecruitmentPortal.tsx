import { useState } from 'react';
import {
    Briefcase, Users, UserPlus, CheckCircle, Clock,
    Calendar, MessageSquare
} from 'lucide-react';

const MOCK_JOBS = [
    { id: '1', title: 'Assistant Professor - CSE', department: 'Computer Science', type: 'Full-time', applicants: 45, status: 'Active' },
    { id: '2', title: 'Lab Instructor - ECE', department: 'Electronics', type: 'Contract', applicants: 12, status: 'Active' },
    { id: '3', title: 'Library Assistant', department: 'Library', type: 'Full-time', applicants: 8, status: 'Closed' },
];

const MOCK_CANDIDATES = [
    { id: '1', name: 'Dr. Anjali Gupta', role: 'Assistant Professor - CSE', stage: 'Interview', date: '2025-12-20', rating: '4.5/5' },
    { id: '2', name: 'Mr. David Lee', role: 'Lab Instructor - ECE', stage: 'Review', date: '2025-12-19', rating: '-' },
    { id: '3', name: 'Ms. Sarah Connor', role: 'Assistant Professor - CSE', stage: 'Applied', date: '2025-12-18', rating: '-' },
];

export const RecruitmentPortal = () => {
    const [activeTab, setActiveTab] = useState<'jobs' | 'candidates'>('jobs');

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserPlus className="w-6 h-6 text-indigo-600" />
                        Recruitment Portal
                    </h1>
                    <p className="text-sm text-gray-500">Manage hiring pipeline and job postings.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'jobs' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Job Postings
                        </button>
                        <button
                            onClick={() => setActiveTab('candidates')}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'candidates' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Candidates
                        </button>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Post Job
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'jobs' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {MOCK_JOBS.map(job => (
                            <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Briefcase className="w-24 h-24 text-indigo-600" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {job.status}
                                        </span>
                                        <button className="text-gray-400 hover:text-indigo-600 text-xs font-medium">Edit</button>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{job.department} • {job.type}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-bold text-gray-900">{job.applicants}</span> applicants
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            Posted 3d ago
                                        </div>
                                    </div>

                                    <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                                        View Applicants
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'candidates' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                <tr>
                                    <th className="p-4">Candidate</th>
                                    <th className="p-4">Applied Role</th>
                                    <th className="p-4">Stage</th>
                                    <th className="p-4">Activity Date</th>
                                    <th className="p-4">Rating</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_CANDIDATES.map(cand => (
                                    <tr key={cand.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {cand.name.charAt(0)}
                                            </div>
                                            {cand.name}
                                        </td>
                                        <td className="p-4 text-gray-600">{cand.role}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${cand.stage === 'Interview' ? 'bg-blue-100 text-blue-700' :
                                                cand.stage === 'Review' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {cand.stage}
                                            </span>
                                        </td>
                                        <td className="p-4 flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-3 h-3" /> {cand.date}
                                        </td>
                                        <td className="p-4 font-bold">{cand.rating}</td>
                                        <td className="p-4 flex gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600"><MessageSquare className="w-4 h-4" /></button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
