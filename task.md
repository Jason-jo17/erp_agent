# AICTE/NAAC Compliance Expansion Task List

- [x] **Role Implementation (Frontend)**
    - [x] Add `tpo` (Training & Placement Officer) to `OrgStructure.tsx` — already present
    - [x] Add `librarian` to `OrgStructure.tsx` — already present
    - [x] Add `anti_ragging` (Committee) to `OrgStructure.tsx` — already present
    - [x] Add `sc_st_cell` to `OrgStructure.tsx` — already present
    - [x] Add `icc` (Internal Complaints Committee) to `OrgStructure.tsx` — already present
    - [x] Add `grievance` (Committee) to `OrgStructure.tsx` — already present
    - [x] Add `women_cell` to `OrgStructure.tsx` — already present

- [x] **Report Configuration (Backend)**
    - [x] Add all 47 report titles to `backend/app/api/reports.py` (was 24, expanded to 47)
    - [x] Configure Railway Build: Root `nixpacks.toml` & CPU-only Torch (Definitive Fix)
    - [x] Fix missing dependencies (`reportlab`) caught during deployment crash
    - [x] Update `ROLE_TEMPLATE_MAPPING` in `reports.py` — 15 roles, RACI-derived from Excel
    - [x] Implement content generators for all new compliance report types (AICTE EoA, NBA Pre-Qualifier, CO-PO Attainment, NBA SAR C1/C3/C4/C5+C6, NIRF, AISHE DCF-II, UGC Self-Disclosure, EPF/ESIC, Fire Safety, POSH, Data Consistency, Accreditation Readiness, IQAC Meeting, Faculty Qualification)
    - [x] Update `suggestions` endpoint dispatcher to route all 47 templates to content functions

- [x] **Critical Bug Fixes**
    - [x] Removed hardcoded OpenRouter API key from `llm_service.py`
    - [x] Removed `or True` debug artifact forcing mock mode in `llm_service.py`
    - [x] Fixed `document_generated` typo → `documents_generated` in `llm_service.py`
    - [x] Removed duplicate (incomplete) `get_response` method in `llm_service.py`
    - [x] Added `SECRET_KEY` field to `config.py`
    - [x] Simplified `security.py` to use `settings.SECRET_KEY` directly
    - [x] Fixed CORS: changed `allow_origins=["*"]` → `allow_origins=origins` in `main.py`
    - [x] Registered `recommendations` router in `main.py`

- [x] **Knowledge Base**
    - [x] Rewrote `comprehensive_compliance.md` from Excel Master Sheet V1 (all 9 sheets)
    - [x] Full AICTE/NBA/NAAC/NIRF/AISHE/UGC/EPF/Fire/POSH requirements + deadlines + formulas

- [ ] **Verification**
    - [ ] Verify each role sees their specific reports in Report Builder
    - [ ] Verify PDF generation (preview + download) works for all 47 report types
    - [ ] Test AI chat with real LLM keys (Google Gemini + OpenRouter) after mock mode removal
    - [ ] Update Railway ENV vars: `SECRET_KEY`, `OPENROUTER_API_KEY` (remove hardcoded key)
