import React, { useState } from 'react';
import { Calendar, Filter, Plus, Users } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
    '09:00 - 10:00', '10:00 - 11:00', '11:00 - 11:15 (Break)',
    '11:15 - 12:15', '12:15 - 01:15', '01:15 - 02:00 (Lunch)',
    '02:00 - 03:00', '03:00 - 04:00'
];

// Mock Schedule Data mapped by Day index (0-5) and Slot index (0-7)
const MOCK_SCHEDULE: Record<string, { subject: string, faculty: string, type: 'Lecture' | 'Lab' | 'Break' | 'Lunch' }> = {
    '0-0': { subject: 'Data Structures', faculty: 'Dr. Sarah', type: 'Lecture' },
    '0-1': { subject: 'Mathematics III', faculty: 'Prof. John', type: 'Lecture' },
    '0-2': { subject: 'Break', faculty: '', type: 'Break' },
    '0-3': { subject: 'Digital Logic', faculty: 'Prof. Emily', type: 'Lecture' },
    '0-4': { subject: 'OS Lab', faculty: 'Dr. Alan', type: 'Lab' },
    '0-5': { subject: 'Lunch', faculty: '', type: 'Lunch' },
    '0-6': { subject: 'Operating Systems', faculty: 'Dr. Alan', type: 'Lecture' },

    '1-0': { subject: 'Mathematics III', faculty: 'Prof. John', type: 'Lecture' },
    '1-1': { subject: 'Digital Logic', faculty: 'Prof. Emily', type: 'Lecture' },
    '1-2': { subject: 'Break', faculty: '', type: 'Break' },
    '1-3': { subject: 'Data Structures', faculty: 'Dr. Sarah', type: 'Lecture' },
};

export const TimetableManagement = () => {
    const [selectedSem, setSelectedSem] = useState('Sem 3');
    const [selectedSection, setSelectedSection] = useState('A');

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-indigo-600" />
                        Timetable Management
                    </h1>
                    <p className="text-sm text-gray-500">Manage class schedules, faculty allocation, and room usage.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedSem}
                            onChange={(e) => setSelectedSem(e.target.value)}
                            className="text-sm bg-transparent border-none outline-none font-medium"
                        >
                            <option>Sem 1</option>
                            <option>Sem 3</option>
                            <option>Sem 5</option>
                            <option>Sem 7</option>
                        </select>
                        <span className="w-px h-4 bg-gray-300"></span>
                        <select
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="text-sm bg-transparent border-none outline-none font-medium"
                        >
                            <option>Section A</option>
                            <option>Section B</option>
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Class
                    </button>
                </div>
            </div>

            {/* Timetable Grid */}
            <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-[150px_repeat(8,1fr)] divide-x divide-gray-200">
                        {/* Header Row */}
                        <div className="bg-gray-50 p-4 font-bold text-gray-700 text-sm flex items-center justify-center border-b border-gray-200">
                            Day / Time
                        </div>
                        {TIME_SLOTS.map((time, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 text-center text-xs font-semibold text-gray-600 border-b border-gray-200 flex items-center justify-center h-16">
                                {time}
                            </div>
                        ))}

                        {/* Days Rows */}
                        {DAYS.map((day, dIdx) => (
                            <React.Fragment key={dIdx}>
                                <div className="bg-gray-50 p-4 font-medium text-gray-700 text-sm border-b border-gray-100 flex items-center justify-center">
                                    {day}
                                </div>
                                {TIME_SLOTS.map((_, tIdx) => {
                                    const session = MOCK_SCHEDULE[`${dIdx}-${tIdx}`];
                                    const isBreak = session?.type === 'Break' || session?.type === 'Lunch';

                                    return (
                                        <div key={tIdx} className={`p-2 border-b border-gray-100 min-h-[100px] relative group transition-colors ${isBreak ? 'bg-gray-50/50' : 'hover:bg-indigo-50/30'}`}>
                                            {session ? (
                                                isBreak ? (
                                                    <div className="h-full flex items-center justify-center text-xs text-gray-400 font-medium uppercase tracking-widest writing-vertical">
                                                        {session.subject}
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col justify-between p-1">
                                                        <div>
                                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${session.type === 'Lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                {session.type}
                                                            </span>
                                                            <p className="font-bold text-gray-800 text-sm mt-1 leading-tight">{session.subject}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                                            <Users className="w-3 h-3" />
                                                            {session.faculty}
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-400 hover:text-indigo-600 flex items-center justify-center">
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
