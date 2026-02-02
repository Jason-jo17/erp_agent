import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import { useNavigate } from 'react-router-dom';
import {
    Send, FileText
} from 'lucide-react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components safely
try {
    ChartJS.register(
        ArcElement,
        CategoryScale,
        LinearScale,
        BarElement,
        LineElement,
        PointElement,
        Title,
        Tooltip,
        Legend
    );
} catch (e) {
    console.warn("ChartJS registration failed", e);
}

// Interfaces matching App.tsx and API
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    metadata?: any;
    action_items?: ActionItem[];
    visualizations?: Visualization[];
    documents?: Document[];
    notifications?: Notification[];
    timestamp: Date;
    suggested_prompts?: string[];
    token_usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

export interface ActionItem {
    label: string;
    action_type: string;
    payload?: any;
    icon?: string;
    variant?: string;
}

export interface Visualization {
    type: string;
    title: string;
    data: any;
    config?: any;
}

export interface Document {
    filename: string;
    path: string;
    type: string;
    size_bytes?: number;
}

export interface Notification {
    title: string;
    message: string;
    type: string;
    timestamp: Date;
    action?: ActionItem;
}

interface ChatWindowProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    onSelectExample?: (example: string) => void;
    loading: boolean;
    activeAgent: { name: string; examples: string[] };
    activeMode?: boolean;
    onSystemAlert?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    onSendMessage,
    onSelectExample,
    loading,
    activeAgent,
    activeMode, // Received from App
    onSystemAlert // New Prop for Global Toasts
}) => {
    const [input, setInput] = useState('');
    const [showReports, setShowReports] = useState(false);
    const [liveRecs, setLiveRecs] = useState<string[]>([]);
    const [showInsightsModal, setShowInsightsModal] = useState(false); // Modal State
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const mermaidRef = useRef<number>(0);
    const navigate = useNavigate();

    // Simulate Live Recommendations when Active Mode is ON
    useEffect(() => {
        let interval: any;
        if (activeMode) {
            // Initial Mock Data
            setLiveRecs([
                "⚠️ Attendance in CS-A dropped by 15% this week.",
                "📈 Library usage peaked at 2 PM today.",
                "🔔 NAAC peer team visit scheduled for next month."
            ]);

            // Passive Update Loop (Simulate Incoming Streams)
            interval = setInterval(() => {
                const newInsights = [
                    "💰 Dept Budget 80% Utilized.",
                    "📝 New Student Feedback Available.",
                    "⚡ Server Load High on Exam Portal.",
                    "🎓 Placement Drive: Infosys confirmed visit."
                ];
                const randomInsight = newInsights[Math.floor(Math.random() * newInsights.length)];
                setLiveRecs(prev => {
                    // Keep max 5 recent
                    const updated = [randomInsight, ...prev].slice(0, 5);
                    return updated;
                });

                // Trigger Passive Push Notification
                if (onSystemAlert) {
                    onSystemAlert(`New Insight: ${randomInsight}`, 'info');
                }
            }, 10000); // Update every 10s
        } else {
            setLiveRecs([]);
        }
        return () => clearInterval(interval);
    }, [activeMode, onSystemAlert]);

    // Mock Report List (Real version would fetch from /api/v1/documents/list)
    const reportOptions = [
        "Annual Report",
        "Financial Audit Report",
        "Academic Audit Report",
        "Anti-Ragging Report",
        "SC/ST/OBC Cell Report",
        "Examination Results Analysis Report",
        "Placement Report",
        "Faculty Development Report",
        "Student Feedback Analysis Report",
        "Library Annual Report",
        "Infrastructure Utilization Report",
        "Research Publication Report",
        "Internal Complaints Committee (ICC) Report",
        "Grievance Redressal Report",
        "Women Empowerment Cell Report",
        "NAAC Self-Study Report (SSR)",
        "NBA Self-Assessment Report",
        "Graduate Attribute Tracking Report",
        "CO-PO Attainment Report",
        "AICTE Mandatory Disclosure",
        "NIRF Data Report",
        "AQAR (NAAC) Report",
        "Budget Utilization Report",
        "Institution Overview"
    ];

    // Initial Mermaid Setup
    useEffect(() => {
        try {
            mermaid.initialize({
                startOnLoad: false, // We render manually
                theme: 'default',
                securityLevel: 'loose'
            });
        } catch (e) {
            console.warn("Mermaid init failed", e);
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        // Render mermaid diagrams after messages update
        // We use a timeout to let DOM render first
        const timer = setTimeout(() => {
            try {
                mermaid.run({
                    querySelector: '.mermaid'
                });
            } catch (e) {
                console.warn("Mermaid run failed", e);
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const handleActionClick = (action: ActionItem) => {
        if (action.action_type === 'link') {
            if (action.payload?.url) {
                if (action.payload.url.startsWith('http')) {
                    window.open(action.payload.url, '_blank');
                } else {
                    navigate(action.payload.url);
                }
            }
        } else if (action.action_type === 'download') {
            if (action.payload?.path) window.open(action.payload.path, '_blank');
        } else if (action.action_type === 'modal') {
            // Handle Modal Triggers
            if (action.payload?.modal_id === 'assign_hod') {
                // Trigger a specific modal or behavior
                alert(`Work Flow Triggered: ${action.label}\n(Opening Task Assignment Module)`);
                // In a real app, this would set showAssignmentModal(true)
            } else {
                alert(`Modal Triggered: ${action.payload?.modal_id}`);
            }
        } else {
            // Default: Treat as a button/chip/suggestion -> Send Message
            onSendMessage(action.label);
        }
    };

    const renderChart = (viz: Visualization) => {
        const chartData = {
            labels: viz.data.labels || [],
            datasets: [
                {
                    label: viz.title,
                    data: viz.data.values || [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' as const },
                title: { display: true, text: viz.title },
            },
        };

        switch (viz.type) {
            case 'pie': return <Pie data={chartData} options={options} />;
            case 'bar': return <Bar data={chartData} options={options} />;
            case 'line': return <Line data={chartData} options={options} />;
            default: return null;
        }
    };

    const renderVisualization = (viz: Visualization, index: number) => {
        if (viz.type === 'mermaid') {
            const mermaidId = `mermaid-${mermaidRef.current}-${index}`;
            return (
                <div key={index} id={mermaidId} className="mermaid-container my-4">
                    <h4 className="font-medium mb-2">{viz.title}</h4>
                    <div className="mermaid bg-white p-4 rounded border">
                        {viz.data.code}
                    </div>
                </div>
            );
        } else {
            return (
                <div key={index} className="chart-container my-4 bg-white border rounded-lg p-4">
                    <div style={{ height: '300px' }}>
                        {renderChart(viz)}
                    </div>
                </div>
            );
        }
    };



    return (
        <div className="flex flex-col h-full bg-gray-50">

            {/* Active Mode Intelligence Bar - Clickable */}
            {activeMode && (
                <div
                    onClick={() => setShowInsightsModal(true)}
                    className="bg-emerald-50 border-b border-emerald-100 p-2 flex items-center justify-between animate-in slide-in-from-top-2 cursor-pointer hover:bg-emerald-100 transition-colors"
                >
                    <div className="flex items-center gap-2 overflow-hidden px-2 w-full">
                        <span className="flex h-2 w-2 relative flex-shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider whitespace-nowrap flex-shrink-0">Live Intelligence:</span>
                        <div className="flex-1 overflow-hidden relative h-5 w-full">
                            {/* Pauses on Hover */}
                            <div className="animate-marquee whitespace-nowrap text-xs text-emerald-800 font-medium hover:[animation-play-state:paused]">
                                {liveRecs.join("  •  ")}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Insights Modal Overlay */}
            {showInsightsModal && activeMode && (
                <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-emerald-50 rounded-t-xl">
                            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Live System Intelligence
                            </h3>
                            <button onClick={() => setShowInsightsModal(false)} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600">
                                <FileText className="w-5 h-5 rotate-45" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            {liveRecs.map((rec, idx) => (
                                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-200 hover:shadow-md transition-all bg-white group">
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="text-gray-800 text-sm font-medium">{rec}</p>
                                        <button
                                            onClick={() => {
                                                onSendMessage(`Analyze this insight: "${rec}"`);
                                                setShowInsightsModal(false);
                                            }}
                                            className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-100 font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Analyze ⚡
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {liveRecs.length === 0 && <p className="text-gray-400 text-center italic">Waiting for incoming data stream...</p>}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl text-xs text-gray-500 flex justify-between">
                            <span>Auto-updating every 10s</span>
                            <span>Source: ERP Event Bus</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">AI</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Welcome, {activeAgent.name}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            How can I assist you today?
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                            {activeAgent.examples?.map((suggestion, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSelectExample ? onSelectExample(suggestion) : onSendMessage(suggestion)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' :
                            message.role === 'system' ? 'justify-center my-4' : 'justify-start'
                            }`}
                    >
                        {message.role === 'system' ? (
                            <div className="bg-gray-100 border border-gray-200 text-gray-600 text-xs py-1 px-4 rounded-full flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                <ReactMarkdown allowedElements={['strong', 'em']}>{message.content}</ReactMarkdown>
                            </div>
                        ) : (
                            <>
                                {message.role !== 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white text-xs font-bold">AI</span>
                                    </div>
                                )}
                                {/* ... existing message content ... */}
                            </>
                        )}

                        <div className={`max-w-[80%] lg:max-w-[60%] ${message.role === 'user' ? 'order-first' : ''}`}>
                            {/* Message Bubble */}
                            <div
                                className={`rounded-2xl px-5 py-3.5 shadow-sm ${message.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                    }`}
                            >
                                <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code(props) {
                                                const { children, className, node, ...rest } = props;
                                                const match = /language-(\w+)/.exec(className || '');
                                                return match ? (
                                                    <SyntaxHighlighter
                                                        // @ts-ignore
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...rest}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...rest}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>

                                <span className={`text-[10px] mt-2 block font-medium ${message.role === 'user' ? 'text-blue-100/80' : 'text-gray-400'}`}>
                                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    {message.token_usage && (
                                        <span className="ml-2 opacity-60" title="Total Tokens">
                                            • {message.token_usage.total_tokens} tokens
                                        </span>
                                    )}
                                </span>
                            </div>

                            {/* ... Notifications/Visualizations/Docs/Actions ... */}
                            {message.notifications && message.notifications.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {message.notifications.map((notif, idx) => (
                                        <div key={idx} className={`p-3 rounded-lg border flex items-start gap-3 ${notif.type === 'danger' || notif.type === 'warning' ? 'bg-red-50 border-red-200 text-red-900' :
                                            notif.type === 'success' ? 'bg-green-50 border-green-200 text-green-900' :
                                                'bg-blue-50 border-blue-200 text-blue-900'
                                            }`}>
                                            <div className="flex-1">
                                                <div className="font-semibold text-sm">{notif.title}</div>
                                                <div className="text-xs opacity-90">{notif.message}</div>
                                            </div>
                                            {notif.action && (
                                                <button
                                                    onClick={() => handleActionClick(notif.action!)}
                                                    className="text-xs bg-white border border-current px-2 py-1 rounded shadow-sm hover:opacity-80"
                                                >
                                                    {notif.action.label}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Visualizations */}
                            {message.visualizations && message.visualizations.length > 0 && (
                                <div className="mt-3 space-y-3">
                                    {message.visualizations.map((viz, idx) =>
                                        renderVisualization(viz, idx)
                                    )}
                                </div>
                            )}

                            {/* Documents */}
                            {message.documents && message.documents.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {message.documents.map((doc, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => window.open(doc.path, '_blank')}
                                            className="bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-semibold text-gray-700 block group-hover:text-blue-700">
                                                        {doc.filename}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">{doc.type} FILE</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Action Items */}
                            {message.action_items && message.action_items.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {message.action_items.map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleActionClick(action)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 ${action.variant === 'danger'
                                                ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50'
                                                : action.variant === 'primary'
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Suggested Prompts */}
                            {message.suggested_prompts && message.suggested_prompts.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2">
                                    {/* <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider ml-1">Suggested</span> */}
                                    <div className="flex flex-wrap gap-2">
                                        {message.suggested_prompts.map((prompt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => onSendMessage(prompt)}
                                                className="px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs hover:bg-white hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all text-left"
                                            >
                                                ✨ {prompt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading Indicator - Integrated */}
                {loading && (
                    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-200">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Thinking...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Floating Suggested Prompts (Latest) */}
                    {messages.length > 0 && messages[messages.length - 1].suggested_prompts && messages[messages.length - 1].suggested_prompts!.length > 0 && (
                        <div className="mb-3 flex overflow-x-auto gap-2 pb-2 no-scrollbar">
                            {messages[messages.length - 1].suggested_prompts!.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSendMessage(prompt)}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full text-xs hover:bg-blue-100 hover:border-blue-300 transition-colors whitespace-nowrap"
                                >
                                    ✨ {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder={`Ask ${activeAgent.name}...`}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
                        >
                            <Send className="w-4 h-4" />
                            Send
                        </button>

                        {/* Report Selector Button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowReports(!showReports)}
                                className="px-3 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
                                title="Generate Report"
                            >
                                <FileText className="w-4 h-4" />
                            </button>
                            {showReports && (
                                <div className="absolute bottom-full right-0 mb-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase px-2 py-1 sticky top-0 bg-white z-10">Generate Report</h4>
                                    {reportOptions.map((rpt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                onSendMessage(`Generate ${rpt}`);
                                                setShowReports(false);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            <FileText className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">{rpt}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 text-center">
                        💡 AI Agent Swarm Connected
                    </div>
                </div>
            </div>
        </div>
    );
};

