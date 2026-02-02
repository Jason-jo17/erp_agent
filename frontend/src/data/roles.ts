
export interface AgentDefinition {
    id: string;
    name: string;
    description: string;
    capabilities: string[];
    examples: string[];
}

export const ROLE_AGENTS: Record<string, AgentDefinition> = {
    'orchestrator': {
        id: 'orchestrator',
        name: 'Orchestrator Agent',
        description: 'Central coordinator that routes tasks to specialized agents.',
        capabilities: [
            'Route complex queries',
            'Manage inter-agent communication',
            'System health monitoring'
        ],
        examples: [
            'Analyze system status and generate a visual report with actionable items.',
            'What is the status of the college accreditation?',
            'Help me plan the academic calendar for 2025.'
        ]
    },
    'principal': {
        id: 'principal',
        name: 'Principal Agent',
        description: 'Executive agent for institutional decision making and approval.',
        capabilities: [
            'Approve high-value budgets',
            'Review Departmental Performance',
            'Issue Campus-wide Circulars',
            'Analyze Admissions Data'
        ],
        examples: [
            'Generate the Annual Report for the Board.',
            'Approve the pending budget requests for CS Department.',
            'Draft a circular for the upcoming Convocation.'
        ]
    },
    'hod': {
        id: 'hod',
        name: 'HOD Agent',
        description: 'Department administrator for academic and faculty management.',
        capabilities: [
            'Assign Faculty Workload',
            'Review Curriculum vs Industry Gaps',
            'Approve Student Leave',
            'Monitor Class Attendance'
        ],
        examples: [
            'Create a workload distribution plan for next semester.',
            'Generate a report on low-attendance students.',
            'Identify skill gaps in the current AI/ML curriculum.'
        ]
    },
    'faculty': {
        id: 'faculty',
        name: 'Faculty Agent',
        description: 'Academic assistant for teaching, grading, and research.',
        capabilities: [
            'Generate Course File Documentation',
            'Create Lesson Plans',
            'Automate Grading (Demo)',
            'Track Research Publications'
        ],
        examples: [
            'Generate a Course File structure for Data Structures.',
            'Create a lesson plan for "Introduction to Graphs" (1 hour).',
            'Draft a quiz with 5 MCQs on Binary Trees.'
        ]
    },
    'admin': {
        id: 'admin',
        name: 'Administrative Agent',
        description: 'Operational agent for finance, HR, and student services.',
        capabilities: [
            'Process Student Fee Payments',
            'Manage Vendor Purchase Orders',
            'Issue Bonafide Certificates',
            'Update Hostel Allocations'
        ],
        examples: [
            'Draft a purchase order for 50 new dell monitors.',
            'Check pending fee dues for Final Year students.',
            'Generate a Bonafide Certificate template.'
        ]
    },
    'iqac': {
        id: 'iqac',
        name: 'IQAC Coordinator',
        description: 'Internal Quality Assurance Cell for NAAC/NBA compliance.',
        capabilities: [
            'Generate AQAR Reports',
            'Monitor Quality Metrics',
            'Prepare SSR Documentation',
            'Track Faculty Publications'
        ],
        examples: [
            'Draft the AQAR for the academic year 2024-25.',
            'Analyze faculty publication trends for the last 5 years.',
            'Check status of NAAC criteria 3 data.'
        ]
    },
    'coe': {
        id: 'coe',
        name: 'Controller of Examinations',
        description: 'Authority for conducting exams and declaring results.',
        capabilities: [
            'Publish Examination Schedule',
            'Process Result Revaluation',
            'Generate Student Grade Cards',
            'Manage Exam Hall Allocations'
        ],
        examples: [
            'Generate the end-semester exam timetable.',
            'Analyze pass percentage for CS Department.',
            'Process grade sheets for Batch 2024.'
        ]
    },
    'finance': {
        id: 'finance',
        name: 'Finance Officer',
        description: 'Head of financial planning, budget, and audits.',
        capabilities: [
            'Approve Department Budgets',
            'Generate Financial Audit Reports',
            'Track Fee Collection',
            'Manage Payroll'
        ],
        examples: [
            'Generate the annual budget utilization report.',
            'Review pending vendor payments.',
            'Analyze fee collection status for First Year.'
        ]
    },
    'student': {
        id: 'student',
        name: 'Student',
        description: 'Access to personal academic records and services.',
        capabilities: [
            'View Attendance Record',
            'Download Grade Card',
            'Check Fee Status',
            'Submit Grievance'
        ],
        examples: [
            'What is my attendance percentage in Data Structures?',
            'Download my latest grade card.',
            'When is the next fee payment due?'
        ]
    },
    'tpo': {
        id: 'tpo',
        name: 'Training & Placement Officer',
        description: 'Manages campus placements and student training.',
        capabilities: [
            'Generate Placement Report',
            'Track Company Drives',
            'Analyze Student Skill Gaps',
            'Manage Internship Records'
        ],
        examples: [
            'Generate the annual placement report for 2024.',
            'List top recruiters for CSE department.',
            'Check internship status of final year students.'
        ]
    },
    'librarian': {
        id: 'librarian',
        name: 'Librarian',
        description: 'Manages library resources and access.',
        capabilities: [
            'Generate Library Annual Report',
            'Track Book Usage',
            'Manage Digital Subscriptions',
            'Inventory Audit'
        ],
        examples: [
            'Generate the annual library utilization report.',
            'Track usage of IEEE journals.',
            'List new book arrivals for this month.'
        ]
    },
    'anti_ragging': {
        id: 'anti_ragging',
        name: 'Anti-Ragging Committee',
        description: 'Monitors and prevents ragging incidents.',
        capabilities: [
            'Generate Anti-Ragging Report',
            'Monitor Squad Logs',
            'Track Affidavits',
            'Manage Hotline Complaints'
        ],
        examples: [
            'Generate the quarterly anti-ragging report.',
            'Check compliance status of mandatory affidavits.',
            'Review squad patrol logs.'
        ]
    },
    'sc_st_cell': {
        id: 'sc_st_cell',
        name: 'SC/ST/OBC Cell Coordinator',
        description: 'Ensures welfare and compliance for reserved categories.',
        capabilities: [
            'Generate SC/ST Cell Report',
            'Track Scholarship Disbursement',
            'Monitor Grievances',
            'Ensure Reservation Compliance'
        ],
        examples: [
            'Generate the annual SC/ST cell report.',
            'Check scholarship status for ST students.',
            'Review reservation compliance in admissions.'
        ]
    },
    'icc': {
        id: 'icc',
        name: 'ICC Chairperson',
        description: 'Internal Complaints Committee for sexual harassment prevention.',
        capabilities: [
            'Generate ICC Annual Report',
            'Track Harassment Complaints',
            'Monitor Awareness Programs',
            'Ensure Legal Compliance'
        ],
        examples: [
            'Simulate a campus network outage.',
            'Generate a phishing attack simulation report.',
            'Audit the firewall logs for anomalies.'
        ]
    },
    'accreditation_manager': {
        id: 'accreditation_manager',
        name: 'Accreditation Manager',
        description: 'Specialized agent for Washington Accord & NAC compliance management.',
        capabilities: [
            'Washington Accord Compliance (PO/CO)',
            'MBGL Level Assessment (1-5)',
            'Generate Self-Assessment Reports (SAR)',
            'Digital Audit Package Preparation'
        ],
        examples: [
            'What is the current MBGL level of B.Tech CSE?',
            'Generate the PO attainment report for "Data Structures".',
            'Draft the Executive Summary for the SAR.',
            'Show me the gap analysis for PO4.'
        ]
    },
    'grievance': {
        id: 'grievance',
        name: 'Grievance Redressal Committee',
        description: 'Addresses general student and faculty grievances.',
        capabilities: [
            'Generate Grievance Redressal Report',
            'Track Grievance Resolution',
            'Analyze Complaint Trends',
            'Suggest Policy Changes'
        ],
        examples: [
            'Generate the semester-wise grievance report.',
            'Analyze pending grievances for >15 days.',
            'Review feedback on grievance resolution.'
        ]
    },
    'women_cell': {
        id: 'women_cell',
        name: 'Women Empowerment Cell',
        description: 'Promotes women welfare and empowerment.',
        capabilities: [
            'Generate Women Cell Report',
            'Organize Empowerment Events',
            'Monitor Safety Measures',
            'Support Grievance Redressal'
        ],
        examples: [
            'Generate the annual Women Empowerment Cell report.',
            'Plan events for Women\'s Day.',
            'Check functional status of safety measures.'
        ]
    }
};
