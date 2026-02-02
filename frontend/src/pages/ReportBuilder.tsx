
import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockReports } from '../data/mockReports';
import { FileText, Download, Sparkles, RefreshCw } from 'lucide-react';

interface ReportSection {
    title: string;
    data: any; // Can be string (text) or string[][] (table)
}

export const ReportBuilder = () => {
    const [templates, setTemplates] = useState<string[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [context, setContext] = useState<string>('');
    const [reportData, setReportData] = useState<ReportSection[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const location = useLocation();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handlePreview = async () => {
        if (reportData.length === 0) return;
        setGenerating(true);
        try {
            const payloadContent = reportData.map(s => [s.title, s.data]);
            const res = await fetch(`${API_BASE_URL}/api/v1/documents/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: `Preview_${selectedTemplate.replace(/\s+/g, '_')}.pdf`,
                    role_name: "User",
                    template: selectedTemplate,
                    content: payloadContent
                })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                setPreviewUrl(url);
            } else {
                alert("Preview failed.");
            }
        } catch (err) {
            console.error("Error previewing", err);
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (reportData.length === 0) return;
        setGenerating(true);
        try {
            // Convert back to backend format: [ ["Title", [rows]] ]
            const payloadContent = reportData.map(s => [s.title, s.data]);

            const res = await fetch(`${API_BASE_URL}/api/v1/documents/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: `${selectedTemplate.replace(/\s+/g, '_')}_${Date.now()}.pdf`,
                    role_name: "User", // Could get from auth context
                    template: selectedTemplate,
                    content: payloadContent
                })
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedTemplate}.pdf`; // Browser handles filename usually
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                console.error("Download failed");
                alert("Download failed.");
            }
        } catch (err) {
            console.error("Error downloading", err);
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlRole = params.get('role');

        const user = JSON.parse(localStorage.getItem('erp_user') || '{}');
        const role = urlRole || user.role || 'guest';

        // Fetch templates first with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        fetch(`${API_BASE_URL}/api/v1/documents/list?role=${role}`, { signal: controller.signal })
            .then(res => {
                clearTimeout(timeoutId);
                return res.json();
            })
            .then((data: string[]) => {
                setTemplates(data);

                // Parse Query Params (Template & Context)
                const urlTemplate = params.get('template');
                const urlContext = params.get('context');

                if (urlTemplate && data.includes(urlTemplate)) {
                    setSelectedTemplate(urlTemplate);
                } else if (data.length > 0) {
                    setSelectedTemplate(data[0]);
                }

                if (urlContext) {
                    setContext(urlContext);
                }
            })
            .catch(err => {
                clearTimeout(timeoutId);
                console.error("Failed to load templates or timed out", err);
                // Fallback for when backend is offline/building
                const fallbackTemplates = [
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
                setTemplates(fallbackTemplates);
                if (fallbackTemplates.length > 0) setSelectedTemplate(fallbackTemplates[0]);
            });
    }, [location.search]);

    const handleGenerateSuggestions = async () => {
        if (!selectedTemplate) return;
        setLoading(true);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/documents/suggestions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    template: selectedTemplate,
                    context: { note: context }
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const data = await res.json();

            // Parse response format matched in backend: [ ["Title", [rows]] ]
            if (data.content && Array.isArray(data.content)) {
                const sections: ReportSection[] = data.content.map((item: any) => ({
                    title: item[0],
                    data: item[1]
                }));
                setReportData(sections);
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn("Backend unavailable, using local mock data", err);

            // Client-side Fallback Generation
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate "Thinking"

            const mockData = mockReports[selectedTemplate] || mockReports["default"];

            const sections: ReportSection[] = mockData.map((item: any) => ({
                title: item[0],
                data: item[1]
            }));
            setReportData(sections);

        } finally {
            setLoading(false);
        }
    };

    const handleCellChange = (sectionIndex: number, rowIndex: number, colIndex: number, value: string) => {
        const newData = [...reportData];
        // Check if data is a table (and not text)
        if (Array.isArray(newData[sectionIndex].data)) {
            newData[sectionIndex].data[rowIndex][colIndex] = value;
        }
        setReportData(newData);
    };

    const handleTextChange = (sectionIndex: number, value: string) => {
        const newData = [...reportData];
        newData[sectionIndex].data = value;
        setReportData(newData);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-6 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                        Report Builder
                    </h1>
                    <p className="text-sm text-gray-500">AI-Assisted Educational Report Generation</p>
                </div>
            </div>

            <div className="flex gap-6 h-full overflow-hidden">
                {/* Left Panel: Configuration */}
                <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                                {templates.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Context / Notes (Optional)</label>
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm h-32 resize-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="E.g., Focus on recent research grants from DST..."
                            />
                            <p className="text-xs text-gray-400 mt-1">Provide specific details for the AI to include.</p>
                        </div>

                        <button
                            id="generate-btn"
                            onClick={handleGenerateSuggestions}
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Generating Draft...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    Generate Suggestions
                                </>
                            )}
                        </button>

                        <div className="pt-6 border-t border-gray-100 space-y-3">
                            <button
                                onClick={handlePreview}
                                disabled={generating}
                                className="w-full py-2.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {generating ? "Generating..." : (
                                    <>
                                        <FileText className="w-4 h-4" />
                                        Preview PDF
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={generating}
                                className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {generating ? "Generating..." : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Download PDF Report
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Preview & Edit */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8 overflow-y-auto">
                    {reportData.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-lg font-medium">No report generated yet</p>
                            <p className="text-sm">Select a template and click 'Generate Suggestions' to start.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-4xl mx-auto">
                            <div className="text-center pb-8 border-b border-gray-100">
                                <h2 className="text-3xl font-bold text-gray-900">{selectedTemplate}</h2>
                                <p className="text-gray-500 mt-2">DRAFT VERSION • {new Date().toLocaleDateString()}</p>
                            </div>

                            {reportData.map((section, sIdx) => (
                                <div key={sIdx} className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">{section.title}</h3>

                                    {typeof section.data === 'string' ? (
                                        // Text Paragraph Editor
                                        <textarea
                                            value={section.data}
                                            onChange={(e) => handleTextChange(sIdx, e.target.value)}
                                            className="w-full p-4 bg-white border border-gray-200 rounded-lg text-sm leading-relaxed text-gray-700 min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                                        />
                                    ) : Array.isArray(section.data) && section.data.length > 0 ? (
                                        // Table Editor
                                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                                            <table className="w-full text-sm text-left">
                                                <tbody>
                                                    {section.data.map((row: string[], rIdx: number) => (
                                                        <tr key={rIdx} className={rIdx === 0 ? "bg-gray-100 font-bold" : "bg-white border-t border-gray-100"}>
                                                            {row.map((cell: string, cIdx: number) => (
                                                                <td key={cIdx} className="p-0 border-r border-gray-100 last:border-0">
                                                                    <input
                                                                        type="text"
                                                                        value={cell}
                                                                        onChange={(e) => handleCellChange(sIdx, rIdx, cIdx, e.target.value)}
                                                                        className={`w-full p-3 bg-transparent border-none focus:ring-2 focus:ring-inset focus:ring-blue-500 outline-none transition-all ${rIdx === 0 ? 'font-bold text-gray-700' : 'text-gray-600'}`}
                                                                    />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 italic">No content available.</p>
                                    )}
                                </div>
                            ))}

                            {/* Native PDF Preview */}
                            {previewUrl && (
                                <div className="mt-8 border-t border-gray-200 pt-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        PDF Preview
                                    </h3>
                                    <div className="bg-gray-100 rounded-lg p-2 border border-gray-300">
                                        <iframe
                                            src={previewUrl}
                                            className="w-full h-[800px] rounded bg-white shadow-inner"
                                            title="PDF Preview"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
