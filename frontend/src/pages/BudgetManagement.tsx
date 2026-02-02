
import {
    DollarSign, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight,
    Download, Filter, Plus, Wallet
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface DepartmentBudget {
    id: string;
    department: string;
    allocated: number;
    utilized: number;
    remaining: number;
    status: 'On Track' | 'Critical' | 'Over Budget';
}

const MOCK_BUDGET_DATA: DepartmentBudget[] = [
    { id: '1', department: 'Computer Science', allocated: 5000000, utilized: 3200000, remaining: 1800000, status: 'On Track' },
    { id: '2', department: 'Electronics (ECE)', allocated: 4500000, utilized: 4100000, remaining: 400000, status: 'Critical' },
    { id: '3', department: 'Mechanical', allocated: 4000000, utilized: 2500000, remaining: 1500000, status: 'On Track' },
    { id: '4', department: 'Civil Engg', allocated: 3500000, utilized: 3600000, remaining: -100000, status: 'Over Budget' },
    { id: '5', department: 'Research & R&D', allocated: 6000000, utilized: 2000000, remaining: 4000000, status: 'On Track' },
];

export const BudgetManagement = () => {
    const totalAllocated = MOCK_BUDGET_DATA.reduce((acc, curr) => acc + curr.allocated, 0);
    const totalUtilized = MOCK_BUDGET_DATA.reduce((acc, curr) => acc + curr.utilized, 0);
    const totalRemaining = totalAllocated - totalUtilized;
    const utilizationPercentage = Math.round((totalUtilized / totalAllocated) * 100);

    const barChartData = {
        labels: MOCK_BUDGET_DATA.map(d => d.department),
        datasets: [
            {
                label: 'Allocated',
                data: MOCK_BUDGET_DATA.map(d => d.allocated),
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
            {
                label: 'Utilized',
                data: MOCK_BUDGET_DATA.map(d => d.utilized),
                backgroundColor: 'rgba(16, 185, 129, 0.5)', // Emerald
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value: any) => `₹${value / 100000}L`
                }
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-center sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-emerald-600" />
                        Budget Management
                    </h1>
                    <p className="text-sm text-gray-500">Track allocations, utilization, and financial health.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 text-sm font-medium">
                        <Plus className="w-4 h-4" /> New Allocation
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Allocated</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{(totalAllocated / 10000000).toFixed(2)} Cr</h3>
                            </div>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-green-600">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            <span className="font-medium">+12%</span>
                            <span className="text-gray-400 ml-1">vs last year</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Utilized</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{(totalUtilized / 10000000).toFixed(2)} Cr</h3>
                            </div>
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${utilizationPercentage}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{utilizationPercentage}% of budget used</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Remaining Funds</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{(totalRemaining / 100000).toFixed(1)} L</h3>
                            </div>
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <PieChart className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-gray-500">
                            Available for reallocation
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Critical Depts</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
                            </div>
                            <div className="p-2 bg-red-50 rounded-lg">
                                <ArrowDownRight className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                        <p className="text-xs text-red-500 mt-4 font-medium">Civil Engg, ECE nearing limit</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Departmental Utilization</h3>
                        <div className="h-80">
                            <Bar data={barChartData} options={chartOptions} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Expense Categories</h3>
                        <div className="h-64 flex items-center justify-center">
                            <Doughnut
                                data={{
                                    labels: ['Infrastructure', 'Salaries', 'R&D', 'Events', 'Others'],
                                    datasets: [{
                                        data: [35, 40, 15, 5, 5],
                                        backgroundColor: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#6b7280'],
                                        borderWidth: 0
                                    }]
                                }}
                                options={{ plugins: { legend: { position: 'bottom' } } }}
                            />
                        </div>
                    </div>
                </div>

                {/* Detailed Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">Budget Breakdown</h3>
                        <div className="relative">
                            <Filter className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input type="text" placeholder="Filter departments..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 uppercase tracking-wider font-medium">
                                <th className="p-4">Department</th>
                                <th className="p-4">Allocated (INR)</th>
                                <th className="p-4">Utilized (INR)</th>
                                <th className="p-4">Utilization %</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {MOCK_BUDGET_DATA.map((dept) => {
                                const pct = Math.round((dept.utilized / dept.allocated) * 100);
                                return (
                                    <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{dept.department}</td>
                                        <td className="p-4">₹{dept.allocated.toLocaleString()}</td>
                                        <td className="p-4">₹{dept.utilized.toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full ${pct > 100 ? 'bg-red-500' : pct > 80 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-500">{pct}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${dept.status === 'On Track' ? 'bg-green-100 text-green-700' :
                                                dept.status === 'Critical' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {dept.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Edit</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
