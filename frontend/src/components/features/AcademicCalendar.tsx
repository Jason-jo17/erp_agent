import { useState } from 'react';
import {
    Calendar as CalendarIcon,
    ChevronLeft, ChevronRight, Plus, X, Link as LinkIcon
} from 'lucide-react';
import { Card } from '../ui/Card';

interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    type: 'Exam' | 'Assignment' | 'Holiday' | 'Task';
    status: 'Pending' | 'Upcoming' | 'Completed';
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    dependencies?: string[]; // IDs of blocked tasks
    description?: string;
    team?: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
    { id: '1', title: 'Semester End Exams', date: '2025-12-20', type: 'Exam', team: 'Examination Cell', status: 'Upcoming', priority: 'High' },
    { id: '2', title: 'Budget Approval', date: '2025-12-22', type: 'Task', team: 'Finance Dept', status: 'Pending', priority: 'Critical' },
    { id: '3', title: 'Result Declaration', date: '2025-12-30', type: 'Task', team: 'Examination Cell', status: 'Pending', priority: 'High', dependencies: ['1'] },
    { id: '4', title: 'Faculty Hiring Drive', date: '2026-01-05', type: 'Task', team: 'HR', status: 'Pending', priority: 'Medium' },
];

export const AcademicCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Dec 2025
    const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({});

    // Calendar Grid Logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50/30 border border-gray-100"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);

            days.push(
                <div
                    key={day}
                    onClick={() => handleDayClick(dateStr)}
                    className="h-32 border border-gray-100 p-2 hover:bg-gray-50 transition-colors cursor-pointer relative group overflow-hidden"
                >
                    <span className={`text-sm font-semibold ${dateStr === new Date().toISOString().split('T')[0] ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-700'}`}>
                        {day}
                    </span>

                    {/* Event Markers */}
                    <div className="mt-2 space-y-1 overflow-y-auto max-h-[80px]">
                        {dayEvents.map(evt => (
                            <div key={evt.id} className={`text-[10px] p-1 rounded border truncate flex items-center gap-1 ${evt.type === 'Exam' ? 'bg-purple-50 border-purple-100 text-purple-700' :
                                evt.priority === 'Critical' ? 'bg-red-50 border-red-100 text-red-700' :
                                    'bg-blue-50 border-blue-100 text-blue-700'
                                }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${evt.status === 'Completed' ? 'bg-green-500' : 'bg-current'
                                    }`}></div>
                                {evt.title}
                                {evt.dependencies && evt.dependencies.length > 0 && (
                                    <LinkIcon className="w-2 h-2 ml-auto opacity-50" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add Button on Hover */}
                    <button className="absolute bottom-2 right-2 p-1 bg-indigo-100 text-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            );
        }
        return days;
    };

    const handleDayClick = (date: string) => {
        setSelectedDate(date);
        setNewEvent({ date, type: 'Task', priority: 'Medium', status: 'Pending' });
        setIsModalOpen(true);
    };

    const handleSaveEvent = () => {
        if (!newEvent.title || !selectedDate) return;

        const event: CalendarEvent = {
            id: Math.random().toString(36).substr(2, 9),
            title: newEvent.title,
            date: selectedDate,
            type: newEvent.type as any || 'Task',
            status: newEvent.status as any || 'Pending',
            priority: newEvent.priority as any || 'Medium',
            team: newEvent.team || 'General',
            dependencies: newEvent.dependencies || []
        };

        setEvents([...events, event]);
        setIsModalOpen(false);
    };

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-indigo-600" />
                        Academic Scheduler
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Plan events, exams, and clear dependencies.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-md"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                    <span className="text-lg font-bold text-gray-800 min-w-[150px] text-center">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-md"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                </div>
            </div>

            {/* Calendar Container */}
            <Card className="flex-1 p-0 overflow-hidden border border-gray-200 shadow-sm flex flex-col">
                {/* Weekday Header */}
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-3 text-center text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                {/* Grid */}
                <div className="grid grid-cols-7 bg-white flex-1 overflow-y-auto">
                    {renderCalendarGrid()}
                </div>
            </Card>

            {/* Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                            <h3 className="text-xl font-bold text-gray-800">Add New Event</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Physics Mid-Term"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newEvent.title || ''}
                                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newEvent.type}
                                        onChange={e => setNewEvent({ ...newEvent, type: e.target.value as any })}
                                    >
                                        <option value="Task">Task</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Assignment">Assignment</option>
                                        <option value="Holiday">Holiday</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newEvent.priority}
                                        onChange={e => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                                    >
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                        <option value="Critical">Critical</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Depends On (Optional)</label>
                                <p className="text-xs text-gray-500 mb-2">Select tasks that must be completed first.</p>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    multiple
                                    size={3}
                                    value={newEvent.dependencies || []}
                                    onChange={e => {
                                        const options = Array.from(e.target.selectedOptions, option => option.value);
                                        setNewEvent({ ...newEvent, dependencies: options });
                                    }}
                                >
                                    {events.filter(e => e.date <= (selectedDate || '')).map(e => (
                                        <option key={e.id} value={e.id}>{e.date}: {e.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEvent}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm"
                                >
                                    Create Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
