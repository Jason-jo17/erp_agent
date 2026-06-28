import { BarChart, Activity, Zap, Server } from 'lucide-react';

export const TokenDashboard = () => {
    return (
        <div className="p-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        LLM Token Usage Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Monitor API costs and token consumption across all agents.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <h3 className="font-semibold text-sm">Total Requests</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">1,245</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <BarChart className="w-4 h-4 text-purple-500" />
                        <h3 className="font-semibold text-sm">Prompt Tokens</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">452K</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <Server className="w-4 h-4 text-green-500" />
                        <h3 className="font-semibold text-sm">Completion Tokens</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">128K</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 text-gray-500 mb-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <h3 className="font-semibold text-sm">Est. Cost (USD)</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">$2.45</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Usage by Agent</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Agent</th>
                                <th className="px-6 py-3">Requests</th>
                                <th className="px-6 py-3">Total Tokens</th>
                                <th className="px-6 py-3">Avg Response Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Orchestrator</td>
                                <td className="px-6 py-4">845</td>
                                <td className="px-6 py-4">250K</td>
                                <td className="px-6 py-4">450ms</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Academic Agent</td>
                                <td className="px-6 py-4">210</td>
                                <td className="px-6 py-4">120K</td>
                                <td className="px-6 py-4">800ms</td>
                            </tr>
                            <tr className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">Finance Agent</td>
                                <td className="px-6 py-4">190</td>
                                <td className="px-6 py-4">210K</td>
                                <td className="px-6 py-4">950ms</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
