import { Card } from '../components/ui/Card';
import { BookOpen, Users, Clock, Award } from 'lucide-react';

const courses = [
    { id: 'CS101', name: 'B.Tech Computer Science', duration: '4 Years', students: 480, hod: 'Dr. Sharma', code: 'CSE' },
    { id: 'EC201', name: 'B.Tech Electronics', duration: '4 Years', students: 420, hod: 'Dr. Reddy', code: 'ECE' },
    { id: 'ME301', name: 'B.Tech Mechanical', duration: '4 Years', students: 360, hod: 'Dr. Khan', code: 'ME' },
    { id: 'CV401', name: 'B.Tech Civil', duration: '4 Years', students: 240, hod: 'Dr. Rao', code: 'CE' },
    { id: 'MBA501', name: 'Master of Business Admin', duration: '2 Years', students: 120, hod: 'Dr. Gupta', code: 'MBA' },
    { id: 'AI601', name: 'M.Tech AI & Robotics', duration: '2 Years', students: 40, hod: 'Dr. Amin', code: 'AI' }
];

export const CoursesPage = () => {
    return (
        <div className="p-6 h-full overflow-y-auto bg-gray-50">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-8 h-8 text-primary-600" />
                    Academic Courses
                </h1>
                <p className="text-gray-500 mt-1">Manage curriculum, intake, and department allocations.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-blue-50 rounded-full mb-2"><BookOpen className="w-6 h-6 text-blue-600" /></div>
                    <h3 className="text-2xl font-bold">12</h3>
                    <p className="text-sm text-gray-500">Active Programs</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-green-50 rounded-full mb-2"><Users className="w-6 h-6 text-green-600" /></div>
                    <h3 className="text-2xl font-bold">2,450</h3>
                    <p className="text-sm text-gray-500">Total Enrollment</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-purple-50 rounded-full mb-2"><Clock className="w-6 h-6 text-purple-600" /></div>
                    <h3 className="text-2xl font-bold">Full Time</h3>
                    <p className="text-sm text-gray-500">Course Type</p>
                </Card>
                <Card className="p-4 flex flex-col items-center justify-center text-center">
                    <div className="p-3 bg-orange-50 rounded-full mb-2"><Award className="w-6 h-6 text-orange-600" /></div>
                    <h3 className="text-2xl font-bold">NAAC A+</h3>
                    <p className="text-sm text-gray-500">Accredited</p>
                </Card>
            </div>

            {/* Course List Table */}
            <Card className="overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-white">
                    <h3 className="font-semibold text-gray-800">Course Directory</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-xs border-b border-gray-200">
                            <tr>
                                <th className="p-4">Program Code</th>
                                <th className="p-4">Course Name</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Head of Dept</th>
                                <th className="p-4 text-right">Students</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-900">{course.code}</td>
                                    <td className="p-4">{course.name}</td>
                                    <td className="p-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">{course.duration}</span>
                                    </td>
                                    <td className="p-4">{course.hod}</td>
                                    <td className="p-4 text-right font-medium">{course.students}</td>
                                    <td className="p-4 text-center">
                                        <button className="text-primary-600 hover:underline hover:text-primary-800">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
