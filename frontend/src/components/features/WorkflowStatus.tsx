import { API_BASE_URL } from '../../config/api';
import React, { useEffect, useState } from 'react';
import { PlayCircle } from 'lucide-react';

interface Workflow {
    workflow_id: string;
    workflow_name: string;
    status: string;
    current_step: number;
    total_steps: number;
    initiator: string;
}

export const WorkflowStatus: React.FC = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);

    useEffect(() => {
        fetchWorkflows();
        // Poll every 5s
        const interval = setInterval(fetchWorkflows, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchWorkflows = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/workflows/active`);
            if (res.ok) {
                const data = await res.json();
                setWorkflows(data.workflows);
            }
        } catch (e) {
            console.error("Failed to fetch workflows", e);
        }
    };

    if (workflows.length === 0) return null; // Hide if empty

    return (
        <div className="fixed bottom-4 left-20 z-40 flex flex-col gap-2 animate-in slide-in-from-bottom-5">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[280px]">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <PlayCircle className="w-3 h-3" /> Active Workflows ({workflows.length})
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {workflows.map(wf => (
                        <div key={wf.workflow_id} className="bg-gray-50 rounded p-2 border border-gray-100">
                            <div className="flex justify-between items-start">
                                <span className="text-xs font-semibold text-gray-700 block">{wf.workflow_name}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${wf.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        wf.status === 'waiting_approval' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                    }`}>
                                    {wf.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(wf.current_step / wf.total_steps) * 100}%` }}
                                    />
                                </div>
                                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                                    Step {wf.current_step}/{wf.total_steps}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
