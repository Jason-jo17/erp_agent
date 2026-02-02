
def get_sar_content():
    return [
        ("EXECUTIVE SUMMARY", "The B.Tech Computer Science & Engineering program at [Institution Name] was established in [Year] with the vision of producing globally competent engineers. The program is affiliated with [University] and approved by AICTE."),
        ("Key Achievements", [
            ["Metric", "Details"],
            ["Avg PO Attainment", "75% (Target: >60%)"],
            ["Student Pass Percentage", "96%"],
            ["Placement", "93% (Avg Package: 6.5 LPA)"],
            ["Faculty with PhD", "40% (20/50)"],
            ["Research Publications", "85 (Last 3 Years)"]
        ]),
        ("CRITERION 1: VISION, MISSION & PEOs", "The Vision and Mission of the department are aligned with the institutional goals. Program Educational Objectives (PEOs) are defined to measure long-term graduate success."),
        ("Program Educational Objectives (PEOs)", [
            ["PEO", "Statement"],
            ["PEO1", "Graduates will be employed in professional careers in CS."],
            ["PEO2", "Graduates will demonstrate ethics and communication."],
            ["PEO3", "Graduates will engage in lifelong learning."]
        ]),
        ("CRITERION 2: PROGRAM OUTCOMES (POs)", "The program outcomes are mapped to the 12 Washington Accord Graduate Attributes. Attainment is calculated using Direct (80%) and Indirect (20%) methods."),
        ("PO Attainment Summary", [
            ["PO", "Score (%)", "Status"],
            ["PO1 - Knowledge", "75.2", "Achieved"],
            ["PO2 - Analysis", "72.8", "Achieved"],
            ["PO3 - Design", "68.5", "Achieved"],
            ["PO4 - Investigation", "65.3", "Achieved"],
            ["PO5 - Tools", "78.4", "Achieved"],
            ["PO6 - Life-long Learning", "72.9", "Achieved"]
        ]),
        ("CRITERION 3: PROGRAM CURRICULUM", "The curriculum follows AICTE model curriculum with 160 credits distributed across Basic Sciences, Engineering Core, and Electives."),
        ("Credit Distribution", [
            ["Category", "Credits", "AICTE Norm"],
            ["Basic Sciences", "32", "15-20%"],
            ["Prof. Core", "52", "30-40%"],
            ["Project Work", "14", "8-10%"],
            ["Total", "160", "Compliant"]
        ]),
        ("CRITERION 4: STUDENT PERFORMANCE", "Admission quality is high (opening rank <5000). Pass percentage and placement rates are consistently improving."),
        ("University Results (Last 3 Years)", [
            ["Year", "Pass %", "First Class %"],
            ["2022-23", "96%", "67%"],
            ["2023-24", "95%", "65%"],
            ["2024-25", "90%", "60%"]
        ]),
        ("CRITERION 5: FACULTY INFORMATION", "The department has a student-faculty ratio of 15:1. 40% of faculty hold PhD degrees."),
        ("Faculty Profile", [
            ["Designation", "Count", "PhD Holders"],
            ["Professor", "5", "5"],
            ["Assoc. Prof", "10", "8"],
            ["Asst. Prof", "35", "7"]
        ]),
        ("CRITERION 6: FACILITIES", "The department has 8 specialized labs, 10 Smart Classrooms, and 100% WiFi coverage."),
        ("Lab Infrastructure", [
            ["Lab Name", "Equipment/Software", "Investment"],
            ["AI/ML Lab", "GPU Stations, TensorFlow", "45 Lakhs"],
            ["IoT Lab", "RasPi, Sensors", "12 Lakhs"],
            ["Cloud Lab", "AWS, Docker", "8 Lakhs"]
        ]),
        ("CRITERION 7: CONTINUOUS IMPROVEMENT", "IQAC conducts annual academic audits. Feedback from students, alumni, and employers is analyzed to improve curriculum and pedagogy."),
        ("Improvement Actions", [
            ["Gap Identified", "Action Taken"],
            ["Low Research", "Research Bootcamp Introduced"],
            ["Soft Skills", "Communication Lab Setup"],
            ["Industry Gap", "New Electives Added"]
        ])
    ]

def get_attainment_content():
    return [
        ("COURSE OUTCOME (CO) ATTAINMENT REPORT", "Semester: 5 | Academic Year: 2024-25"),
        ("Part A: Course Outcome Attainment", "Example Course: Data Structures (CSE201)"),
        ("CO-PO Mapping Matrix", [
             ["CO", "PO1", "PO2", "PO3", "PO4", "PO5", "PO6"],
             ["CO1", "3", "3", "-", "-", "2", "-"],
             ["CO2", "3", "3", "3", "1", "3", "-"],
             ["CO3", "3", "3", "3", "2", "3", "-"]
        ]),
        ("Direct Assessment (80%)", [
             ["Assessment", "Method", "Score"],
             ["Internal 1", "Exam", "75%"],
             ["Internal 2", "Exam", "78%"],
             ["End Sem", "Exam", "76%"],
             ["Lab", "Practical", "80%"]
        ]),
        ("Final CO Attainment", [
             ["CO", "Direct", "Indirect", "Final", "Status"],
             ["CO1", "74%", "84%", "76%", "Achieved"],
             ["CO2", "67%", "80%", "69%", "Achieved"],
             ["CO3", "67%", "78%", "69%", "Achieved"]
        ]),
        ("Part B: Program Outcome Attainment", "PO Attainment is calculated as weighted average of CO attainment."),
        ("PO Attainment Summary", [
             ["PO", "Attainment %", "Status"],
             ["PO1", "75.2", "Achieved"],
             ["PO2", "72.8", "Achieved"],
             ["PO3", "68.5", "Achieved"],
             ["PO4", "65.3", "Achieved"]
        ]),
        ("Part C: Gap Analysis", [
             ["Gap", "Root Cause", "Action Plan"],
             ["PO4 (Invest.)", "Limited Lab Time", "Add Research Projects"],
             ["PO10 (Comm.)", "Lack of Practice", "More Presentations"]
        ])
    ]

def get_ga_content():
    return [
        ("GRADUATE ATTRIBUTE TRACKING REPORT", "Tracking Period: 2021-2024 (3 Years)"),
        ("Executive Summary", "All 12 Graduate Attributes (GAs) are consistently above the 60% threshold. Strongest areas: Modern Tool Usage (GA5) and Ethics (GA8)."),
        ("3-Year GA Attainment Trends", [
             ["Graduate Attribute (GA)", "2021-22", "2022-23", "2023-24", "Trend"],
             ["GA1 - Engg Knowledge", "72.5%", "74.2%", "75.2%", "Increasing"],
             ["GA2 - Analysis", "70.8%", "71.5%", "72.8%", "Increasing"],
             ["GA3 - Design/Dev", "67.2%", "67.8%", "68.5%", "Stable"],
             ["GA4 - Investigation", "63.5%", "64.2%", "65.3%", "Increasing"],
             ["GA5 - Modern Tools", "72.4%", "75.2%", "78.4%", "Strong Increase"]
        ]),
        ("Stakeholder Assessment (2023-24)", [
             ["GA", "Student (Direct)", "Alumni (Survey)", "Employer"],
             ["GA1", "75.2%", "84%", "86%"],
             ["GA5", "78.4%", "90%", "88%"],
             ["GA9", "74.1%", "84%", "86%"]
        ]),
        ("Action Plan for Improvement", [
             ["Priority", "Action", "Timeline"],
             ["GA4 (Investigation)", "Research Bootcamp", "6 Months"],
             ["GA10 (Communication)", "Biz Comm Training", "1 Year"],
             ["GA11 (Proj Mgmt)", "PMP Certification", "2 Years"]
        ])
    ]
