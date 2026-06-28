from fastapi import APIRouter, HTTPException, Query, Body
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet
import io
import datetime
import json
from typing import List, Tuple, Any, Optional
from pydantic import BaseModel
from app.services.report_service import ReportService
from app.schemas.report_schema import ReportRequest, SuggestionRequest
from app.core.rbac import rbac, Permission
from app.models.user import User
from app.services.llm_service import LLMService
from langchain_core.messages import HumanMessage, SystemMessage

router = APIRouter()

# --- Data Models ---
class SuggestionRequest(BaseModel):
    template: str
    context: Optional[dict] = {}

class CustomReportRequest(BaseModel):
    filename: str
    role_name: str
    template: str
    content: List[Tuple[str, Any]]

# --- Existing Content Functions ---

# Role-Based Report Access Configuration
# Derived from Compliance Master Matrix V1 RACI Matrix (Sheet 5)
ROLE_TEMPLATE_MAPPING = {
    # AICTE Liaison / Principal — AICTE compliance owner
    "principal": [
        "AICTE EoA Application Report",
        "AICTE Mandatory Disclosure",
        "Accreditation Readiness Scorecard",
        "Data Consistency Report",
        "Annual Report",
        "Institution Overview",
        "NBA Self-Assessment Report",
        "NAAC Self-Study Report (SSR)",
        "AQAR (NAAC) Report",
        "NIRF Data Report",
    ],
    # HOD — NBA SAR C1/C2/C3, CO-PO, curriculum owner
    "hod": [
        "CO-PO Attainment Report",
        "NBA SAR Criterion 1 — Curriculum",
        "NBA SAR Criterion 2 — Teaching Learning",
        "NBA SAR Criterion 3 — Assessment",
        "Student Performance Report",
        "Budget Utilization Report",
        "NBA Self-Assessment Report",
        "NAAC Self-Study Report (SSR)",
        "AQAR (NAAC) Report",
        "Student Feedback Analysis Report",
        "Faculty Qualification Report",
        "Institution Overview",
    ],
    "faculty": [
        "CO-PO Attainment Report",
        "Student Performance Report",
        "AQAR (NAAC) Report",
        "Institution Overview",
    ],
    # IQAC Coordinator — NAAC SSR/AQAR/DVV, NIRF, AISHE, Data Consistency
    "iqac": [
        "NAAC Self-Study Report (SSR)",
        "AQAR (NAAC) Report",
        "NAAC IIQA Readiness Checklist",
        "NIRF Data Report",
        "AISHE DCF-II Report",
        "Academic Audit Report",
        "Data Consistency Report",
        "Accreditation Readiness Scorecard",
        "IQAC Quarterly Meeting Report",
        "Student Feedback Analysis Report",
        "NBA Self-Assessment Report",
    ],
    # NBA Coordinator — all SAR criteria, pre-qualifier
    "nba_coordinator": [
        "NBA Pre-Qualifier Form",
        "NBA SAR Criterion 1 — Curriculum",
        "NBA SAR Criterion 2 — Teaching Learning",
        "NBA SAR Criterion 3 — Assessment",
        "NBA SAR Criterion 4 — Student Performance",
        "NBA SAR Criterion 5-6 — Faculty",
        "NBA SAR Criterion 7-8-9 — Facilities Governance",
        "NBA Self-Assessment Report",
        "CO-PO Attainment Report",
        "Graduate Attribute Tracking Report",
        "MBGL Level Assessment Report",
        "Accreditation Readiness Scorecard",
    ],
    # Controller of Examinations — exam conduct, APAAR, attendance
    "coe": [
        "Examination Results Analysis Report",
        "Student Performance Report",
        "CO-PO Attainment Report",
        "Institution Overview",
    ],
    # Finance Officer — EPF/ESIC, budget, financial audit
    "finance": [
        "Financial Audit Report",
        "Budget Utilization Report",
        "EPF/ESIC Compliance Report",
        "Institution Overview",
    ],
    # HR Head — faculty qualification, EPF/ESIC
    "hr": [
        "Faculty Qualification Report",
        "EPF/ESIC Compliance Report",
        "Faculty Development Report",
    ],
    # Admin Officer — UGC disclosure, state affiliation, fire safety, AISHE
    "admin": [
        "AICTE Mandatory Disclosure",
        "AISHE DCF-II Report",
        "UGC Self-Disclosure Report",
        "State Affiliation Dossier",
        "Fire Safety NOC Report",
        "Budget Utilization Report",
        "NIRF Data Report",
        "Infrastructure Utilization Report",
        "Anti-Ragging Report",
    ],
    # T&P Officer — placement, internship, NIRF GO
    "tpo": [
        "Placement Report",
        "NIRF Data Report",
    ],
    "student": [
        "Student Performance Report",
    ],
    "librarian": [
        "Library Annual Report",
    ],
    "anti_ragging": [
        "Anti-Ragging Report",
    ],
    "sc_st_cell": [
        "SC/ST/OBC Cell Report",
    ],
    "icc": [
        "Internal Complaints Committee (ICC) Report",
        "POSH Annual Report",
    ],
    "grievance": [
        "Grievance Redressal Report",
    ],
    "women_cell": [
        "Women Empowerment Cell Report",
    ],
    # Accreditation Manager / Compliance Officer — sees everything
    "accreditation_manager": [
        "AICTE EoA Application Report",
        "AICTE Mandatory Disclosure",
        "NBA Pre-Qualifier Form",
        "NBA SAR Criterion 1 — Curriculum",
        "NBA SAR Criterion 2 — Teaching Learning",
        "NBA SAR Criterion 3 — Assessment",
        "NBA SAR Criterion 4 — Student Performance",
        "NBA SAR Criterion 5-6 — Faculty",
        "NBA SAR Criterion 7-8-9 — Facilities Governance",
        "NBA Self-Assessment Report",
        "CO-PO Attainment Report",
        "NAAC IIQA Readiness Checklist",
        "NAAC Self-Study Report (SSR)",
        "AQAR (NAAC) Report",
        "NIRF Data Report",
        "AISHE DCF-II Report",
        "UGC Self-Disclosure Report",
        "State Affiliation Dossier",
        "EPF/ESIC Compliance Report",
        "Fire Safety NOC Report",
        "POSH Annual Report",
        "Grievance Redressal Report",
        "Anti-Ragging Report",
        "SC/ST/OBC Cell Report",
        "Graduate Attribute Tracking Report",
        "MBGL Level Assessment Report",
        "Data Consistency Report",
        "Accreditation Readiness Scorecard",
        "Annual Report",
        "Financial Audit Report",
        "Academic Audit Report",
        "Examination Results Analysis Report",
        "Placement Report",
        "Faculty Development Report",
        "Faculty Qualification Report",
        "Student Feedback Analysis Report",
        "Library Annual Report",
        "Infrastructure Utilization Report",
        "Internal Complaints Committee (ICC) Report",
        "Research Publication Report",
        "IQAC Quarterly Meeting Report",
        "Institution Overview",
    ],
    "compliance_officer": [
        "Data Consistency Report",
        "Accreditation Readiness Scorecard",
        "POSH Annual Report",
        "UGC Self-Disclosure Report",
        "EPF/ESIC Compliance Report",
        "Fire Safety NOC Report",
        "State Affiliation Dossier",
        "IQAC Quarterly Meeting Report",
    ],
}

ALL_REPORTS = [
    # AICTE
    "AICTE EoA Application Report",
    "AICTE Mandatory Disclosure",
    "Anti-Ragging Report",
    # NBA
    "NBA Pre-Qualifier Form",
    "NBA SAR Criterion 1 — Curriculum",
    "NBA SAR Criterion 2 — Teaching Learning",
    "NBA SAR Criterion 3 — Assessment",
    "NBA SAR Criterion 4 — Student Performance",
    "NBA SAR Criterion 5-6 — Faculty",
    "NBA SAR Criterion 7-8-9 — Facilities Governance",
    "NBA Self-Assessment Report",
    "CO-PO Attainment Report",
    "Graduate Attribute Tracking Report",
    "MBGL Level Assessment Report",
    # NAAC
    "NAAC IIQA Readiness Checklist",
    "NAAC Self-Study Report (SSR)",
    "AQAR (NAAC) Report",
    # NIRF / AISHE / UGC
    "NIRF Data Report",
    "AISHE DCF-II Report",
    "UGC Self-Disclosure Report",
    # State / Labour / Safety
    "State Affiliation Dossier",
    "EPF/ESIC Compliance Report",
    "Fire Safety NOC Report",
    "POSH Annual Report",
    # Internal / Governance
    "Accreditation Readiness Scorecard",
    "Data Consistency Report",
    "IQAC Quarterly Meeting Report",
    "Faculty Qualification Report",
    # Academic / Departmental
    "Annual Report",
    "Financial Audit Report",
    "Academic Audit Report",
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
    "SC/ST/OBC Cell Report",
    "Student Performance Report",
    "Budget Utilization Report",
    "Institution Overview",
]

ALL_REPORTS_LEGACY = [
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
]


# ─────────────────────────────────────────────
# NEW COMPLIANCE CONTENT FUNCTIONS
# Source: Engineering_College_Compliance_Master_Sheet_V1.xlsx
# ─────────────────────────────────────────────

def get_aicte_eoa_content():
    return [
        ("1. Institution Profile & Governance", [
            ["Field", "Value"],
            ["AICTE Permanent ID", "1-123456789"],
            ["Institution Name", "Institute of Engineering & Technology"],
            ["Trust/Society Registration", "Trust No. XYZ-2001"],
            ["Board of Governors", "Constituted | Last meeting: Dec 2024"],
            ["Academic Council", "Constituted | Last meeting: Nov 2024"],
        ]),
        ("2. Programme-wise Details", [
            ["Programme", "Approved Intake", "Applied Intake", "NBA Status", "NAAC Status"],
            ["B.Tech CSE", "180", "180", "Accredited (Level 3)", "Accredited (3.21 CGPA)"],
            ["B.Tech ECE", "120", "120", "Accredited (Level 2)", "Accredited"],
            ["B.Tech MECH", "60", "60", "Applied", "Accredited"],
        ]),
        ("3. Faculty Roster — SFR & Cadre Compliance", [
            ["Metric", "Required", "Actual", "Status"],
            ["Student-Faculty Ratio (SFR)", "≤ 1:20", "1:17", "✓ Compliant"],
            ["Cadre Ratio (Prof:Assoc:Asst)", "1:2:6", "1:2.1:6.2", "✓ Compliant"],
            ["Faculty with PhD (%)", "≥ 30%", "52%", "✓ Compliant"],
            ["AICTE Faculty ID registered", "100%", "98%", "⚠ 3 pending Aadhaar-PAN link"],
            ["Total Regular Faculty", "—", "150", "Verified via Faculty ID portal"],
        ]),
        ("4. Infrastructure — Land & Built-up", [
            ["Requirement", "AICTE Norm", "Actual", "Status"],
            ["Land Area", "≥ 10 acres (UG)", "12.5 acres", "✓ Compliant"],
            ["Built-up Area", "≥ 10,000 sqm", "18,500 sqm", "✓ Compliant"],
            ["Laboratories", "≥ 1 per 2 courses", "60 labs", "✓ Compliant"],
            ["Library", "≥ 1000 sqm", "1,200 sqm", "✓ Compliant"],
            ["Internet Bandwidth", "≥ 1 Gbps", "1 Gbps Leased", "✓ Compliant"],
        ]),
        ("5. Financial Statements — Audited (3 Years)", [
            ["Year", "Income (₹ Cr)", "Expenditure (₹ Cr)", "Surplus/Deficit"],
            ["2023-24", "18.5", "16.2", "+2.3 (Surplus)"],
            ["2022-23", "17.1", "15.8", "+1.3 (Surplus)"],
            ["2021-22", "15.8", "14.9", "+0.9 (Surplus)"],
        ]),
        ("6. Statutory Compliance Certificates", [
            ["Item", "Status", "Valid Until"],
            ["Anti-Ragging Committee", "Constituted & Active", "Annual reconstitution"],
            ["POSH ICC", "8 members, ≥50% women", "3-year tenure"],
            ["SGRC (Grievance)", "Online portal active", "Continuous"],
            ["Fire NOC", "Valid", "Dec 2025"],
            ["Pollution NOC (SPCB)", "White category — intimation filed", "Annual"],
        ]),
    ]


def get_nba_prequalifier_content():
    return [
        ("NBA Pre-Qualifier Status — Programme: B.Tech CSE", [
            ["Pre-Qualifier", "Required", "3-yr Average", "Status"],
            ["Student-Faculty Ratio (SFR)", "≤ 1:25", "1:17.5", "✓ PASS"],
            ["Admission Ratio (3-yr avg)", "≥ 60%", "94.2%", "✓ PASS"],
            ["PhD Faculty %", "≥ 20%", "52%", "✓ PASS"],
            ["HOD PhD (parent discipline)", "YES", "YES (Dr. R. Sharma, PhD CSE)", "✓ PASS"],
            ["Prof + Assoc Prof with PhD", "≥ 2 each", "Prof:3, Assoc:6 — all PhD", "✓ PASS"],
            ["Graduated Batches", "≥ 2", "5 batches (2019–2023)", "✓ PASS"],
        ]),
        ("Pre-Qualifier Formula — SFR Calculation", [
            ["Year", "Total Students", "Total Faculty", "SFR"],
            ["CAY (2024-25)", "720", "42", "1:17.1"],
            ["CAYm1 (2023-24)", "695", "40", "1:17.4"],
            ["CAYm2 (2022-23)", "680", "39", "1:17.4"],
            ["3-Year Average", "—", "—", "1:17.3 (PASS ≤1:25)"],
        ]),
        ("Pre-Qualifier Formula — Admission Ratio", [
            ["Year", "Sanctioned Intake", "Admitted", "Admission %"],
            ["CAY", "180", "172", "95.6%"],
            ["CAYm1", "180", "168", "93.3%"],
            ["CAYm2", "180", "170", "94.4%"],
            ["3-Year Average", "—", "—", "94.4% (PASS ≥60%)"],
        ]),
        ("Self-Certification", [
            ["Item", "Declaration"],
            ["Principal Sign-off", "I certify all pre-qualifier data is accurate"],
            ["Registration Fee", "₹1,00,000 (non-refundable) — Paid via NEFT"],
            ["Programme Applied", "B.Tech Computer Science & Engineering"],
            ["Accreditation Type", "Tier-I (SAR format effective Jan 2025)"],
        ]),
    ]


def get_co_po_attainment_content():
    return [
        ("CO-PO Attainment — Course: CS401 Data Structures (Sem IV)", [
            ["CO", "CO Statement", "Bloom Level", "CIE %", "SEE %", "Direct Att %", "Indirect %", "Final %", "Status"],
            ["CO1", "Analyze linear data structures", "L4 Analyze", "72", "68", "69.6", "71", "69.8", "✓ Attained"],
            ["CO2", "Design tree-based algorithms", "L5 Evaluate", "65", "58", "60.8", "66", "61.8", "✓ Attained"],
            ["CO3", "Implement graph traversals", "L3 Apply", "58", "52", "54.4", "60", "55.5", "⚠ Not Attained"],
            ["CO4", "Evaluate complexity of algorithms", "L4 Analyze", "70", "64", "66.4", "68", "66.7", "✓ Attained"],
            ["CO5", "Apply sorting/searching algorithms", "L3 Apply", "75", "70", "72", "73", "72.2", "✓ Attained"],
        ]),
        ("Attainment Formula Used", [
            ["Formula Component", "Value"],
            ["CO_direct", "(CIE_marks/max_CIE) × 0.40 + (SEE_marks/max_SEE) × 0.60"],
            ["CO_attainment", "CO_direct × 0.80 + CO_indirect × 0.20"],
            ["Threshold", "60% — Attained if CO_attainment ≥ 60%"],
            ["Direct:Indirect ratio", "80:20 (NBA GAPC v4.0 Criterion 3)"],
        ]),
        ("CO-PO Correlation Matrix", [
            ["CO", "PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", "PO9", "PO10", "PO11"],
            ["CO1", "3", "2", "1", "0", "0", "0", "0", "0", "0", "0", "0"],
            ["CO2", "3", "3", "2", "1", "0", "0", "0", "0", "0", "0", "0"],
            ["CO3", "2", "3", "3", "2", "1", "0", "0", "0", "0", "0", "0"],
            ["CO4", "3", "2", "2", "3", "0", "0", "0", "0", "0", "0", "0"],
            ["CO5", "3", "3", "3", "2", "1", "0", "0", "0", "0", "0", "0"],
        ]),
        ("PO Attainment — Programme Level Aggregation", [
            ["PO", "PO Description", "Attainment %", "Threshold", "Status"],
            ["PO1", "Engineering Knowledge", "71.2", "60%", "✓ Attained"],
            ["PO2", "Problem Analysis", "68.5", "60%", "✓ Attained"],
            ["PO3", "Design/Development", "65.8", "60%", "✓ Attained"],
            ["PO4", "Investigation", "58.3", "60%", "⚠ Gap: +1.7% needed"],
            ["PO5", "Modern Tool Usage", "55.1", "60%", "✗ Gap: +4.9% needed"],
        ]),
        ("Gap Analysis & Action Plan", [
            ["PO with Gap", "Current %", "Gap", "Root Cause", "Action", "Timeline"],
            ["PO4 (Investigation)", "58.3", "-1.7%", "Insufficient lab practicals mapped to PO4", "Add 2 mini-projects with PO4 mapping", "Sem V"],
            ["PO5 (Modern Tools)", "55.1", "-4.9%", "SWAYAM NPTEL course not compulsory", "Make NPTEL 'Modern Tools' course mandatory", "Next AY"],
        ]),
    ]


def get_nba_sar_c1_content():
    return [
        ("Criterion 1.1 — Vision, Mission & PEOs (40 marks)", [
            ["Item", "Details"],
            ["Institution Vision", "To be a globally recognized center of excellence in technical education"],
            ["Institution Mission", "Impart quality technical education through innovative pedagogy and industry collaboration"],
            ["PEO1", "Graduates will demonstrate proficiency in core engineering principles to solve complex problems"],
            ["PEO2", "Graduates will exhibit innovation and entrepreneurial mindset to create sustainable solutions"],
            ["PEO3", "Graduates will engage in lifelong learning to remain competitive in a dynamic industry"],
            ["PEO Review Frequency", "Every 2 years (Board of Studies + Industry Advisory Board)"],
            ["Last Review", "June 2024 — all 3 PEOs revised with stakeholder input"],
        ]),
        ("Criterion 1.2 — Programme Outcomes (POs) — GAPC v4.0 (11 POs)", [
            ["PO", "Graduate Attribute", "Washington Accord Knowledge Profile"],
            ["PO1", "Engineering Knowledge", "WK1 — Natural Science/Maths"],
            ["PO2", "Problem Analysis", "WK2 — Engineering Fundamentals"],
            ["PO3", "Design/Development of Solutions", "WK3 — Engineering Design"],
            ["PO4", "Conduct Investigations of Complex Problems", "WK4 — Investigations"],
            ["PO5", "Modern Tool Usage", "WK5 — Engineering Practice"],
            ["PO6", "The Engineer and Society", "WK6 — Society/Environment"],
            ["PO7", "Environment and Sustainability", "WK7 — Ethics"],
            ["PO8", "Ethics", "WK8 — Individual/Team Work"],
            ["PO9", "Individual & Team Work", "WK9 — Communication"],
            ["PO10", "Communication", "WK10 — Project Management"],
            ["PO11", "Project Management & Finance", "WK11 — Lifelong Learning"],
        ]),
        ("Criterion 1.3 — Curriculum Mapping", [
            ["Course Code", "Course Name", "Credits", "Semester", "COs", "PO Mapping", "Bloom Level"],
            ["CS101", "Engineering Mathematics", "4", "I", "5", "PO1,PO2", "K1-K3"],
            ["CS201", "Data Structures", "4", "III", "5", "PO1,PO2,PO3", "K3-K5"],
            ["CS301", "Database Management", "3", "V", "5", "PO2,PO3,PO5", "K3-K4"],
            ["CS401", "Machine Learning", "3", "VII", "5", "PO1-PO5,PO12", "K4-K6"],
        ]),
        ("Criterion 1.4 — SWAYAM/NPTEL Integration", [
            ["Metric", "Value"],
            ["NPTEL courses offered as electives", "8 courses (22% of total electives)"],
            ["Students enrolled in NPTEL", "245 (AY 2024-25)"],
            ["NPTEL completion certificates", "198 (80.8% completion rate)"],
            ["Credits awarded via NPTEL", "2-4 credits per course per AICTE norms"],
        ]),
    ]


def get_nba_sar_c3_content():
    return [
        ("Criterion 3.1 — CO Attainment — Direct Assessment (CIE + SEE)", [
            ["Course", "CO1 %", "CO2 %", "CO3 %", "CO4 %", "CO5 %", "Avg Attainment %", "Attained COs"],
            ["CS201 Data Structures", "72", "65", "53", "68", "74", "66.4", "4/5"],
            ["CS301 DBMS", "78", "71", "66", "70", "75", "72.0", "5/5"],
            ["CS401 Machine Learning", "68", "62", "55", "60", "64", "61.8", "4/5"],
        ]),
        ("Criterion 3.2 — PO Attainment — Aggregated", [
            ["PO", "PO Description", "CAY %", "CAYm1 %", "CAYm2 %", "3-yr Avg", "Status"],
            ["PO1", "Engineering Knowledge", "71.2", "68.5", "69.8", "69.8", "✓ Attained"],
            ["PO2", "Problem Analysis", "68.5", "65.2", "67.1", "66.9", "✓ Attained"],
            ["PO3", "Design/Development", "65.8", "62.0", "63.5", "63.8", "✓ Attained"],
            ["PO4", "Investigation", "58.3", "55.1", "57.2", "56.9", "✗ Gap Identified"],
            ["PO5", "Modern Tool Usage", "55.1", "52.8", "54.0", "54.0", "✗ Gap Identified"],
        ]),
        ("Criterion 3.3 — Indirect Assessment (Exit Survey)", [
            ["Survey Type", "Respondents", "Response Rate", "Avg Score (/10)", "CO Areas Rated High"],
            ["Student Exit Survey (Graduating Batch)", "145", "96%", "7.8", "CO1, CO2 (core concepts)"],
            ["Alumni Survey (2022 Batch)", "78", "52%", "7.2", "PO1, PO2 (engineering fundamentals)"],
            ["Employer Survey", "22 companies", "44%", "7.5", "PO9 (communication), PO10 (teamwork)"],
        ]),
        ("Criterion 3.4 — SDG Portfolio Mapping (GAPC v4.0 C3.6 new)", [
            ["PO", "SDG Mapped", "Course Example"],
            ["PO6 (Society)", "SDG 11 — Sustainable Cities", "CS601 IoT Applications"],
            ["PO7 (Environment)", "SDG 7 — Clean Energy + SDG 13 — Climate", "CS701 Green Computing"],
            ["PO4 (Investigation)", "SDG 9 — Industry & Innovation", "CS801 Research Project"],
        ]),
        ("Criterion 3.5 — Gap Analysis & Corrective Actions", [
            ["Gap PO", "Root Cause", "Action Taken", "Expected Improvement", "Owner", "Status"],
            ["PO4 (58.3%)", "Insufficient lab practicals mapped", "2 mini-projects added with PO4 mapping", "+5% in next sem", "HOD CSE", "In Progress"],
            ["PO5 (55.1%)", "NPTEL modern tools course not mandatory", "Made mandatory from AY 2025-26", "+7% expected", "NBA Coordinator", "Planned"],
        ]),
    ]


def get_nba_sar_c4_content():
    return [
        ("Criterion 4.1 — Enrolment Ratio", [
            ["Year", "Sanctioned Intake", "Admitted", "Enrolment Ratio %"],
            ["CAY (2024-25)", "180", "172", "95.6%"],
            ["CAYm1 (2023-24)", "180", "168", "93.3%"],
            ["CAYm2 (2022-23)", "180", "170", "94.4%"],
        ]),
        ("Criterion 4.2 — Success Rate (APY Formula)", [
            ["Batch", "Admitted", "Passed in 4 yrs", "Passed in 5 yrs", "APY1 %", "APY2 %", "APY3 %"],
            ["2020 Batch", "168", "151", "161", "89.9", "95.8", "—"],
            ["2019 Batch", "165", "148", "158", "89.7", "95.8", "96.4"],
            ["2018 Batch", "162", "146", "155", "90.1", "95.7", "96.3"],
            ["APY Formula", "(passed in N years / admitted) × 100", "", "", "", "", ""],
        ]),
        ("Criterion 4.3 — Placement & Higher Studies (3-Year)", [
            ["Year", "Eligible", "Placed", "Placement %", "Higher Studies", "GATE Qualified", "Median CTC (LPA)"],
            ["2023-24", "158", "127", "80.4%", "18 (11.4%)", "12 (7.6%)", "6.8"],
            ["2022-23", "155", "124", "80.0%", "15 (9.7%)", "10 (6.5%)", "6.5"],
            ["2021-22", "150", "118", "78.7%", "14 (9.3%)", "9 (6.0%)", "6.2"],
            ["Placement % formula", "placed / eligible (NOT placed/total)", "", "", "", "", ""],
        ]),
        ("Criterion 4.4 — Professional Activities", [
            ["Activity", "Count (CAY)", "Count (CAYm1)", "Marks Impact"],
            ["Professional society memberships (IEEE/CSI)", "85 students", "72 students", "Criterion 4.4"],
            ["Technical paper presentations", "24", "18", "Criterion 4.4"],
            ["Awards (national competitions)", "6", "4", "Criterion 4.4"],
            ["Internships completed (AICTE mandatory)", "168 (100%)", "165 (100%)", "AICTE + Criterion 4.4"],
        ]),
    ]


def get_nba_sar_faculty_content():
    return [
        ("Criterion 5 — Faculty Information (100 marks)", [
            ["Metric", "Required (Excellence)", "Actual", "Status"],
            ["SFR", "≤ 1:15", "1:17.5", "⚠ Acceptable (Pre-qual pass 1:25)"],
            ["PhD faculty %", "Maximize", "52%", "✓ Good"],
            ["Professor cadre count", "Per 1:2:6", "8 Professors", "✓"],
            ["Associate Professor count", "Per 1:2:6", "16 Assoc Professors", "✓"],
            ["Assistant Professor count", "Per 1:2:6", "46 Asst Professors", "✓"],
            ["Faculty retention % (5-yr)", "Maximize", "82%", "✓"],
        ]),
        ("Criterion 5 — Faculty Roster (Sample)", [
            ["Faculty ID", "Name", "Designation", "Qualification", "PhD", "Experience (yrs)", "Scopus Verified"],
            ["AICTE-F-001", "Dr. R. Sharma", "Professor (HOD)", "PhD (IIT-M)", "Computer Science", "22", "Yes"],
            ["AICTE-F-002", "Dr. P. Kumar", "Associate Professor", "PhD (NIT-T)", "CSE", "15", "Yes"],
            ["AICTE-F-003", "Ms. S. Rao", "Assistant Professor", "M.Tech (pursuing PhD)", "—", "8", "N/A"],
        ]),
        ("Criterion 6 — Faculty Contributions (120 marks)", [
            ["Metric", "CAY", "CAYm1", "CAYm2", "3-yr Total"],
            ["Scopus/WoS publications", "42", "38", "35", "115"],
            ["Citations (Scopus)", "285", "241", "198", "724"],
            ["Funded research grants (₹ Cr)", "1.8", "1.5", "1.2", "4.5"],
            ["Patents filed", "8", "6", "5", "19"],
            ["Patents granted", "3", "2", "2", "7"],
            ["Consultancy revenue (₹ L)", "45", "38", "30", "113"],
        ]),
        ("Criterion 6 — Publication List (Sample — Scopus/WoS DOI verified)", [
            ["Faculty", "Title", "Journal", "Year", "DOI", "Citations"],
            ["Dr. R. Sharma", "Deep Learning for Edge Computing", "IEEE Access", "2024", "10.1109/ACCESS.2024.xxx", "12"],
            ["Dr. P. Kumar", "Federated Learning Security", "Elsevier FGCS", "2023", "10.1016/j.future.2023.xxx", "8"],
        ]),
    ]


def get_nirf_content():
    return [
        ("NIRF Engineering — 5 Parameter Summary (AY 2024-25)", [
            ["Parameter", "Weight", "Score Estimate", "Target", "Status"],
            ["TLR — Teaching, Learning & Resources", "30%", "72.5", "80+", "⚠ Improve FRU"],
            ["RPC — Research & Professional Practice", "30%", "58.3", "65+", "⚠ Improve publications"],
            ["GO — Graduation Outcomes", "20%", "76.8", "80+", "✓ Good placement"],
            ["OI — Outreach & Inclusivity", "10%", "65.2", "70+", "⚠ Improve diversity"],
            ["Perception", "10%", "48.0", "55+", "⚠ Needs marketing"],
        ]),
        ("TLR — Teaching, Learning & Resources Sub-metrics", [
            ["Sub-metric", "Formula", "Value", "Max Marks"],
            ["SS — Student Strength", "Total students + PhD students", "724 (720 UG + 4 PhD)", "20"],
            ["FSR — Faculty-Student Ratio", "Students / Faculty", "1:17.5", "30"],
            ["FQE — Faculty with PhD %", "PhD faculty / total × 100", "52%", "20"],
            ["FRU — Financial Resources/Student", "Expenditure (₹) / Students", "₹1,62,000/student", "30"],
        ]),
        ("RPC — Research & Professional Practice Sub-metrics", [
            ["Sub-metric", "Formula / Value", "Score"],
            ["PU — Publications/Faculty (Scopus)", "115 pubs / 40 faculty = 2.88/faculty", "45/100"],
            ["QP — Quality Publications (citations)", "724 citations / 115 pubs = 6.3 avg", "40/100"],
            ["IPR — Intellectual Property Rights", "7 patents granted (CAY+CAYm1)", "15/15"],
            ["FPPP — Professional Practice", "₹1.13 Cr consultancy", "12/20"],
        ]),
        ("GO — Graduation Outcomes Sub-metrics", [
            ["Sub-metric", "Value", "Score"],
            ["GPH — Placement % (placed/eligible)", "80.4% (CAY)", "High"],
            ["GUE — Higher Studies %", "11.4% (CAY)", "Medium"],
            ["GMS — Median CTC (₹ LPA)", "6.8 LPA (CAY)", "Medium"],
            ["GPHD — PhD graduates", "4 (CAY)", "Low"],
        ]),
        ("OI — Outreach & Inclusivity Sub-metrics", [
            ["Sub-metric", "Value"],
            ["Women students %", "38% (272/720)"],
            ["Women faculty %", "32% (48/150)"],
            ["SC/ST/OBC students %", "45% (324/720)"],
            ["PwD students", "8 (1.1%)"],
            ["Rural district student %", "22%"],
        ]),
    ]


def get_aishe_content():
    return [
        ("Block 1 — Basic Institutional Information", [
            ["Field", "Value"],
            ["AISHE Code", "C-XXXXX"],
            ["Institution Type", "Private Unaided — AICTE Approved"],
            ["Affiliated University", "XYZ Technical University"],
            ["Location", "Urban | Tier-2 City"],
            ["Reference Date (Staff)", "31 December 2024"],
        ]),
        ("Block 3 — Teaching Staff (Discipline Code 7 — Engineering)", [
            ["Designation", "Male", "Female", "SC", "ST", "OBC", "General", "EWS", "Total"],
            ["Professor", "6", "2", "1", "0", "2", "4", "1", "8"],
            ["Associate Professor", "12", "4", "2", "1", "4", "8", "1", "16"],
            ["Assistant Professor", "32", "14", "5", "2", "12", "22", "5", "46"],
            ["Lab Instructor / Demonstrator", "8", "6", "2", "1", "4", "6", "1", "14"],
            ["Total", "58", "26", "10", "4", "22", "40", "8", "84"],
        ]),
        ("Block 5 — Enrollment by Programme × Category", [
            ["Programme", "Year", "Male", "Female", "SC", "ST", "OBC", "Gen", "EWS", "Total"],
            ["B.Tech CSE", "I", "95", "85", "32", "18", "68", "51", "11", "180"],
            ["B.Tech CSE", "II", "92", "80", "30", "17", "65", "50", "10", "172"],
            ["B.Tech ECE", "I", "72", "48", "22", "12", "45", "33", "8", "120"],
        ]),
        ("Block 11 — NBA/NAAC Status", [
            ["Programme", "NBA Status", "Level", "Valid Until", "NAAC Grade"],
            ["B.Tech CSE", "Accredited", "3", "2026-12-31", "3.21 CGPA"],
            ["B.Tech ECE", "Accredited", "2", "2025-06-30", "3.21 CGPA"],
            ["B.Tech MECH", "Applied", "—", "—", "3.21 CGPA"],
        ]),
        ("Block 9 — Financial Data (₹ Lakhs)", [
            ["Category", "Amount (₹ L)"],
            ["Total Annual Income (Fee + Grants + Other)", "1,850"],
            ["Total Annual Expenditure (Salary + Capital + Operations)", "1,620"],
            ["Salary Expenditure", "920"],
            ["Capital Expenditure", "280"],
            ["Scholarships Disbursed", "211"],
        ]),
    ]


def get_ugc_disclosure_content():
    return [
        ("UGC Public Self-Disclosure — 12 Categories (Updated: Dec 2024)", [
            ["Category", "Item", "Status"],
            ["1. Programmes", "Programmes + fee structure", "Published"],
            ["2. Faculty Positions", "Sanctioned + filled + vacancies", "Updated"],
            ["3. Infrastructure", "Area, labs, library", "Published"],
            ["4. Anti-Ragging", "Committee composition + helpline", "Active"],
            ["5. ICC (POSH)", "8 members, composition details", "Published"],
            ["6. SGRC Grievance", "Online portal + Ombudsperson details", "Active"],
            ["7. Grievances Received", "Q1-Q4 summary", "Published"],
            ["8. Scholarships", "Scheme-wise count + amount", "Published"],
            ["9. NEP Adoption", "CBCS implemented, APAAR active", "Published"],
            ["10. NIRF Participation", "Ranked in 2024", "Published"],
            ["11. NAAC Grade", "3.21 CGPA — Accredited", "Published"],
            ["12. Academic Integrity Panel", "Constituted", "Published"],
        ]),
        ("Disclosure Compliance Status", [
            ["Rule", "Status"],
            ["Accessible without login", "✓ Compliant"],
            ["Search-engine indexable", "✓ Compliant"],
            ["Updated within 7 days of change", "✓ Process in place"],
            ["Downloadable PDF on homepage", "✓ Compliant"],
            ["Last updated", str(datetime.datetime.now().strftime("%d %B %Y"))],
        ]),
    ]


def get_epf_esic_content():
    return [
        ("EPF/ESIC Monthly Compliance — Current Month", [
            ["Metric", "Value"],
            ["Filing Month", datetime.datetime.now().strftime("%B %Y")],
            ["Due Date", "15th of following month"],
            ["Total Employees Covered", "220"],
            ["EPF Wage Ceiling", "₹15,000 (revision pending per SC directive Jan 2026)"],
            ["ESIC Wage Ceiling", "₹21,000"],
            ["Code on Wages Status", "Basic ≥ 50% CTC implemented from Nov 2025"],
        ]),
        ("EPF Contribution Breakup", [
            ["Component", "Employee %", "Employer %", "Amount (₹ L)"],
            ["EPF", "12%", "3.67%", "18.5"],
            ["EPS (Pension)", "—", "8.33%", "—"],
            ["EDLI (Insurance)", "—", "0.50%", "—"],
            ["Admin charges", "—", "0.50%", "—"],
            ["Total EPF", "12%", "12.00%", "18.5 + 18.5 = 37.0"],
        ]),
        ("ESIC Contribution Breakup", [
            ["Component", "Employee %", "Employer %", "Estimated Amount (₹ L)"],
            ["ESIC", "0.75%", "3.25%", "Employee: 0.8 | Employer: 3.5"],
        ]),
        ("ECR Filing Status", [
            ["Month", "Filing Date", "Challan No.", "Amount (₹ L)", "Status"],
            ["November 2024", "14 Dec 2024", "ECR-NOV-001", "41.3", "✓ Filed on time"],
            ["October 2024", "15 Nov 2024", "ECR-OCT-001", "40.8", "✓ Filed on time"],
            ["September 2024", "14 Oct 2024", "ECR-SEP-001", "40.5", "✓ Filed on time"],
        ]),
        ("Compliance Health", [
            ["Item", "Status"],
            ["All employees with UAN", "98% (217/220) — 3 pending Aadhaar seeding"],
            ["Basic ≥ 50% CTC", "100% compliant (Code on Wages Nov 2025)"],
            ["Late filings in last 12 months", "0"],
            ["Outstanding interest/damages", "Nil"],
        ]),
    ]


def get_fire_safety_content():
    return [
        ("Fire NOC Details", [
            ["Item", "Value"],
            ["NOC Number", "FIRE-NOC-2024-XYZ-001"],
            ["Issuing Authority", "District Fire Safety Officer"],
            ["Issue Date", "01 January 2024"],
            ["Valid Until", "31 December 2025"],
            ["Buildings Covered", "Main Block (G+4), Lab Block (G+3), Library (G+1), Hostel A & B"],
            ["Governing Standard", "NBC 2016 Part 4 — Fire & Life Safety"],
        ]),
        ("Fire Equipment Inventory", [
            ["Equipment", "Type", "Count", "Last Refill/Service", "AMC Vendor", "Status"],
            ["Fire Extinguishers", "ABC Powder (4kg)", "85", "July 2024", "SafeGuard Pvt. Ltd.", "✓ Current"],
            ["CO2 Extinguishers", "CO2 (2kg)", "30", "July 2024", "SafeGuard Pvt. Ltd.", "✓ Current"],
            ["Fire Hydrants", "Internal + External", "24", "Annual inspection done", "Municipal Corp.", "✓ Current"],
            ["Sprinklers", "Wet pipe system", "180 heads", "Dec 2024", "SafeGuard Pvt. Ltd.", "✓ Current"],
            ["Smoke Detectors", "Optical type", "240", "Dec 2024", "SafeGuard Pvt. Ltd.", "✓ Current"],
            ["Fire Alarm Panels", "Addressable", "6", "Dec 2024", "SafeGuard Pvt. Ltd.", "✓ Current"],
        ]),
        ("Evacuation & Drill Records", [
            ["Drill Date", "Participating Buildings", "Participants", "Evacuation Time", "Issues Found", "Corrective Action"],
            ["15 Sep 2024", "All blocks", "850 (staff + students)", "4 min 20 sec", "Exit door in Lab Block 3rd floor slow to open", "Replaced door closer — Oct 2024"],
            ["15 Mar 2024", "Main Block + Lab Block", "620", "3 min 55 sec", "None", "—"],
        ]),
        ("Escape Route Compliance", [
            ["Requirement (NBC 2016 Part 4)", "Status"],
            ["Escape route width ≥ 1.5m", "✓ All routes 2.0m+"],
            ["Emergency lighting at all exits", "✓ 48 units installed"],
            ["Assembly points marked", "✓ 4 assembly points — capacity 300 each"],
            ["Staff trained in fire fighting", "85% (128/150 faculty)"],
        ]),
    ]


def get_posh_report_content():
    return [
        ("ICC (Internal Complaints Committee) Composition", [
            ["Member", "Designation", "Gender", "Role in ICC", "Appointment Date", "Tenure"],
            ["Dr. A. Krishnan", "Professor (Senior Woman Faculty)", "Female", "Presiding Officer", "01 Jan 2023", "3 years"],
            ["Prof. B. Nair", "Associate Professor", "Male", "Member (Faculty)", "01 Jan 2023", "3 years"],
            ["Dr. C. Singh", "Assistant Professor", "Female", "Member (Faculty)", "01 Jan 2023", "3 years"],
            ["Mr. D. Rao", "Administrative Officer", "Male", "Member (Non-teaching)", "01 Jan 2023", "3 years"],
            ["Ms. E. Pillai", "Librarian", "Female", "Member (Non-teaching)", "01 Jan 2023", "3 years"],
            ["Mr. F. Verma", "Student Rep (Final Year)", "Male", "Member (Student)", "01 Jul 2024", "1 year"],
            ["Ms. G. Nair", "Student Rep (Third Year)", "Female", "Member (Student)", "01 Jul 2024", "1 year"],
            ["Adv. H. Sharma", "NGO — Legal Expert", "Female", "External Member", "01 Jan 2023", "3 years"],
        ]),
        ("ICC Compliance Metrics", [
            ["Metric", "Required", "Actual", "Status"],
            ["Total members", "≥ 8", "8", "✓ Compliant"],
            ["Women members %", "≥ 50%", "62.5% (5/8)", "✓ Compliant"],
            ["Presiding Officer", "Senior woman faculty", "Dr. A. Krishnan", "✓ Compliant"],
            ["External member", "NGO/legal background", "Adv. H. Sharma (NGO)", "✓ Compliant"],
            ["Tenure", "3 years", "Jan 2023 — Dec 2025", "✓ Current"],
        ]),
        ("Complaint Log (Calendar Year 2024)", [
            ["Sl.", "Date Received", "Category", "Status", "Days Taken", "Outcome"],
            ["1", "15 Mar 2024", "Staff complaint (verbal harassment)", "Resolved", "28 days", "Counselling + written warning"],
            ["2", "02 Aug 2024", "Student complaint (bullying)", "Resolved", "35 days", "Disciplinary action"],
            ["Total", "2 complaints", "—", "2/2 resolved", "Avg: 31 days", "All within 90-day limit"],
        ]),
        ("Training & Awareness (2024)", [
            ["Activity", "Date", "Participants", "Topics Covered"],
            ["Orientation for new faculty", "Jul 2024", "18 new faculty", "POSH Act, complaint procedure, zero tolerance"],
            ["Student awareness session", "Aug 2024", "340 students (freshers)", "Rights, complaint portal, ICC contact"],
            ["Online training (SAKSHAM portal)", "Sep 2024", "95 staff", "UGC POSH regulations"],
        ]),
    ]


def get_data_consistency_content():
    return [
        ("Cross-Regulatory Data Consistency Matrix — Faculty Count (ZERO TOLERANCE)", [
            ["Data Element", "AICTE (Faculty Portal)", "NAAC (SSR Cr2)", "NIRF (TLR)", "AISHE (Block 3)", "Match?"],
            ["Total Teaching Faculty", "150", "150", "150", "150", "✓ CONSISTENT"],
            ["Professors", "8", "8", "8", "8", "✓ CONSISTENT"],
            ["Associate Professors", "16", "16", "16", "16", "✓ CONSISTENT"],
            ["Assistant Professors", "46", "46", "46", "46", "✓ CONSISTENT"],
            ["Faculty with PhD", "78", "78", "78", "78", "✓ CONSISTENT"],
        ]),
        ("Cross-Regulatory Data Consistency — Student Enrollment", [
            ["Programme + Year", "AICTE (EoA)", "NAAC (SSR Cr5)", "NIRF (OI)", "AISHE (Block 5)", "Match?"],
            ["B.Tech Total", "720", "720", "720", "720", "✓ CONSISTENT"],
            ["Women students", "272", "272", "272", "272", "✓ CONSISTENT"],
            ["SC/ST/OBC/EWS students", "324", "324", "324", "324", "✓ CONSISTENT"],
        ]),
        ("Cross-Regulatory Data Consistency — Research Publications", [
            ["Metric", "NAAC (Cr3)", "NIRF (RPC)", "Discrepancy", "Tolerance"],
            ["Scopus/WoS pubs (3-yr)", "115", "113", "+2", "≤ 2 (date cutoff acceptable)"],
            ["Citations", "724", "718", "+6", "⚠ Verify cutoff date"],
        ]),
        ("Cross-Regulatory Data Consistency — Campus Area", [
            ["Metric", "AICTE", "NAAC", "AISHE", "Discrepancy", "Tolerance"],
            ["Campus area (acres)", "12.5", "12.5", "12.5", "0", "≤ 0.05 acres"],
            ["Built-up area (sqm)", "18,500", "18,500", "18,500", "0", "Exact match"],
        ]),
        ("Discrepancy Action Items", [
            ["Body", "Data Point", "Issue", "Action", "Owner", "Deadline"],
            ["NIRF", "Citations (718 vs NAAC 724)", "6-citation gap — check cutoff dates", "Verify Scopus API cutoff for NIRF window", "Research Cell", "Before Mar 16"],
            ["AICTE Faculty ID", "3 faculty pending Aadhaar-PAN link", "Will not count for SFR until resolved", "Contact HR to expedite Aadhaar seeding", "HR Head", "Within 7 days"],
        ]),
    ]


def get_accreditation_readiness_content():
    return [
        ("Overall Accreditation Readiness Score", [
            ["Regulatory Body", "Score (/100)", "RAG Status", "Critical Gaps", "Predicted Score +30 days"],
            ["AICTE EoA", "88", "🟢 GREEN", "3 faculty Aadhaar pending", "92"],
            ["NBA (B.Tech CSE)", "74", "🟡 AMBER", "PO4 & PO5 below 60%", "79"],
            ["NAAC (SSR)", "71", "🟡 AMBER", "DVV risk on citations", "74"],
            ["NIRF Ranking", "68", "🟡 AMBER", "IPR score low (7 vs target 15 patents)", "70"],
            ["AISHE DCF-II", "95", "🟢 GREEN", "None", "95"],
            ["Labour (EPF/ESIC)", "98", "🟢 GREEN", "3 UAN pending", "99"],
            ["State Affiliation", "85", "🟢 GREEN", "Fire NOC renewal due Dec 2025", "86"],
            ["Overall Composite Score", "80", "🟡 AMBER", "5 critical items pending", "84"],
        ]),
        ("Top 5 Priority Action Items", [
            ["Priority", "Area", "Issue", "Action", "Owner", "Days to Fix", "Cost Estimate"],
            ["P1 — CRITICAL", "NBA OBE", "PO4 at 58.3% (below 60% threshold)", "Add 2 PO4-mapped mini-projects in Sem V", "HOD CSE", "60 days", "₹0 (curriculum change)"],
            ["P2 — HIGH", "AICTE Faculty ID", "3 faculty Aadhaar-PAN not linked", "HR to follow up with faculty this week", "HR Head", "7 days", "₹0"],
            ["P3 — HIGH", "NAAC DVV risk", "Citations: NAAC 724 vs NIRF 718", "Align Scopus cutoff dates before submission", "Research Cell", "14 days", "₹0"],
            ["P4 — MEDIUM", "NIRF IPR", "7 patents granted vs 15 target for full marks", "File 3 pending applications, fast-track 2", "IP Cell", "90 days", "₹1.5L filing fees"],
            ["P5 — MEDIUM", "Fire NOC", "NOC expires Dec 2025 — 6 months remaining", "Initiate renewal — collect equipment certificates", "Admin (Estates)", "30 days", "₹25K"],
        ]),
        ("Compliance Calendar — Next 90 Days", [
            ["Days", "Deadline", "Activity", "Risk Level", "Owner"],
            ["7 days", "Immediate", "3 faculty Aadhaar-PAN links", "HIGH", "HR Head"],
            ["14 days", "Immediate", "NIRF citation discrepancy resolve", "MEDIUM", "Research Cell"],
            ["30 days", "Aug 2026", "Fire NOC renewal initiation", "MEDIUM", "Admin (Estates)"],
            ["45 days", "Aug 2026", "NIRF DCS opens (Jan next year prep)", "HIGH", "IQAC Coordinator"],
            ["60 days", "Sep 2026", "OBE gap action plan implement", "HIGH", "HOD CSE"],
            ["90 days", "Sep 2026", "IQAC Quarterly Meeting Q3", "MEDIUM", "IQAC Coordinator"],
        ]),
    ]


def get_iqac_meeting_content():
    return [
        ("IQAC Meeting Details", [
            ["Item", "Value"],
            ["Meeting No.", "IQAC-Q2-2024-25"],
            ["Date", "15 October 2024"],
            ["Venue", "Conference Hall, Admin Block"],
            ["Members Present", "10 out of 14 (71.4% quorum — ✓ meets 2/3 minimum)"],
            ["Chairperson", "Principal Dr. M.K. Reddy"],
            ["IQAC Coordinator", "Dr. S. Patel"],
            ["External Member Present", "Prof. D. Joshi (Industry Expert)"],
        ]),
        ("Agenda & Resolutions", [
            ["Agenda Item", "Discussion Summary", "Resolution"],
            ["1. Review of Q1 ATR", "6/8 Q1 actions completed; 2 in progress", "Extended deadline for 2 items by 30 Nov 2024"],
            ["2. NAAC AQAR 2023-24 data compilation", "All 7 criteria data 85% complete", "Target completion by 15 Dec 2024 for Dec 31 deadline"],
            ["3. NBA SAR C3 attainment data", "PO4 below threshold — corrective plan needed", "HOD CSE to present action plan by 30 Oct 2024"],
            ["4. NIRF DCS preparation", "Data for Jan 2025 submission to begin", "IQAC Coordinator to lead task force"],
            ["5. New AICTE APAAR upload", "89% students have APAAR ID", "CoE to complete remaining 11% by Nov 2024"],
        ]),
        ("Action Taken Report (ATR) — Previous Meeting Q1", [
            ["Action Item", "Owner", "Deadline", "Status", "Evidence"],
            ["Add SWAYAM courses to curriculum", "HOD CSE", "31 Aug 2024", "✓ Completed", "BOS minutes Aug 2024"],
            ["Initiate NBA Pre-Qualifier data prep", "NBA Coordinator", "30 Sep 2024", "✓ Completed", "Pre-qualifier form submitted"],
            ["Faculty PhD pipeline tracking", "HR Head", "31 Oct 2024", "In Progress", "3 faculty registered for PhD"],
            ["Fire drill Q2", "Admin (Estates)", "15 Sep 2024", "✓ Completed", "Drill report attached"],
        ]),
        ("Upcoming IQAC Schedule", [
            ["Quarter", "Target Date", "Key Focus"],
            ["Q3 (Jan 2025)", "15 January 2025", "AQAR post-submission review; NIRF final data"],
            ["Q4 (Apr 2025)", "15 April 2025", "Annual IQAC report; new AY planning"],
        ]),
    ]


def get_faculty_qualification_content():
    return [
        ("Faculty Qualification & Retention Overview", [
            ["Metric", "Value", "AICTE Norm", "Status"],
            ["Total Regular Faculty", "150", "SFR ≤ 1:20", "✓"],
            ["PhD holders", "78 (52%)", "Maximize; PhD mandatory for Professor", "✓"],
            ["NET/GATE qualified (Asst. Prof)", "42 (30% of Asst Profs)", "NET/GATE OR PhD for Asst Prof", "✓"],
            ["Faculty retention (5-year)", "82%", "Maximize", "✓"],
            ["Faculty pursuing PhD", "18 registered", "Encourage", "✓ Good pipeline"],
        ]),
        ("PhD Pipeline Tracker", [
            ["Faculty", "Department", "PhD Status", "University", "Registered Year", "Expected Award"],
            ["Ms. S. Rao", "CSE", "Registered (pursuing)", "IIT-M", "2022", "2026"],
            ["Mr. T. Kumar", "ECE", "Thesis submitted", "NIT-T", "2020", "2025 (imminent)"],
            ["Ms. U. Menon", "MECH", "Coursework", "Local University", "2023", "2027"],
        ]),
        ("Retirement Forecast (NBA/AICTE Alert)", [
            ["Faculty", "Dept", "Designation", "Retirement Date", "Days Remaining", "Alert Level"],
            ["Dr. V. Rao", "MECH", "Professor", "31 May 2025", "365", "🟡 AMBER — 1 year"],
            ["Dr. W. Sharma", "CSE", "Professor", "31 Dec 2025", "550", "🟢 GREEN — plan hiring"],
        ]),
        ("Cadre Compliance (1:2:6 ratio check)", [
            ["Department", "Professors", "Assoc. Professors", "Asst. Professors", "Required Ratio", "Actual Ratio", "Status"],
            ["CSE", "3", "6", "16", "1:2:6", "1:2:5.3", "✓ Compliant"],
            ["ECE", "2", "4", "12", "1:2:6", "1:2:6", "✓ Compliant"],
            ["MECH", "2", "4", "12", "1:2:6", "1:2:6", "✓ Compliant"],
        ]),
    ]


@router.get("/list", response_model=List[str], dependencies=[Depends(rbac.require_permission(Permission.VIEW_ANALYTICS))])
async def list_reports(role: Optional[str] = None):
    """
    List available report templates, optionally filtered by user role.
    """
    if not role:
        return ALL_REPORTS
    
    role_key = role.lower()
    
    # Principal, Orchestrator, and Accreditation Manager see everything (or almost everything)
    if role_key in ["principal", "orchestrator", "system administrator", "accreditation_manager"]:
        return ALL_REPORTS
        
    # Return specific reports if mapping exists
    if role_key in ROLE_TEMPLATE_MAPPING:
        return ROLE_TEMPLATE_MAPPING[role_key]
        
    # Default fallback (maybe empty or safe public reports)
    return ALL_REPORTS

def get_naac_content():
    return [
        ("Criterion 1: Curricular Aspects", [
            ["Metric", "Details"],
            ["1.1 Curriculum Design", "Aligned with AICTE & NEP 2020"],
            ["1.2 Academic Flexibility", "CBCS Implemented, Open Electives Offered"],
            ["1.3 Curriculum Enrichment", "Value-added courses: 4/semester"]
        ]),
        ("Criterion 2: Teaching-Learning & Evaluation", [
            ["Metric", "Statistics"],
            ["Student Enrollment", "95% (580/600)"],
            ["Student-Teacher Ratio", "1:15 (Compliant)"],
            ["Teaching Methods", "Flipped Classroom, PBL, Experiential"],
            ["Evaluation", "Continuous Assessment (30%), End Sem (70%)"]
        ]),
        ("Criterion 3: Research, Innovations & Extension", [
            ["Indicator", "Status"],
            ["Research Grants", "₹2.5 Cr Received"],
            ["Publications", "100+ (SCI/Scopus)"],
            ["Incubation", "15 Startups, ₹2 Cr Revenue"]
        ]),
        ("Criterion 4: Infrastructure", [
            ["Facility", "Capacity/Count"],
            ["Classrooms", "60 (100% ICT Enabled)"],
            ["Labs", "60 Specialized Labs"],
            ["Library", "50,000+ Books, Digital Access"]
        ]),
        ("Criterion 5: Student Support", [
            ["Support", "Details"],
            ["Scholarships", "₹2.11 Cr Disbursed"],
            ["Placements", "78% Placed (Avg ₹6.8 LPA)"],
            ["Higher Studies", "14% (Foreign/IITs)"]
        ]),
        ("Criterion 6: Governance", [
             ["Aspect", "Status"],
             ["Vision", "Globally Recognized Excellence"],
             ["IQAC", "Functional, Quarterly Meetings"]
        ]),
         ("Criterion 7: Institutional Values", [
             ["Value", "Practice"],
             ["Green Campus", "Solar Power, Rainwater Harvesting"],
             ["Best Practices", "Industry-Integrated Curriculum"]
        ])
    ]

def get_nba_content():
    return [
        ("Criterion 1: Vision, Mission & PEOs", [
            ["Component", "Statement"],
            ["PEO1", "Professional Excellence"],
            ["PEO2", "Innovation & Entrepreneurship"],
            ["PEO3", "Continuous Learning"]
        ]),
        ("Criterion 2: Program Curriculum", [
            ["Metric", "Status"],
            ["Total Credits", "160 (AICTE Norms)"],
            ["Curriculum Revision", "Every 2 Years (Industry Input)"]
        ]),
        ("Criterion 3: Course Outcomes (COs)", [
            ["Metric", "Calculation Method"],
            ["Direct Assessment", "80% (Exams, Labs)"],
            ["Indirect Assessment", "20% (Surveys)"],
            ["Target Attainment", "Level 3 (>70%)"]
        ]),
        ("Criterion 4: Student Performance", [
             ["Metric", "Value"],
             ["Success Rate", "94%"],
             ["Placement Rate", "80.5%"],
             ["First Year Retention", "98%"]
        ])
    ]

def get_aqar_content():
    return [
        ("Part A: Institutional Data", [
            ["Data Point", "Value"],
            ["Academic Year", "2024-25"],
            ["IQAC Composition", "12 Members (Compliant)"],
            ["IQAC Meetings Held", "4"]
        ]),
        ("Criterion 1: Curricular Aspects", [
            ["Metric", "Status"],
            ["New Courses Introduced", "5 (AI/ML, IoT)"],
            ["Syllabus Revision", "Completed in June 2024"],
            ["Feedback System", "Collected & Analyzed"]
        ]),
        ("Criterion 2: Teaching-Learning & Evaluation", [
            ["Metric", "Statistics"],
            ["Total Permanent Faculty", "150"],
            ["Faculty with Ph.D.", "120 (80%)"],
            ["Student-Full Time Teacher Ratio", "1:15"],
            ["Pass Percentage", "94%"]
        ]),
        ("Criterion 3: Research, Innovations & Extension", [
            ["Metric", "Details"],
            ["Research Funds Sanctioned", "Rs. 1.5 Crores"],
            ["Workshops on IPR", "12 Conducted"],
            ["Extension Activities", "30 (NSS/NCC)"]
        ]),
        ("Criterion 4: Infrastructure & Learning Resources", [
             ["Facility", "Upgrade Status"],
             ["Library Automation", "Fully Automated (ILMS)"],
             ["ICT Classrooms", "100% Coverage"],
             ["Bandwidth", "1 Gbps Leased Line"]
        ]),
        ("Criterion 5: Student Support & Progression", [
            ["Metric", "Achievement"],
            ["Scholarships", "500 Students Benefited"],
            ["Capabilities Enhancement", "Soft Skills, Yoga, Tech Training"],
            ["Placements", "485 Students Placed"]
        ]),
         ("Criterion 6: Governance, Leadership & Management", [
             ["Area", "Initiative"],
             ["E-Governance", "Implemented in Finance, Admin, Exam"],
             ["Faculty Welfare", "Medical, Transport Provided"]
        ]),
        ("Criterion 7: Institutional Values & Best Practices", [
             ["Value", "Action"],
             ["Gender Equity", "CCTV, Common Rooms, Counseling"],
             ["Green Campus", "Solar, LED, No Plastic"]
        ])
    ]

def get_aicte_content():
    return [
        ("1. AICTE File Details", [
            ["Field", "Value"],
            ["File No", "F.No. South-West/1-123456789/2024/EOA"],
            ["Date & Period", "25-June-2024 for AY 2024-25"]
        ]),
         ("2. Institutional Info", [
            ["Field", "Value"],
            ["Name", "Institute of Engineering & Technology"],
            ["Address", "City X, State Y - 560001"]
        ]),
        ("3. Governance", [
            ["Committee", "Status"],
            ["Governing Body", "Constituted & Meetings Held (2/Year)"],
            ["Grievance Redressal", "Online Mechanism Available"]
        ]),
        ("4. Programmes", [
             ["Programme", "Intake", "Duration"],
             ["B.Tech - CS", "180", "4 Years"],
             ["B.Tech - ECE", "120", "4 Years"]
        ])
    ]


# --- New AI & Custom Generator Endpoints ---

@router.post("/suggestions")
async def get_report_suggestions(request: SuggestionRequest):
    """
    Returns content for a report template. 
    Prioritizes static statutory templates if available, otherwise uses LLM.
    """
    template_lower = request.template.lower()

    # Check for Static Statutory Templates first
    content = None

    # ── AICTE ──────────────────────────────────────────────────────────────────
    if "eoa" in template_lower or ("aicte" in template_lower and "application" in template_lower):
        content = get_aicte_eoa_content()
    elif "mandatory disclosure" in template_lower or ("aicte" in template_lower and "disclosure" in template_lower):
        content = get_aicte_content()

    # ── NBA ────────────────────────────────────────────────────────────────────
    elif "pre-qualifier" in template_lower or "prequalifier" in template_lower or "pre qualifier" in template_lower:
        content = get_nba_prequalifier_content()
    elif "sar" in template_lower and "criterion 1" in template_lower:
        content = get_nba_sar_c1_content()
    elif "sar" in template_lower and "criterion 3" in template_lower:
        content = get_nba_sar_c3_content()
    elif "sar" in template_lower and "criterion 4" in template_lower:
        content = get_nba_sar_c4_content()
    elif ("sar" in template_lower and ("criterion 5" in template_lower or "criterion 6" in template_lower or "faculty" in template_lower)):
        content = get_nba_sar_faculty_content()
    elif "sar" in template_lower or ("nba" in template_lower and "self-assessment" in template_lower):
        content = get_nba_content()

    # ── OBE CO-PO ──────────────────────────────────────────────────────────────
    elif "co-po" in template_lower or "co po" in template_lower or "attainment" in template_lower or "po-pso" in template_lower:
        content = get_co_po_attainment_content()
    elif "attribute" in template_lower or "tracking" in template_lower:
        content = get_ga_content()

    # ── NAAC ───────────────────────────────────────────────────────────────────
    elif "iiqa" in template_lower or "naac readiness" in template_lower:
        content = get_naac_content()
    elif "aqar" in template_lower:
        content = get_aqar_content()
    elif "naac" in template_lower and "self-study" in template_lower:
        content = get_naac_content()

    # ── NIRF ───────────────────────────────────────────────────────────────────
    elif "nirf" in template_lower:
        content = get_nirf_content()

    # ── AISHE ──────────────────────────────────────────────────────────────────
    elif "aishe" in template_lower or "dcf" in template_lower:
        content = get_aishe_content()

    # ── UGC ────────────────────────────────────────────────────────────────────
    elif "ugc" in template_lower and "disclosure" in template_lower:
        content = get_ugc_disclosure_content()

    # ── Labour Compliance ─────────────────────────────────────────────────────
    elif "epf" in template_lower or "esic" in template_lower or "labour" in template_lower:
        content = get_epf_esic_content()

    # ── Fire Safety ────────────────────────────────────────────────────────────
    elif "fire" in template_lower:
        content = get_fire_safety_content()

    # ── POSH ──────────────────────────────────────────────────────────────────
    elif "posh" in template_lower or "icc" in template_lower:
        content = get_posh_report_content()

    # ── Cross-regulatory Data Consistency ─────────────────────────────────────
    elif "data consistency" in template_lower or "cross-regulatory" in template_lower:
        content = get_data_consistency_content()

    # ── Accreditation Readiness Scorecard ─────────────────────────────────────
    elif "readiness scorecard" in template_lower or ("accreditation" in template_lower and "scorecard" in template_lower):
        content = get_accreditation_readiness_content()

    # ── IQAC ──────────────────────────────────────────────────────────────────
    elif "iqac" in template_lower:
        content = get_iqac_meeting_content()

    # ── Faculty ───────────────────────────────────────────────────────────────
    elif "faculty qualification" in template_lower or "faculty retention" in template_lower:
        content = get_faculty_qualification_content()
    elif "faculty dev" in template_lower:
        content = get_faculty_dev_content()

    # ── State Affiliation ─────────────────────────────────────────────────────
    elif "affiliation" in template_lower:
        content = get_annual_report_content()  # placeholder

    # ── Classic reports ───────────────────────────────────────────────────────
    elif "annual" in template_lower and "library" not in template_lower:
        content = get_annual_report_content()
    elif "financial" in template_lower:
        content = get_financial_audit_content()
    elif "academic audit" in template_lower:
        content = get_academic_audit_content()
    elif "ragging" in template_lower:
        content = get_anti_ragging_content()
    elif "sc" in template_lower and "st" in template_lower:
        content = get_sc_st_cell_content()
    elif "exam" in template_lower and "results" in template_lower:
        content = get_exam_results_content()
    elif "placement" in template_lower:
        content = get_placement_report_content()
    elif "feedback" in template_lower:
        content = get_student_feedback_content()
    elif "library" in template_lower:
        content = get_library_report_content()
    elif "infrastructure" in template_lower:
        content = get_infra_util_content()
    elif "research" in template_lower:
        content = get_research_pub_content()
    elif "grievance" in template_lower:
        content = get_grievance_content()
    elif "women" in template_lower:
        content = get_women_cell_content()
        
    if content:
        return {"content": content}

    # fallback to LLM for unknown templates
    llm = LLMService()
    
    prompt = f"""You are an expert academic administrator. Generate realistic, detailed, and compliant content for a '{request.template}' report for an Indian Engineering College.
    
    Structure the response strictly as a JSON object with a single key 'content' which is a list of sections.
    Each section is a tuple (or list) containing: [Section Title, Table Data].
    Table Data is a List of Lists (rows), where the first row is headers.
    
    Example Schema:
    {{
      "content": [
        ["Section 1: Overview", [ ["Metric", "Value"], ["Students", "500"] ]],
        ["Section 2: Details", [ ["Item", "Status"], ["Lab", "Active"] ]]
      ]
    }}
    
    Context to include if applicable: {request.context}
    Ensure headers are appropriate for the report type. Generate at least 3-4 sections with 3-5 rows each.
    """
    
    messages = [
        SystemMessage(content="You are a strict JSON generator for ReportLab PDF structures."),
        HumanMessage(content=prompt)
    ]
    
    try:
        response = await llm.get_response(
            role="ReportGenerator",
            query=prompt,
            context="System Report Generation",
            force_mock=False 
        )
        
        content_str = response.content
        # Extract JSON from code block
        if "```json" in content_str:
            json_str = content_str.split("```json")[1].split("```")[0].strip()
            data = json.loads(json_str)
            return data
        elif "```" in content_str:
             json_str = content_str.split("```")[1].split("```")[0].strip()
             try:
                data = json.loads(json_str)
                return data
             except:
                pass
        
        # Fallback if no code block but response is valid
        # Try to parse raw content
        try:
             # Look for '{'
             start = content_str.find('{')
             end = content_str.rfind('}') + 1
             if start != -1 and end != -1:
                 return json.loads(content_str[start:end])
        except:
             pass

        print("⚠️ LLM Response parsing failed. Using Fallback.")
        return {"content": get_naac_content()} 
        
    except Exception as e:
        print(f"Report AI Generation Failed: {e}")
        # Fallback to hardcoded
        if "aicte" in request.template.lower(): return {"content": get_aicte_content()}
        if "naac" in request.template.lower(): return {"content": get_naac_content()}
        if "nba" in request.template.lower(): return {"content": get_nba_content()}
        if "aqar" in request.template.lower(): return {"content": get_aqar_content()}
        return {"content": get_naac_content()} # Default

from .accreditation_templates import get_sar_content, get_attainment_content, get_ga_content
from .statutory_templates import (
    get_annual_report_content, get_financial_audit_content, get_academic_audit_content,
    get_anti_ragging_content, get_sc_st_cell_content, get_exam_results_content,
    get_placement_report_content, get_faculty_dev_content, get_student_feedback_content,
    get_library_report_content, get_infra_util_content, get_research_pub_content,
    get_icc_content, get_grievance_content, get_women_cell_content
)

# ... (Previous Helper Functions: get_naac_content, get_nba_content etc.)

# ...

@router.post("/generate", dependencies=[Depends(rbac.require_permission(Permission.GENERATE_REPORTS))])
async def generate_custom_pdf(request: CustomReportRequest):
    """
    Generates a PDF from the provided JSON content.
    Supports mixed content: Tables (list of lists) and Text Paragraphs (strings).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    elements.append(Paragraph(f"{request.template}", styles['Title']))
    elements.append(Spacer(1, 12))

    # Header
    elements.append(Paragraph(f"Generated by: {request.role_name}", styles['Normal']))
    elements.append(Paragraph(f"Date: {datetime.datetime.now().strftime('%Y-%m-%d')}", styles['Normal']))
    elements.append(Paragraph(f"File: {request.filename}", styles['Italic']))
    elements.append(Spacer(1, 24))

    # Content Blocks
    for section_title, content_data in request.content:
        # Title
        if section_title:
             elements.append(Paragraph(str(section_title), styles['Heading2']))
        
        # Content Logic
        if isinstance(content_data, str):
            # Render Text Paragraph
            elements.append(Paragraph(content_data, styles['Normal']))
        elif isinstance(content_data, list):
            # Render Table (Assume List of Lists)
            if content_data and isinstance(content_data[0], list):
                 clean_data = [[str(cell) for cell in row] for row in content_data]
                 t = Table(clean_data)
                 t.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0e0e0')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                    ('GRID', (0, 0), (-1, -1), 1, colors.grey),
                    ('WORDWRAP', (0, 0), (-1, -1), True), # Enable word wrap
                 ]))
                 elements.append(t)
            else:
                 # List of strings? Treat as bullet points
                 for item in content_data:
                     elements.append(Paragraph(f"• {item}", styles['Normal']))
        
        elements.append(Spacer(1, 12))

    # Footer
    elements.append(Spacer(1, 24))
    elements.append(Paragraph("Generated by ERP Agent System", styles['Italic']))

    doc.build(elements)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename={request.filename}"}
    )

@router.get("/download")
async def generate_pdf(
    file: str = Query(..., description="Filename to generate"),
    role_name: str = Query("System Administrator", description="Role requesting the report"),
    report_type: str = Query("generic", description="Type of report template")
):
    """
    Legacy GET: Generates a PDF report based on the requested type and filename using hardcoded data.
    """
    
    content_blocks = []
    file_lower = file.lower()
    
    if "sar" in file_lower or "nba" in file_lower:
        content_blocks = get_sar_content()
    elif "attainment" in file_lower or "performance" in file_lower:
        content_blocks = get_attainment_content()
    elif "attribute" in file_lower or "tracking" in file_lower:
        content_blocks = get_ga_content()
    # Statutory Reports - Category 1: Governance
    elif "annual" in file_lower and "library" not in file_lower:
        content_blocks = get_annual_report_content()
    elif "financial" in file_lower:
        content_blocks = get_financial_audit_content()
    elif "academic audit" in file_lower:
        content_blocks = get_academic_audit_content()
    elif "ragging" in file_lower:
        content_blocks = get_anti_ragging_content()
    elif "sc" in file_lower and "st" in file_lower:
        content_blocks = get_sc_st_cell_content()
        
    # Category 2: Academic
    elif "exam" in file_lower and "results" in file_lower:
        content_blocks = get_exam_results_content()
    elif "placement" in file_lower:
        content_blocks = get_placement_report_content()
    elif "faculty dev" in file_lower:
        content_blocks = get_faculty_dev_content()
    elif "feedback" in file_lower:
        content_blocks = get_student_feedback_content()
        
    # Category 3: Infrastructure
    elif "library" in file_lower:
        content_blocks = get_library_report_content()
    elif "infrastructure" in file_lower:
        content_blocks = get_infra_util_content()
    elif "research" in file_lower or "publication" in file_lower:
        content_blocks = get_research_pub_content()
        
    # Category 4: Student Welfare
    elif "icc" in file_lower or "harassment" in file_lower:
        content_blocks = get_icc_content()
    elif "grievance" in file_lower:
        content_blocks = get_grievance_content()
    elif "women" in file_lower or "empowerment" in file_lower:
        content_blocks = get_women_cell_content()

    elif "aicte" in file_lower or report_type == "aicte":
        content_blocks = get_aicte_content()
    elif "naac" in file_lower or report_type == "naac":
        content_blocks = get_naac_content()
    elif "aqar" in file_lower or report_type == "aqar":
        content_blocks = get_aqar_content()
    elif "nirf" in file_lower or report_type == "nirf":
        content_blocks = [
             ("Student Strength", [["Level", "Male", "Female", "Total"], ["UG", "800", "400", "1200"], ["PG", "100", "50", "150"]]),
             ("Placement & Higher Studies", [["Year", "Placed", "Higher Studies"], ["2023", "450", "50"], ["2022", "420", "40"]])
        ]
    else:
        content_blocks = [
            ("Key Metrics", [["Metric", "Value"], ["System Status", "Operational"], ["Active Workflows", "5"]])
        ]


    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    title_text = file.replace("_", " ").replace(".pdf", "").title()
    elements.append(Paragraph(f"{title_text}", styles['Title']))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Generated by: {role_name}", styles['Normal']))
    elements.append(Paragraph(f"Date: {datetime.datetime.now().strftime('%Y-%m-%d')}", styles['Normal']))
    elements.append(Spacer(1, 24))

    for section_title, table_data in content_blocks:
        elements.append(Paragraph(str(section_title), styles['Heading2']))
        if table_data:
            t = Table(table_data)
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#e0e0e0')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
                ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ]))
            elements.append(t)
        elements.append(Spacer(1, 12))

    elements.append(Spacer(1, 24))
    elements.append(Paragraph("Generated by ERP Agent System", styles['Italic']))

    doc.build(elements)
    buffer.seek(0)
    
    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename={file}"}
    )
