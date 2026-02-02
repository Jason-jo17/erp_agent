import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Award, ShieldCheck, CheckCircle, AlertTriangle,
    BookOpen, BarChart3, Globe, TrendingUp, FileText, Calendar,
    ChevronRight, ExternalLink
} from 'lucide-react';

interface DashboardData {
    overall_status: {
        binary_accreditation: string;
        mbgl_level: number;
        valid_until: string;
        days_to_expiry: number;
    };
    washington_accord: {
        compliant: boolean;
        avg_po_attainment: number;
        pos_above_threshold: number;
        pos_total: number;
    };
    program_status: Array<{
        program: string;
        accredited: boolean;
        level: number;
        po_attainment: number;
        expiry: string;
        alert: string;
    }>;
    alerts: Array<{
        priority: string;
        message: string;
        action: string;
    }>;
}

// Mock initial state to prevent flash before fetch
const initialData: DashboardData = {
    overall_status: { binary_accreditation: 'Loading...', mbgl_level: 0, valid_until: '-', days_to_expiry: 0 },
    washington_accord: { compliant: false, avg_po_attainment: 0, pos_above_threshold: 0, pos_total: 12 },
    program_status: [],
    alerts: []
};

export const AccreditationDashboard = () => {
    const [data, setData] = useState<DashboardData>(initialData);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // ...
        fetch(`${API_BASE_URL}/api/v1/accreditation/dashboard`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch accreditation data", err);
                // In case of error, we can either leave initialData (loading) or set some fallback
                // For now, let's keep initialData but stop loading to show "empty" or default view
                // OR ideally we should have an error state. 
                // But for this quick fix, just ensuring loading stops.
                setLoading(false);
            });
    }, []);

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'sar':
                navigate('/reports/builder?template=NBA_Self_Assessment_Report');
                break;
            case 'po_attainment':
                navigate('/reports/builder?template=Student_Performance_Report');
                break;
            case 'gap_analysis':
                // Navigate to Chat with Auto-Send
                navigate('/', {
                    state: {
                        autoSend: "Analyze gaps in PO attainment for B.Tech CSE and suggest corrective actions."
                    }
                });
                break;
            case 'audit_pack':
                navigate('/', {
                    state: {
                        autoSend: "Prepare a digital audit package for B.Tech MECH for NAC Level 3 compliance."
                    }
                });
                break;
            case 'timeline':
                alert("Renewal Timeline: \n- B.Tech MECH (Due in 180 Days)\n- B.Tech CSE (Due in 2 Years)");
                break;
            default:
                break;
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Accreditation Data...</div>;

    return (
        <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
            {/* ... Header ... */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 shadow-sm">
                {/* ... (Header content same as before) ... */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <Award className="w-8 h-8 text-yellow-400" />
                            Accreditation Status Dashboard
                        </h1>
                        <p className="text-blue-200 mt-1">Real-time compliance monitoring: Washington Accord & NAC (VBSAB Framework)</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-blue-300 mb-1">Overall Status</div>
                        <div className="text-2xl font-bold flex items-center justify-end gap-2">
                            {data.overall_status.binary_accreditation.toUpperCase()}
                            <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-sm bg-blue-800/50 px-2 py-1 rounded inline-block mt-1">
                            Level {data.overall_status.mbgl_level} - Established
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
                {/* ... (Metrics Rows) ... */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Washington Accord Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden group hover:border-blue-300 transition-all">
                        {/* ... content ... */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Globe className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-800">Washington Accord</h3>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{data.washington_accord.avg_po_attainment}%</div>
                                    <div className="text-xs text-gray-500 mt-1">Avg. PO Attainment</div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-medium ${data.washington_accord.compliant ? 'text-green-600' : 'text-red-500'}`}>
                                        {data.washington_accord.compliant ? 'Compliant' : 'Non-Compliant'}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {data.washington_accord.pos_above_threshold}/{data.washington_accord.pos_total} POs &gt; 60%
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${data.washington_accord.avg_po_attainment}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Expiry / Renewal Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden group hover:border-orange-300 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <Calendar className="w-5 h-5 text-orange-600" />
                                <h3 className="font-semibold text-gray-800">Renewal Status</h3>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">{data.overall_status.days_to_expiry}</div>
                                    <div className="text-xs text-gray-500 mt-1">Days Remaining</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-gray-600">Valid Until</div>
                                    <div className="text-xs text-gray-400">{data.overall_status.valid_until}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleQuickAction('timeline')}
                                className="mt-4 w-full py-1.5 text-xs font-semibold text-orange-700 bg-orange-50 rounded border border-orange-100 hover:bg-orange-100 transition-colors"
                            >
                                View Renewal Timeline
                            </button>
                        </div>
                    </div>

                    {/* Alerts Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 relative overflow-hidden group hover:border-red-300 transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <h3 className="font-semibold text-gray-800">Active Alerts</h3>
                            </div>
                            <div className="flex-1 space-y-3">
                                {data.alerts.map((alert, idx) => (
                                    <div key={idx} className="flex gap-3 items-start p-2 bg-red-50/50 rounded-lg border border-red-100">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${alert.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                        <div>
                                            <p className="text-xs font-medium text-gray-800 leading-tight">{alert.message}</p>
                                            <button
                                                onClick={() => navigate('/', { state: { autoSend: `Help me with this alert: ${alert.message}` } })}
                                                className="text-[10px] text-red-600 font-bold mt-1 hover:underline"
                                            >
                                                ACTION: {alert.action}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                    {/* Left: Program Status Table */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800">Program-wise Status</h3>
                            <button
                                onClick={() => navigate('/reports/builder')}
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                            >
                                Full Report <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-5 py-3">Program</th>
                                        <th className="px-5 py-3">Level (MBGL)</th>
                                        <th className="px-5 py-3">PO Attainment</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.program_status.map((prog, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-4 font-medium text-gray-800">{prog.program}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${prog.level >= 4 ? 'bg-purple-100 text-purple-800' :
                                                    prog.level === 3 ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    Level {prog.level}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 w-16 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${prog.po_attainment >= 60 ? 'bg-green-500' : 'bg-red-500'}`}
                                                            style={{ width: `${prog.po_attainment}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-600">{prog.po_attainment}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${prog.alert === 'green' ? 'bg-green-500' : prog.alert === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                    <span className="text-gray-600">{prog.alert === 'green' ? 'Good' : 'Needs Attention'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => navigate('/', { state: { autoSend: `Status of ${prog.program}` } })}
                                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Quick Actions / Cross Council */}
                    <div className="space-y-6">
                        {/* Cross Council Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                Regulatory Compliance
                            </h3>
                            <div className="space-y-3">
                                {/* ... Compliance Items (Static for now) ... */}
                                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50 border border-green-100">
                                    <div className="text-sm font-medium text-green-900">NHERC</div>
                                    <span className="text-xs bg-white px-2 py-0.5 rounded border border-green-200 text-green-700 font-bold">Approved</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-100">
                                    <div className="text-sm font-medium text-blue-900">NAC (MBGL)</div>
                                    <span className="text-xs bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-700 font-bold">Level 3</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50 border border-purple-100">
                                    <div className="text-sm font-medium text-purple-900">HEGC Grants</div>
                                    <span className="text-xs bg-white px-2 py-0.5 rounded border border-purple-200 text-purple-700 font-bold">Eligible</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Reports */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-600" />
                                Generate Reports
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleQuickAction('sar')}
                                    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                                >
                                    <BookOpen className="w-6 h-6 text-indigo-500 mb-2" />
                                    <span className="text-xs font-medium text-gray-700">SAR Generator</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction('po_attainment')}
                                    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                                >
                                    <BarChart3 className="w-6 h-6 text-green-500 mb-2" />
                                    <span className="text-xs font-medium text-gray-700">PO Attainment</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction('gap_analysis')}
                                    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                                >
                                    <TrendingUp className="w-6 h-6 text-orange-500 mb-2" />
                                    <span className="text-xs font-medium text-gray-700">Gap Analysis</span>
                                </button>
                                <button
                                    onClick={() => handleQuickAction('audit_pack')}
                                    className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all text-center"
                                >
                                    <ShieldCheck className="w-6 h-6 text-blue-500 mb-2" />
                                    <span className="text-xs font-medium text-gray-700">Audit Pack</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
