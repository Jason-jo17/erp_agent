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
ROLE_TEMPLATE_MAPPING = {
    "hod": [
        "Student Performance Report",
        "Budget Utilization Report",
        "NBA Self-Assessment Report",
        "NAAC Self-Study Report (SSR)",
        "AQAR (NAAC) Report",
        "Student Feedback Analysis Report",
        "Institution Overview"
    ],
    "faculty": [
        "Student Performance Report",
        "AQAR (NAAC) Report",
        "Institution Overview"
    ],
    "admin": [
        "Budget Utilization Report",
        "NIRF Data Report",
        "AICTE Mandatory Disclosure",
        "Infrastructure Utilization Report"
    ],
    "iqac": [
        "Academic Audit Report",
        "Student Feedback Analysis Report",
        "AQAR (NAAC) Report",
        "NAAC Self-Study Report (SSR)",
        "NBA Self-Assessment Report",
        "NIRF Data Report"
    ],
    "coe": [
        "Examination Results Analysis Report",
        "Student Performance Report",
        "Institution Overview"
    ],
    "finance": [
        "Financial Audit Report",
        "Budget Utilization Report",
        "Institution Overview"
    ],
    "student": [
        "Student Performance Report"
    ],
    "tpo": [
        "Placement Report"
    ],
    "librarian": [
        "Library Annual Report"
    ],
    "anti_ragging": [
        "Anti-Ragging Report"
    ],
    "sc_st_cell": [
        "SC/ST/OBC Cell Report"
    ],
    "icc": [
        "Internal Complaints Committee (ICC) Report"
    ],
    "grievance": [
        "Grievance Redressal Report"
    ],
    "women_cell": [
        "Women Empowerment Cell Report"
    ],
    "accreditation_manager": [
        "NBA Self-Assessment Report",
        "NAAC Self-Study Report (SSR)",
        "Graduate Attribute Tracking Report",
        "MBGL Level Assessment Report",
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
        "Internal Complaints Committee (ICC) Report",
        "Grievance Redressal Report",
        "Research Publication Report",
        "Institution Overview"
    ]
}

ALL_REPORTS = [
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

@router.get("/list", response_model=List[str])
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
    if "sar" in template_lower or "nba" in template_lower:
        content = get_sar_content()
    elif "attainment" in template_lower or "po-pso" in template_lower:
        content = get_attainment_content()
    elif "attribute" in template_lower or "tracking" in template_lower:
        content = get_ga_content()
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
    elif "faculty dev" in template_lower:
        content = get_faculty_dev_content()
    elif "feedback" in template_lower:
        content = get_student_feedback_content()
    elif "library" in template_lower:
        content = get_library_report_content()
    elif "infrastructure" in template_lower:
        content = get_infra_util_content()
    elif "research" in template_lower:
        content = get_research_pub_content()
    elif "icc" in template_lower:
        content = get_icc_content()
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

@router.post("/generate")
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
