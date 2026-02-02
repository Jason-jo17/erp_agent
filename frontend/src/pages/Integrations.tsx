import { useState } from 'react';
import { Database, Server, RefreshCw, CheckCircle, XCircle, Shield, Activity } from 'lucide-react';

export const IntegrationsPage = () => {
    const [connectors, setConnectors] = useState([
        { id: 'sap', name: 'SAP S/4HANA Finance', type: 'ERP', status: 'connected', lastSync: '10 mins ago' },
        { id: 'oracle', name: 'Oracle PeopleSoft', type: 'HRMS', status: 'disconnected', lastSync: '2 days ago' },
        { id: 'mysql', name: 'Legacy Student DB (MySQL)', type: 'Database', status: 'connected', lastSync: '1 min ago' },
        { id: 'blackboard', name: 'Blackboard LMS', type: 'LMS', status: 'connected', lastSync: '5 mins ago' }
    ]);

    const [syncing, setSyncing] = useState<string | null>(null);

    const handleSync = (id: string) => {
        setSyncing(id);
        setTimeout(() => {
            setConnectors(prev => prev.map(c =>
                c.id === id ? { ...c, lastSync: 'Just now', status: 'connected' } : c
            ));
            setSyncing(null);
        }, 1500);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Server className="w-8 h-8 text-blue-600" />
                    Data Integrations
                </h1>
                <p className="text-gray-500 mt-2">Manage external connections to ERPs, Databases, and LMS systems.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {connectors.map(connector => (
                    <div key={connector.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${connector.status === 'connected' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{connector.name}</h3>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{connector.type}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full ${connector.status === 'connected' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    {connector.status === 'connected' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {connector.status.toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-gray-500 border-t pt-3">
                                <span>Last Synchronized</span>
                                <span className="font-mono">{connector.lastSync}</span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSync(connector.id)}
                                    disabled={!!syncing}
                                    className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    {syncing === connector.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    {syncing === connector.id ? 'Syncing...' : 'Sync Data'}
                                </button>
                                <button className="px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100">
                                    <Shield className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Activity className="w-8 h-8 text-blue-600" />
                    <div>
                        <h4 className="font-bold text-blue-900">Total Records Synced</h4>
                        <p className="text-sm text-blue-700">1,240,592 records processed in the last 24 hours.</p>
                    </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30">
                    View Logs
                </button>
            </div>
        </div>
    );
};
