import { mockReports } from './mockReports';

export interface MockResponse {
    content: string;
    action_items?: any[];
    visualizations?: any[];
    documents_generated?: any[];
    suggested_prompts?: string[];
    notifications?: any[];
}

export const generateMockChatResponse = (query: string, role: string): Promise<MockResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const lowerQuery = query.toLowerCase();
            let response: MockResponse = {
                content: "I've received your request. Using local mock processing.",
                suggested_prompts: ["Show System Status", "Generate Annual Report"]
            };

            // 1. Report Generation Logic
            if (lowerQuery.includes('generate') && lowerQuery.includes('report')) {
                // Find matching report key from the mockReports object
                const reportKeys = Object.keys(mockReports);
                const matchedKey = reportKeys.find(key => lowerQuery.includes(key.toLowerCase())) || "default";
                const matchedReportTitle = matchedKey === "default" ? "Annual Report" : matchedKey;

                // Detailed Visuals based on Report Type
                const visualizations: any[] = [];
                if (matchedReportTitle.includes("Placement")) {
                    visualizations.push({
                        type: 'bar',
                        title: 'Placement Statistics (2024)',
                        data: {
                            labels: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'],
                            values: [95, 88, 72, 65, 80]
                        }
                    });
                } else if (matchedReportTitle.includes("Budget") || matchedReportTitle.includes("Financial")) {
                    visualizations.push({
                        type: 'pie',
                        title: 'Budget Utilization',
                        data: {
                            labels: ['Infrastructure', 'R&D', 'Salaries', 'Student Dev', 'Misc'],
                            values: [40, 25, 20, 10, 5]
                        }
                    });
                } else if (matchedReportTitle.includes("Student") || matchedReportTitle.includes("Result")) {
                    visualizations.push({
                        type: 'line',
                        title: 'Average GPA Trend (Last 5 Semesters)',
                        data: {
                            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'],
                            values: [7.2, 7.4, 7.8, 7.5, 8.1]
                        }
                    });
                }

                response = {
                    content: `I have generated the **${matchedReportTitle}** as requested based on the latest available data.`,
                    documents_generated: [{
                        filename: `${matchedReportTitle}.pdf`,
                        path: '#', // In real app, this would be a URL
                        type: 'PDF',
                        size_bytes: 1024 * 1024 * 2
                    }],
                    visualizations: visualizations,
                    action_items: [
                        { label: "Download PDF", action_type: "download", payload: { path: "#" }, variant: "primary" },
                        { label: "Edit in Builder", action_type: "link", payload: { url: `/reports/builder?template=${encodeURIComponent(matchedReportTitle)}&auto=true` } }
                    ],
                    suggested_prompts: ["Analyze this report", "Email to Principal"]
                };
            }
            // 2. Accreditation / Status
            else if (lowerQuery.includes('status') || lowerQuery.includes('accreditation')) {
                response = {
                    content: `### Accreditation Status Update\n\n**Current Status:** On Track\n**Next Milestone:** NBA Peer Team Visit (Scheduled: Dec 2025)\n\nI have analyzed the current metrics against the compliance standards:`,
                    visualizations: [{
                        type: 'bar',
                        title: 'Compliance by Criteria',
                        data: {
                            labels: ['Curriculum', 'Teaching', 'Outcomes', 'Faculty', 'Facilities'],
                            values: [85, 92, 78, 88, 95]
                        }
                    }],
                    action_items: [
                        { label: "View Detailed Dashboard", action_type: "link", payload: { url: "/accreditation" }, variant: "primary" }
                    ],
                    suggested_prompts: ["Show detailed gaps", "Schedule review meeting"]
                };
            }
            // 3. General "Analyze" or "Insight"
            else if (lowerQuery.includes('analyze') || lowerQuery.includes('insight')) {
                response = {
                    content: `### Analysis Result\n\nBased on the system logs and performance metrics, here is the analysis:\n\n*   **Trend:** Positive upward trend in student attendance (5% increase).\n*   **Anomaly:** Detected irregular server load spikes during non-exam hours.\n*   **Recommendation:** Review firewall logs for potential security probing.`,
                    visualizations: [{
                        type: 'line',
                        title: 'Attendance Trend (Last 7 Days)',
                        data: {
                            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            values: [75, 78, 80, 82, 85, 84] // Mock data
                        }
                    }],
                    suggested_prompts: ["Investigate Security Logs", "Generate Attendance Report"]
                };
            }
            // 4. Default / Greetings
            else {
                response = {
                    content: `I am the **${role.charAt(0).toUpperCase() + role.slice(1)} Agent** running in **Offline Mode**. \n\nI can help you simulate workflows, generate mock reports, and demonstrate the UI capabilities without the live backend.\n\n*Try asking me to "Generate NAAC Report" or "Show Accreditation Status".*`,
                    suggested_prompts: ["Generate NAAC Report", "Show Accreditation Status", "Analyze Student Performance"]
                };
            }

            resolve(response);
        }, 1500); // 1.5s simulated delay
    });
};
