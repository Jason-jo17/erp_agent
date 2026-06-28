import { useState } from 'react';
import { PlayCircle, Settings, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const templates = [
    { id: 'leave_approval', name: 'Leave Approval', desc: 'Standard staff leave request workflow' },
    { id: 'student_intervention', name: 'Student Intervention', desc: 'At-risk student tracking and intervention' },
    { id: 'budget_request', name: 'Budget Request', desc: 'Departmental budget approval process' }
];

export const WorkflowTemplates = () => {
    const [starting, setStarting] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const startWorkflow = async (templateId: string) => {
        setStarting(templateId);
        setSuccess(null);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE_URL}/api/v1/workflows/start`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    workflow_template: templateId,
                    inputs: {},
                    initiator: 'system_admin'
                })
            });
            if (res.ok) {
                setSuccess(templateId);
                setTimeout(() => setSuccess(null), 3000);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setStarting(null);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="w-6 h-6 text-blue-600" />
                    Workflow Templates
                </h1>
                <p className="text-gray-500 mt-1">Start pre-configured administrative workflows manually.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {templates.map(t => (
                    <div key={t.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{t.name}</h3>
                        <p className="text-gray-500 text-sm flex-1 mb-4">{t.desc}</p>
                        
                        <button
                            onClick={() => startWorkflow(t.id)}
                            disabled={starting === t.id}
                            className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                                success === t.id 
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'
                            }`}
                        >
                            {success === t.id ? (
                                <>
                                    <CheckCircle className="w-4 h-4" /> Started
                                </>
                            ) : starting === t.id ? (
                                'Starting...'
                            ) : (
                                <>
                                    <PlayCircle className="w-4 h-4" /> Start Workflow
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
