import { useState } from 'react';
import { Search, Filter, MoreVertical, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock Data for "Student Database"
const STUDENTS = [
    { id: 'CS101', name: 'Rahul Sharma', roll: '21CS001', gpa: 8.5, attendance: 92, status: 'Good' },
    { id: 'CS102', name: 'Priya Patel', roll: '21CS002', gpa: 9.1, attendance: 96, status: 'Good' },
    { id: 'CS103', name: 'Amit Singh', roll: '21CS003', gpa: 5.2, attendance: 65, status: 'At Risk' },
    { id: 'CS104', name: 'Sneha Gupta', roll: '21CS004', gpa: 7.8, attendance: 85, status: 'Average' },
    { id: 'CS105', name: 'Vikram Malhotra', roll: '21CS005', gpa: 4.5, attendance: 45, status: 'At Risk' },
    { id: 'CS106', name: 'Anjali Devi', roll: '21CS006', gpa: 8.9, attendance: 94, status: 'Good' },
];

export const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 bg-gray-50 h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Student Database</h1>
                    <p className="text-gray-500 text-sm">Manage student records, performanc,e and risk analysis.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 shadow-sm">
                        + Add Student
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-auto">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or roll number..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-100 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4">Roll No</th>
                                <th className="px-6 py-4">GPA</th>
                                <th className="px-6 py-4">Attendance</th>
                                <th className="px-6 py-4">Risk Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4">{student.roll}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md font-bold ${student.gpa < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                            {student.gpa}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{student.attendance}%</td>
                                    <td className="px-6 py-4">
                                        {student.status === 'At Risk' ? (
                                            <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit">
                                                <AlertTriangle className="w-3.5 h-3.5" />
                                                <span className="text-xs font-semibold">At Risk</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                <span className="text-xs font-semibold">Good Standing</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-primary-600 transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredStudents.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            No students found matching "{searchTerm}"
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
