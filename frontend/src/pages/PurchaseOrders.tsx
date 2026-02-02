
import {
    ShoppingBag, Truck, DollarSign, FileText,
    Search, Plus, MoreVertical
} from 'lucide-react';

const MOCK_POS = [
    { id: 'PO-2025-001', item: 'Dell Optiplex Desktops (20 Units)', vendor: 'Dell India Pvt Ltd', amount: 1200000, date: '15 Dec 2025', status: 'Approved', requester: 'CS Dept' },
    { id: 'PO-2025-002', item: 'Lab Equipment - Oscilloscopes', vendor: 'Tektronix', amount: 450000, date: '16 Dec 2025', status: 'Pending', requester: 'ECE Dept' },
    { id: 'PO-2025-003', item: 'Library Books - Semester 4', vendor: 'Sapna Book House', amount: 85000, date: '18 Dec 2025', status: 'Fulfilled', requester: 'Library' },
];

export const PurchaseOrders = () => {
    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-indigo-600" />
                        Purchase Orders
                    </h1>
                    <p className="text-sm text-gray-500">Procurement tracking and vendor management.</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> New PO Request
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Pending Approvals</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">5</h3>
                            </div>
                            <div className="p-2 bg-yellow-50 rounded-lg">
                                <FileText className="w-5 h-5 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Active Orders</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">12</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Monthly Spend</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹18.5 L</h3>
                            </div>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Recent Purchase Orders</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search POs..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                <th className="p-4">PO Number</th>
                                <th className="p-4">Item Details</th>
                                <th className="p-4">Vendor</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_POS.map(po => (
                                <tr key={po.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-indigo-600 font-medium">{po.id}</td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-900">{po.item}</div>
                                        <div className="text-xs text-gray-500">Req: {po.requester}</div>
                                    </td>
                                    <td className="p-4 text-gray-600">{po.vendor}</td>
                                    <td className="p-4 font-bold">₹{po.amount.toLocaleString()}</td>
                                    <td className="p-4 text-gray-500">{po.date}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${po.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                            po.status === 'Fulfilled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {po.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-4 h-4" /></button>
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
