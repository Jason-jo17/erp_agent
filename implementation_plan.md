# Implementation Plan - AICTE/NAAC Compliance Expansion

Review required for adding 15 mandatory reports and 7 new roles to achieve 100% compliance.

## Goal
Incorporate the 15 missing reports and ensuring each has a responsible role in the system.

## Proposed Changes

### Frontend (Roles & Hierarchy)
#### [MODIFY] [roles.ts](file:///d:/erp%20agent/frontend/src/data/roles.ts)
Add the following roles:
- **`tpo`**: Training & Placement Officer (Placement Report).
- **`librarian`**: Librarian (Library Report).
- **`anti_ragging`**: Anti-Ragging Committee (Anti-Ragging Report).
- **`sc_st_cell`**: SC/ST/OBC Cell Coordinator (SC/ST Report).
- **`icc`**: ICC Chairperson (ICC Report).
- **`grievance`**: Grievance Redressal Committee (Grievance Report).
- **`women_cell`**: Women Empowerment Cell (Women Cell Report).

#### [MODIFY] [OrgStructure.tsx](file:///d:/erp%20agent/frontend/src/pages/OrgStructure.tsx)
Integrate new roles into the hierarchy:
- **Principal's Children**: Add `anti_ragging`, `icc`, `grievance`, `women_cell`, `sc_st_cell` (Compliance Bodies).
- **Admin Officer's Children**: Add `librarian`, `tpo` (Support Services).

### Backend (Report Configuration)
#### [MODIFY] [reports.py](file:///d:/erp%20agent/backend/app/api/reports.py)
1. Add new report titles to `ALL_REPORTS`.
2. Update `ROLE_TEMPLATE_MAPPING`:
    - **Principal**: Annual Report.
    - **Finance**: Financial Audit.
    - **IQAC**: Academic Audit, Student Feedback.
    - **Anti-Ragging**: Anti-Ragging Report.
    - **SC/ST Cell**: SC/ST/OBC Cell Report.
    - **COE**: Examination Results Analysis.
    - **TPO**: Placement Report.
    - **Deans (Academic)**: Faculty Development Report.
    - **Librarian**: Library Annual Report.
    - **Admin Officer**: Infrastructure Utilization.
    - **Deans (R&D)**: Research Publication Report.
    - **ICC**: Internal Complaints Committee (ICC) Report.
    - **Grievance**: Grievance Redressal Report.
    - **Women Cell**: Women Empowerment Cell Report.

## Verification
- Check Org Chart for new nodes.
- Login as each new role -> Check Report Builder.
