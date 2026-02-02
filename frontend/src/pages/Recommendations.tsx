import { useState, useEffect } from 'react';
import { Lightbulb, ArrowRight, Zap } from 'lucide-react';

interface Action {
    label: string;
    action_type: string;
    variant?: string;
    api_call?: string;
}

interface Recommendation {
    id: string;
    title: string;
    description: string;
    priority: string;
    actions: Action[];
    created_at: string;
}

export const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("");
    const [activeMode, setActiveMode] = useState(false);

    // Load initial passive recommendations
    useEffect(() => {
        fetchRecs();
    }, []);

    const fetchRecs = async () => {
        try {
            const res = await fetch('/api/v1/recommendations/active?role_id=faculty');
            const data = await res.json();
            if (Array.isArray(data)) {
                setRecommendations(data);
            } else {
                console.error("API Error (Not an Array):", data);
                setRecommendations([]);
            }
        } catch (e) {
            console.error(e);
            setRecommendations([]);
        }
    };

    const handleGenerate = async () => {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch('/api/v1/recommendations/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    context: { role_id: 'faculty' }
                })
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setRecommendations(prev => [...data, ...prev]);
                setQuery("");
            } else {
                console.error("API Gen Error:", data);
                // Optional: Show toast error here
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    AI Recommendations
                </h1>
                <p className="text-gray-500 mt-2">Active & Passive insights to improve institutional performance.</p>
            </header>

            {/* Active Query Section */}
            <div className={`rounded-xl p-8 mb-10 transition-all duration-500 border relative overflow-hidden ${activeMode
                ? 'bg-white border-emerald-200 shadow-xl shadow-emerald-500/10'
                : 'bg-white border-gray-200 shadow-lg'
                }`}>
                {/* Background Decor */}
                <div className={`absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 rounded-full opacity-10 blur-3xl ${activeMode ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="max-w-2xl">
                        <h2 className={`text-2xl font-bold mb-2 flex items-center gap-3 ${activeMode ? 'text-emerald-800' : 'text-gray-800'}`}>
                            {activeMode ? (
                                <>
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                    Active Intervention Mode
                                </>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                                    Strategic Analysis
                                </span>
                            )}
                        </h2>
                        <p className="text-gray-500 text-base leading-relaxed">
                            {activeMode
                                ? 'The AI is actively monitoring system streams to detect anomalies and suggest interventions in real-time.'
                                : 'Enable active mode for real-time monitoring, or manually query the engine below for specific strategic advice.'}
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-full border border-gray-200">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${!activeMode ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>MANUAL</span>
                        <button
                            onClick={() => setActiveMode(!activeMode)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${activeMode ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${activeMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${activeMode ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-400'}`}>ACTIVE</span>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Zap className={`w-5 h-5 ${activeMode ? 'text-emerald-500' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder={activeMode ? "Describe the intervention scenario..." : "e.g., 'Analyze drop in CS department research output'"}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium placeholder-gray-400"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${activeMode
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-black hover:to-gray-800'
                            }`}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                Generate Insights
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Strategic Recommendations
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{recommendations.length} Pending Actions</span>
                </div>

                {recommendations.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Zap className="w-8 h-8 opacity-50" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-800">All Clear</h4>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">System performance is optimal. No active interventions are required at this time.</p>
                    </div>
                )}

                {recommendations.map(rec => (
                    <div key={rec.id} className="bg-white border border-gray-200 rounded-2xl p-0 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
                        <div className="p-6 md:p-8 flex gap-6">
                            {/* Priority Icon */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${rec.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                <Zap className="w-6 h-6" />
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{rec.title}</h3>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${rec.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {rec.priority}
                                    </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {rec.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {rec.actions.map((action, idx) => (
                                        <button
                                            key={idx}
                                            className="bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 text-gray-700 hover:text-emerald-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                                        >
                                            {action.label}
                                            <ArrowRight className="w-4 h-4 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-8 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                            <span>Generated for: <strong>Faculty Role</strong></span>
                            <span>{new Date(rec.created_at || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

