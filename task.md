# AICTE/NAAC Compliance Expansion Task List

- [ ] **Role Implementation (Frontend)**
    - [ ] Add `tpo` (Training & Placement Officer) to `roles.ts` and `OrgStructure.tsx`.
    - [ ] Add `librarian` to `roles.ts` and `OrgStructure.tsx`.
    - [ ] Add `anti_ragging` (Committee) to `roles.ts` and `OrgStructure.tsx`.
    - [ ] Add `sc_st_cell` to `roles.ts` and `OrgStructure.tsx`.
    - [ ] Add `icc` (Internal Complaints Committee) to `roles.ts` and `OrgStructure.tsx`.
    - [ ] Add `grievance` (Committee) to `roles.ts` and `OrgStructure.tsx`.
    - [ ] Add `women_cell` to `roles.ts` and `OrgStructure.tsx`.

- [ ] **Report Configuration (Backend)**
    - [ ] Add all 15 report titles to `backend/app/api/reports.py`.
    - [x] Configure Railway Python Version (Switched to `NIXPACKS_PYTHON_VERSION` Env Var)
    - [ ] Update `ROLE_TEMPLATE_MAPPING` in `reports.py` to assign reports to the new roles (and existing ones like Principal/Dean).
    - [ ] (Optional) Implement mock content generation for these new report types.

- [ ] **Verification**
    - [ ] Verify new nodes appear in Org Chart.
    - [ ] Verify each new role sees their specific reports in Report Builder.
    - [ ] Verify PDF generation (preview) works for new reports.
