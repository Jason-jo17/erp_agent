
# Category 1: Governance
def get_annual_report_content():
    return [
        ("1. Executive Summary", "A comprehensive overview of the institution's performance during the academic year 2024-25."),
        ("2. Institutional Profile", [
            ["Metric", "Details"],
            ["Vision", "To be a center of excellence..."],
            ["Governance", "Board of Governors (BoG) met 4 times."]
        ]),
        ("3. Academic Highlights", [
            ["Program", "Enrolled", "Trend"],
            ["B.Tech CSE", "180", "Full Capacity"],
            ["B.Tech ECE", "120", "Stationary"]
        ]),
        ("4. Faculty Profile", [
            ["Department", "Total Faculty", "PhD Count"],
            ["CSE", "50", "20"],
            ["ECE", "40", "15"]
        ]),
        ("5. Infrastructure", "New additions include the AI/ML Lab and renovated Library Reading Room."),
        ("6. Research & Publications", "Total 85 publications in Scopus/SCI journals."),
        ("7. Placements", "93% placement rate achieved with an average package of 6.5 LPA."),
        ("8. Student Activities", "Winners of Smart India Hackathon 2024."),
        ("9. Financial Summary", "Detailed in the Financial Audit Report."),
        ("10. Future Roadmap", "Focus on NBA Accreditation renewal and international collaborations.")
    ]

def get_financial_audit_content():
    return [
        ("1. Auditor's Certificate", "We have audited the attached Balance Sheet of [Institute Name] as at 31st March 2025."),
        ("2. Balance Sheet", [
            ["Assets", "Amount (INR)"],
            ["Fixed Assets (Land, Building)", "50,00,00,000"],
            ["Current Assets (Cash, Bank)", "5,00,00,000"],
            ["Usage", "Strictly for educational purposes"]
        ]),
        ("3. Income & Expenditure", [
            ["Head", "Income", "Expenditure"],
            ["Tuition Fees", "15,00,00,000", "-"],
            ["Salaries", "-", "10,00,00,000"],
            ["Infra Maintenance", "-", "2,00,00,000"]
        ]),
        ("4. Fund Utilization", "R&D Fund utilization stands at 95%."),
        ("5. Compliance Certificates", "TDS, GST, and EPF returns filed on time.")
    ]

def get_academic_audit_content():
    return [
        ("1. Curriculum Delivery", "Syllabus coverage is 100%. Lesson plans adhered to."),
        ("2. Teaching-Learning Evaluation", "Student feedback average is 4.2/5. PBL implemented in 40% courses."),
        ("3. Examination & Assessment", [
             ["Exam", "Pass %", "Average Marks"],
             ["Internal 1", "90%", "72%"],
             ["End Semester", "94%", "75%"]
        ]),
        ("4. Faculty Performance", "Average teaching load: 14 hours/week. 2 FDPs attended per faculty avg."),
        ("5. Infrastructure Utilization", "Labs utilized 36 hours/week."),
        ("6. Recommendations", "Increase industry guest lectures. Enhance digital library usage.")
    ]

def get_anti_ragging_content():
    return [
        ("1. Committee Details", [
             ["Name", "Role", "Contact"],
             ["Dr. Principal", "Chairperson", "9876543210"],
             ["Mr. Warden", "Member", "9876543211"]
        ]),
        ("2. Preventive Measures", "Affidavits collected from 100% students/parents. Posters displayed in hostels/canteens."),
        ("3. Incident Report", [
             ["Incidents Reported", "0"],
             ["Action Taken", "N/A"]
        ]),
        ("4. Compliance", "Helpline number 1800-180-5522 is active 24x7.")
    ]

def get_sc_st_cell_content():
    return [
        ("1. Student Demographics", [
             ["Category", "Male", "Female", "Total"],
             ["SC", "40", "20", "60"],
             ["ST", "15", "5", "20"],
             ["OBC", "100", "50", "150"]
        ]),
        ("2. Scholarship Disbursement", "100% of eligible students received state scholarships."),
        ("3. Support Services", "Remedial coaching classes conducted on weekends."),
        ("4. Grievances", "Zero grievances reported related to caste discrimination.")
    ]

# Category 2: Academic
def get_exam_results_content():
    return [
        ("1. Overall Statistics", [
             ["Metric", "Value"],
             ["Pass Percentage", "96%"],
             ["First Class with Dist.", "32%"],
             ["First Class", "67%"]
        ]),
        ("2. Course-wise Analysis", [
             ["Course", "Pass %", "Detained"],
             ["Data Structures", "94%", "2"],
             ["Operating Systems", "92%", "3"]
        ]),
        ("3. Backlog Analysis", "15 students have active backlogs > 2 subjects."),
        ("4. Action Plan", "Remedial classes scheduled for backlog students.")
    ]

def get_placement_report_content():
    return [
        ("1. Placement Statistics", [
             ["Total Eligible", "400"],
             ["Placed", "372"],
             ["Placement %", "93%"]
        ]),
        ("2. Top Recruiters", [
             ["Company", "Offers", "CTC (LPA)"],
             ["TCS", "120", "4.0"],
             ["Amazon", "15", "18.0"],
             ["Google", "2", "25.0"]
        ]),
        ("3. Sector-wise Breakdown", "IT (70%), Core (20%), Consulting (10%)."),
        ("4. Employer Feedback", "Students show strong technical skills but need improvement in soft skills.")
    ]

def get_faculty_dev_content():
    return [
        ("1. Training Summary", [
             ["Faculty Attended FDPs", "48/50"],
             ["Total Man-Hours", "450"]
        ]),
        ("2. Programs Attended", [
             ["Program", "Faculty Count", "Duration"],
             ["AI/ML Workshop", "15", "1 Week"],
             ["OBE Training", "25", "3 Days"]
        ]),
        ("3. Impact Assessment", "Research output increased by 20% post-workshop.")
    ]

def get_student_feedback_content():
    return [
        ("1. Response Statistics", "95% response rate received."),
        ("2. Parameter-wise Analysis", [
             ["Parameter", "Score (5.0)"],
             ["Subject Knowledge", "4.4"],
             ["Teaching Methodology", "4.2"],
             ["Punctuality", "4.5"]
        ]),
        ("3. Action Taken", "Faculty with score < 3.5 have been counseled and nominated for pedagogical training.")
    ]

# Category 3: Infrastructure
def get_library_report_content():
    return [
        ("1. Collection Statistics", [
             ["Item", "Count"],
             ["Books", "25,000"],
             ["Journals", "75"],
             ["E-Resources", "5000+"]
        ]),
        ("2. Usage Statistics", "Average daily footfall: 400. Daily issue/return: 150."),
        ("3. Digital Access", "Remote access enabled via Knimbus/EzProxy."),
        ("4. Budget", "Allocated: 40 Lakhs. Utilized: 38 Lakhs.")
    ]

def get_infra_util_content():
    return [
        ("1. Classroom Utilization", "80% average occupancy during working hours."),
        ("2. Lab Utilization", [ 
             ["Lab", "Utilization %"],
             ["Computer Lab 1", "85%"],
             ["Electronics Lab", "70%"]
        ]),
        ("3. Maintenance", "Preventive maintenance completed in Dec 2024.")
    ]

def get_research_pub_content():
    return [
        ("1. Publications Summary", [
             ["Type", "Count"],
             ["SCI Journals", "15"],
             ["Scopus Journals", "28"],
             ["Conferences", "20"]
        ]),
        ("2. High-Impact Papers", [
             ["Title", "Impact Factor"],
             ["Deep Learning in Healthcare", "6.8"],
             ["IoT Security protocols", "5.2"]
        ]),
        ("3. Patents", "5 Patents granted, 12 filed.")
    ]

# Category 4: Student Welfare
def get_icc_content():
    return [
        ("1. Committee Details (MANDATORY)", [
             ["Role", "Name"],
             ["Presiding Officer", "Prof. Sarah J (Senior Faculty)"],
             ["External Member", "Ms. NGO Rep"]
        ]),
        ("2. Compliance", "Committee constituted as per SH Act 2013. Annual Report submitted to District Officer."),
        ("3. Complaint Status", [
             ["Complaints Received", "0"],
             ["Resolved", "0"],
             ["Pending", "0"]
        ]),
        ("4. Awareness", "Gender sensitization workshop conducted for all freshers.")
    ]

def get_grievance_content():
    return [
        ("1. Grievance Summary", [
             ["Type", "Count", "Resolved"],
             ["Academic", "5", "5"],
             ["Infrastructure", "3", "3"],
             ["Mess/Hostel", "2", "2"]
        ]),
        ("2. Resolution Time", "Average resolution time: 5 days (Target: 7 days)."),
        ("3. Escalations", "Zero escalations to management.")
    ]

def get_women_cell_content():
    return [
        ("1. Committee", "Coordinator: Prof. Anjali M."),
        ("2. Programs Conducted", [
             ["Event", "Date", "Participants"],
             ["Self Defense Training", "Aug 2024", "200"],
             ["Health Camp", "Oct 2024", "350"]
        ]),
        ("3. Safety Measures", "CCTV installed in all corridors. Ladies waiting room renovated.")
    ]

