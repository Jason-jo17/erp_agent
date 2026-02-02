import { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, FileText,
    DollarSign, Calendar, User, Filter
} from 'lucide-react';

interface ApprovalItem {
    id: string;
    type: 'Budget' | 'Leave' | 'Purchase' | 'Grade' | 'Event' | 'Task';
    title: string;
    requester: string;
    date: string;
    amount?: string;
    status: 'pending' | 'approved' | 'rejected';
    priority: 'high' | 'medium' | 'low';
    description: string;
}

export const ApprovalsPage = () => {
    const [activeTab, setActiveTab] = useState<'inbox' | 'outbox' | 'track' | 'history'>('inbox');
    const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
    const [items, setItems] = useState<ApprovalItem[]>([]);

    // Get Role
    const user = JSON.parse(localStorage.getItem('erp_user') || '{}');
    const role = (user.role || 'guest').toLowerCase();

    useEffect(() => {
        // Mock Data Generation based on Role
        const generateData = () => {
            const incoming: ApprovalItem[] = [];
            const outgoing: ApprovalItem[] = []; // Requests made BY the user
            const tracked: ApprovalItem[] = [];  // Tasks assigned BY the user to OTHERS

            // 1. PRINCIPAL / ADMIN
            if (['principal', 'admin', 'orchestrator', 'accreditation_manager'].includes(role)) {
                incoming.push(
                    { id: '1', type: 'Budget', title: 'CSE Dept Annual Budget', requester: 'Dr. Sarah (HOD CSE)', date: '2024-12-15', amount: '₹12,00,000', status: 'pending', priority: 'high', description: 'Annual allocation for lab upgrades and research grants.' },
                    { id: '2', type: 'Leave', title: 'Medical Leave Request', requester: 'Prof. John Doe', date: '2024-12-16', status: 'pending', priority: 'medium', description: 'Recovering from surgery. 2 weeks requested.' },
                    { id: '3', type: 'Event', title: 'Tech Fest 2024 Approval', requester: 'Student Council', date: '2024-12-14', amount: '₹2,50,000', status: 'pending', priority: 'medium', description: 'Budget and venue approval for annual tech fest.' },
                    { id: '4', type: 'Purchase', title: 'New Server Rack', requester: 'IT Admin', date: '2024-12-10', amount: '₹4,00,000', status: 'pending', priority: 'low', description: 'Replacement for server room rack 3.' }
                );

                // Tasks assigned by Principal/Admin
                tracked.push(
                    { id: 't1', type: 'Task', title: 'Prepare SAR Report', requester: 'Assigned to: HOD CSE', date: 'Due: 2024-12-30', status: 'pending', priority: 'high', description: 'Complete the Criterion 1-4 for Washington Accord compliance.' },
                    { id: 't2', type: 'Task', title: 'Audit Finance Records', requester: 'Assigned to: Finance Officer', date: 'Due: 2024-12-25', status: 'approved', priority: 'medium', description: 'Verify Q3 expenditure for HEGC audit.' },
                    { id: 't3', type: 'Task', title: 'Update Faculty Profiles', requester: 'Assigned to: All HODs', date: 'Due: 2024-12-20', status: 'pending', priority: 'medium', description: 'Ensure PhD details are updated for NIRF ranking.' }
                );
            }
            // 2. FINANCE
            else if (role === 'finance') {
                incoming.push(
                    { id: '10', type: 'Budget', title: 'CSE Lab Equipment', requester: 'HOD CSE', date: '2024-12-10', amount: '₹5,00,000', status: 'pending', priority: 'high', description: 'Quote verification pending.' },
                    { id: '11', type: 'Purchase', title: 'Library Books PO', requester: 'Librarian', date: '2024-12-12', amount: '₹1,20,000', status: 'pending', priority: 'medium', description: 'Annual book procurement invoice.' }
                );
            }
            // 3. HOD
            else if (role === 'hod') {
                incoming.push(
                    { id: '20', type: 'Leave', title: 'Casual Leave', requester: 'Asst. Prof. Jane', date: '2024-12-17', status: 'pending', priority: 'low', description: 'Personal work.' },
                    { id: '21', type: 'Event', title: 'Workshop on AI', requester: 'AI Club Faculty', date: '2024-12-15', amount: '₹15,000', status: 'pending', priority: 'medium', description: 'One day workshop guest speaker honorarium.' },
                    { id: 't1', type: 'Task', title: 'Prepare SAR Report', requester: 'From: Principal', date: 'Due: 2024-12-30', status: 'pending', priority: 'high', description: 'Complete the Criterion 1-4 for Washington Accord compliance.' }
                );
                outgoing.push(
                    { id: '22', type: 'Budget', title: 'Dept Annual Budget', requester: 'Me', date: '2024-12-01', amount: '₹12,00,000', status: 'pending', priority: 'high', description: 'Submitted to Principal.' }
                );
                tracked.push(
                    { id: 't10', type: 'Task', title: 'Submit Course Files', requester: 'Assigned to: Faculty', date: 'Due: 2024-12-22', status: 'pending', priority: 'medium', description: 'Upload all course files for current semester.' }
                )
            }
            // 4. FACULTY
            else if (role === 'faculty') {
                outgoing.push(
                    { id: '30', type: 'Leave', title: 'Conference Leave', requester: 'Me', date: '2024-12-10', status: 'approved', priority: 'medium', description: 'IEEE Conference presentation.' },
                    { id: '31', type: 'Purchase', title: 'Laptop Repair', requester: 'Me', date: '2024-12-15', amount: '₹5,000', status: 'pending', priority: 'low', description: 'Screen replacement reimbursement.' }
                );
                incoming.push(
                    { id: 't10', type: 'Task', title: 'Submit Course Files', requester: 'From: HOD', date: 'Due: 2024-12-22', status: 'pending', priority: 'medium', description: 'Upload all course files for current semester.' }
                );
            }
            // 5. TPO
            else if (role === 'tpo') {
                outgoing.push(
                    { id: '40', type: 'Event', title: 'Placement Drive Logistics', requester: 'Me', date: '2024-12-20', amount: '₹50,000', status: 'pending', priority: 'high', description: 'Arrangements for TCS drive.' }
                );
            }

            // Fill based on tab
            if (activeTab === 'outbox') setItems(outgoing);
            else if (activeTab === 'track') setItems(tracked);
            else setItems(incoming);
        };

        generateData();
    }, [role, activeTab]);

    const handleAction = (id: string, action: 'approve' | 'reject') => {
        setItems(prev => prev.filter(i => i.id !== id));
        // Show notification or visual feedback
        alert(`${action === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
        setSelectedItem(null);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Approvals & Assignments
                    </h1>
                    <p className="text-sm text-gray-500">Manage pending approvals and track assigned tasks.</p>
                </div>

                <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                    {(['inbox', 'outbox', 'track', 'history'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setSelectedItem(null); }}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab
                                ? 'bg-blue-100 text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'track' ? 'Track Tasks' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* List View */}
                <div className={`bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${selectedItem ? 'w-1/2' : 'w-full'}`}>
                    {/* Filter Bar */}
                    <div className="p-4 border-b border-gray-100 flex gap-2">
                        <div className="relative flex-1">
                            <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
                            <Filter className="w-4 h-4 absolute left-2.5 top-2.5 text-gray-400" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10">
                                <CheckCircle className="w-12 h-12 mb-2 opacity-20" />
                                <p>No items in {activeTab}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedItem(item)}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${selectedItem?.id === item.id ? 'bg-blue-50 border-blue-500' :
                                            item.priority === 'high' ? 'border-red-400' : 'border-transparent'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.type === 'Budget' ? 'bg-green-100 text-green-700' :
                                                item.type === 'Leave' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {item.date}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <User className="w-3 h-3" />
                                            {item.requester}
                                            {item.amount && (
                                                <span className="flex items-center gap-1 ml-3 font-medium text-gray-700">
                                                    <DollarSign className="w-3 h-3" />
                                                    {item.amount}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail View */}
                {selectedItem && (
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                    Requested by <span className="font-medium text-gray-900">{selectedItem.requester}</span>
                                    on {selectedItem.date}
                                </p>
                            </div>
                            <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1 p-4 bg-blue-50 rounded-lg border border-blue-100">
                                    <span className="text-xs text-blue-500 uppercase font-bold tracking-wider">Amount</span>
                                    <p className="text-lg font-bold text-blue-700 mt-1">{selectedItem.amount || 'N/A'}</p>
                                </div>
                                <div className="flex-1 p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <span className="text-xs text-purple-500 uppercase font-bold tracking-wider">Priority</span>
                                    <p className="text-lg font-bold text-purple-700 mt-1 capitalize">{selectedItem.priority}</p>
                                </div>
                                <div className="flex-1 p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <span className="text-xs text-orange-500 uppercase font-bold tracking-wider">Status</span>
                                    <p className="text-lg font-bold text-orange-700 mt-1 capitalize">{selectedItem.status}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Description / Reason</h3>
                                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {selectedItem.description}
                                </p>
                            </div>

                            {/* Attachments Placeholder */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-2">Attachments</h3>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 cursor-pointer hover:border-blue-300">
                                        <FileText className="w-4 h-4" />
                                        Invoice.pdf
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-blue-600 cursor-pointer hover:border-blue-300">
                                        <FileText className="w-4 h-4" />
                                        Justification_Note.docx
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        {activeTab === 'inbox' && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4">
                                <button
                                    onClick={() => handleAction(selectedItem.id, 'reject')}
                                    className="flex-1 py-2.5 border border-red-200 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                                >
                                    Reject Request
                                </button>
                                <button
                                    onClick={() => handleAction(selectedItem.id, 'approve')}
                                    className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 shadow-sm transition-all"
                                >
                                    Approve Request
                                </button>
                            </div>
                        )}
                        {activeTab === 'outbox' && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button className="text-gray-500 text-sm hover:text-gray-700 font-medium">
                                    Withdraw Request
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
