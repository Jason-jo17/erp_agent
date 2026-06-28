# ERP Agent — Full Application Audit
**Date:** 2026-06-28 | **Source:** `Engineering_College_Compliance_Master_Sheet_V1.xlsx` integrated

---

## 1. WHAT'S BUILT vs WHAT'S NOT

### Backend Routes

| Route | Status | Notes |
|-------|--------|-------|
| `POST /api/v1/auth/token` | ✅ Built | JWT auth from Postgres — frontend never calls it |
| `POST /api/v1/chat` | ✅ Working | Core agent orchestration with mock fallback |
| `GET /api/v1/documents/list` | ✅ Working | Role-filtered template list |
| `POST /api/v1/documents/suggestions` | ✅ Working | AI + static content |
| `POST /api/v1/documents/generate` | ✅ Working | PDF via ReportLab |
| `GET /api/v1/documents/download` | ✅ Working | Legacy GET PDF endpoint |
| `POST /api/v1/workflows/start` | ✅ Working | In-memory only, resets on restart |
| `GET /api/v1/workflows/active` | ✅ Working | In-memory |
| `GET /api/v1/accreditation/dashboard` | ✅ Working | Hardcoded mock data |
| `POST /api/v1/accreditation/washington-accord/calculate-attainment` | ⚠️ Stub | Returns mock data |
| `GET /api/v1/accreditation/nac/mbgl-assessment` | ⚠️ Stub | Mock data |
| `POST /api/v1/accreditation/reports/generate-sar` | ⚠️ Stub | Returns mock, no real LLM |
| `GET /api/v1/accreditation/renewal/timeline` | ✅ Working | Mock + event bus |
| Recommendations router | ❌ BROKEN | `recommendations.py` exists but **never registered in main.py** |

### Frontend Pages

| Route | Status | Notes |
|-------|--------|-------|
| `/login` | ✅ UI complete | ❌ No real auth API call |
| `/` | ✅ Fully wired | Core AI agent chat |
| `/org-structure` | ✅ Working | Partial roles shown |
| `/reports/builder` | ✅ Fully functional | Wired to real API |
| `/accreditation` | ✅ Wired to real API | |
| `/finance/budget` | ✅ UI only | No backend data |
| `/finance/approvals` | ✅ UI only | No backend data |
| `/hr` | ✅ UI only | No backend data |
| `/exam` | ✅ UI only | No backend data |
| `/timetable` | ✅ UI only | No backend data |
| `/attendance` | ✅ UI only | No backend data |
| `/assignments` | ✅ UI only | No backend data |
| `/admin/purchase` | ✅ UI only | No backend data |
| `/admin/hiring` | ✅ UI only | No backend data |
| `/students` | ✅ UI only | No backend data |
| `/courses` | ✅ UI only | No backend data |
| `/recommendations` | ⚠️ Broken | Backend endpoint not registered |
| `/finance` | ❌ Placeholder | |
| `/finance/budget/edit` | ❌ Placeholder | |
| `/department/overview` | ❌ Placeholder | |
| `/courses/:id/:subpage` | ❌ Placeholder | |

---

## 2. CRITICAL BUGS (Fix These First)

### Bug 1 — Hardcoded API Key (**CRITICAL SECURITY**)
`backend/app/services/llm_service.py:26`
```python
# WRONG — key is in version-controlled source
self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY") or "sk-or-v1-d9de0c2caa..."
```
**Fix:** Remove the hardcoded fallback. Add `OPENROUTER_API_KEY: str` to Settings in `config.py`.

### Bug 2 — Duplicate `get_response` Method
`llm_service.py:73` and `llm_service.py:140` — two definitions of the same method. First incomplete stub causes `_call_openrouter_full` to be scoped inside `get_response`.  
**Fix:** Delete lines 73–105 (the first incomplete definition).

### Bug 3 — `document_generated` Typo
`llm_service.py:503`
```python
document_generated=[...]   # ← should be documents_generated
```
Pydantic silently ignores the unknown field, documents never show in the workload branch.  
**Fix:** Rename to `documents_generated`.

### Bug 4 — Recommendations Router Not Registered
`backend/app/main.py` never imports `app.api.recommendations`.  
**Fix:** Add `from app.api import recommendations` and `app.include_router(recommendations.router, ...)`.

### Bug 5 — CORS Misconfiguration
```python
allow_origins=["*"], allow_credentials=True  # invalid per CORS spec
```
Credentialed requests rejected by browsers.  
**Fix:** Either use explicit origin list OR set `allow_credentials=False` with wildcard.

### Bug 6 — SECRET_KEY Missing from Settings
`config.py` has no `SECRET_KEY`. `security.py` falls back to `"YOUR_SUPER_SECRET_KEY_CHANGE_ME"` in production.  
**Fix:** Add `SECRET_KEY: str = "change-me"` to Settings class and set via env var.

### Bug 7 — `or True` Forces Mock Always
`llm_service.py:582`
```python
if "projections" in query.lower() or "mock" in query.lower() or True:
```
Every default mock response shows "Mock Mode Active" regardless of input.  
**Fix:** Remove `or True`.

---

## 3. AI AGENT & CONNECTIVITY ISSUES

### Architecture
- **New agent instances per request** — `OrchestratorAgent(db)` inside `chat_message()` creates 9 sub-agents + 2 services every call. Should be a singleton/dependency.
- **No auth on chat endpoint** — Anyone can POST with any `role_id`.
- **Frontend login bypasses JWT** — Login page stores role in localStorage without calling `/api/v1/auth/token`. JWT infrastructure is fully built server-side but unused.
- **History duplication** — `visibleHistory` concatenates userMsg into history, but userMsg was already just appended before the call.

### LLM Connectivity
- **Multi-provider fallback is solid** — Google (2 keys) → 6 OpenRouter free models is good resilience design.
- **Free model rate limits** — All `*:free` OpenRouter models can fail simultaneously under real load.
- **No streaming** — 15s OpenRouter timeout with no streaming blocks UI completely.
- **ChromaDB + sentence-transformers installed but unused** — Knowledge service uses naive keyword search on markdown files.

---

## 4. ROUTE / URL INCONSISTENCY

| Component | URL Pattern | Issue |
|-----------|-------------|-------|
| Chat (`App.tsx:179`) | `/api/v1/chat` (relative) | Goes through Vite proxy in dev |
| ReportBuilder | `${API_BASE_URL}/api/v1/documents/...` | Direct absolute URL |
| AccreditationDashboard | `${API_BASE_URL}/api/v1/accreditation/...` | Direct absolute URL |

In production (Vercel), relative paths `/api/*` are rewritten by `frontend/vercel.json` to Railway — but the vercel.json still has the placeholder Railway URL and must be updated before going live.

---

## 5. PRODUCTION READINESS

| Area | Status | Issue |
|------|--------|-------|
| Security | ❌ Not Ready | Hardcoded key, no auth enforcement, CORS wildcard |
| Auth | ❌ Broken | Frontend bypasses backend JWT |
| Database | ⚠️ Fragile | Postgres optional, no migrations, Mongo/Redis unused |
| Performance | ❌ Poor | Agent objects created per-request |
| Resilience | ✅ Good | Mock fallback on LLM failure |
| Deployment config | ✅ Done | nixpacks.toml, railway.json, vercel.json present |
| Environment vars | ⚠️ Partial | Missing SECRET_KEY; hardcoded OpenRouter key |
| Dependencies | ❌ Bloated | torch, chromadb, sentence-transformers, elasticsearch, minio, celery installed but unused — blow up build time |
| Error handling | ⚠️ Leaky | Raw exception messages returned to clients |
| Logging | ⚠️ Basic | print() only, no structured logging |
| Rate limiting | ❌ Missing | No rate limiting on any endpoint |

---

## 6. MICROSERVICE STATUS

| Service | In requirements.txt | Actually Used |
|---------|---------------------|---------------|
| Postgres (asyncpg) | ✅ | ✅ Partial |
| MongoDB (Motor) | ✅ | ❌ Not wired to any router |
| Redis | ✅ | ❌ |
| Elasticsearch | ✅ | ❌ |
| MinIO | ✅ | ❌ |
| Celery | ✅ | ❌ |
| ChromaDB | ✅ | ❌ |
| Sentence Transformers | ✅ | ❌ |
| Event Bus | Bespoke | ✅ In-memory |
| Workflow Engine | Bespoke | ✅ In-memory (no persistence) |
| RBAC (Permify schema) | Schema file | ❌ Not integrated |

---

## 7. UI/UX GAPS

- **No mobile layout** — Sidebar is `hidden lg:block` with no hamburger/drawer fallback
- **ICC role has wrong examples** — Shows cybersecurity prompts (copy-paste error from another role)
- **OrgStructure missing roles** — TPO, librarian, anti_ragging, sc_st_cell, icc, grievance, women_cell are in `roles.ts` but NOT in the org chart (per task.md)
- **WorkflowStatus widget** — Always empty since in-memory state resets on every deploy
- **Errors use `alert()`** — Several pages use browser `alert()` instead of toast notifications

---

## 8. COMPLIANCE GAPS (from `Engineering_College_Compliance_Master_Sheet_V1.xlsx`)

The Excel defines **38 compliance items** across **9 regulatory bodies**. The app currently handles a subset. Below is what's missing or incomplete in the backend:

### Missing Report Content
The current `reports.py` has content for NAAC SSR, NBA SAR, AQAR, and AICTE disclosure. Missing:

| Report | Excel Priority | Backend Status |
|--------|---------------|----------------|
| AICTE EoA Application | P0 | ❌ Missing content function |
| AICTE Mandatory Disclosure (21 sections) | P1 | ⚠️ Partial |
| NBA SAR C1 (Curriculum/CO-PO matrix) | P1 | ⚠️ Generic |
| NBA SAR C3 (CO-PO Attainment) | P0 | ❌ No actual calculation |
| NBA SAR C4 (Student Performance/APY) | P1 | ⚠️ Generic |
| NBA SAR C5/C6 (Faculty Info + Contributions) | P1 | ❌ Missing |
| NBA SAR C7/C8/C9 (Facilities/Governance) | P2 | ❌ Missing |
| NBA Pre-Qualifier Form | P0 | ❌ Missing |
| NAAC IQAQ Gateway Application | P3 | ❌ Missing |
| NIRF Data Submission (5 parameters) | P2 | ⚠️ Partial |
| AISHE DCF-II (12 blocks) | P2 | ❌ Missing |
| UGC Self-Disclosure (12 categories) | P3 | ❌ Missing |
| EPF/ESIC Monthly ECR | P2 | ❌ Missing |
| Fire Safety NOC Report | P3 | ❌ Missing |
| State Affiliation Dossier | P1 | ❌ Missing |
| Data Consistency Report | P1 | ❌ Missing |
| Accreditation Readiness Scorecard | P0 | ⚠️ Stub only |
| OBE CO Attainment Report | P0 | ❌ Missing |
| Faculty Qualification Report | P1 | ❌ Missing |
| IQAC Quarterly Meeting Report | P1 | ❌ Missing |

### Role→Report Mapping Gaps (RACI Matrix)
The Excel RACI matrix defines who is Responsible/Accountable for each compliance activity. The current `ROLE_TEMPLATE_MAPPING` in `reports.py` is incomplete. Missing mappings:

| Role | Missing Reports |
|------|----------------|
| `principal` | AICTE EoA, Accreditation Readiness Scorecard, Data Consistency Report |
| `hod` | NBA SAR C1/C2/C3, CO Attainment Report, Faculty Qualification Report |
| `iqac` | NAAC IIQA, NIRF, AISHE DCF-II, Data Consistency, IQAC Meeting Report |
| `coe` | APAAR/ABC Upload, Exam Conduct Compliance |
| `admin` | UGC Self-Disclosure, State Affiliation, Fire Safety, EPF/ESIC |
| `hr` (new role) | Faculty Qualification Report, EPF/ESIC ECR |
| `finance` | EPF/ESIC ECR, State Affiliation (audited A/c) |
| `tpo` | NIRF GO metrics, AISHE placement block |
| `nba_coordinator` (new role) | NBA Pre-Qualifier, All SAR Criteria, PACR |
| `compliance_officer` (new role) | Data Consistency Report, Accreditation Readiness |

### Critical Compliance Calendar Deadlines (from Excel Sheet 6)
These deadlines need to be in the system as active alerts:

| Deadline | Activity | Risk Level |
|----------|----------|------------|
| 15th of every month | EPF/ESIC ECR filing | **CRITICAL** |
| Nov 6–20 | AICTE EoA filing window | **CRITICAL** |
| December 31 | NAAC AQAR submission | **CRITICAL** (blocks entire next cycle) |
| January 31 | POSH ICC Annual Report to District Officer | HIGH |
| March 16 | NIRF data submission | HIGH |
| June (per univ) | Annual Affiliation dossier + LIC visit | **CRITICAL** |
| October 15 | AISHE DCF-II submission | MEDIUM |
| Continuous | Faculty ID portal — real-time join/exit | **CRITICAL** |
| Continuous | 75% attendance monitoring | HIGH |

### Key Data Points Missing from System (from Excel Sheet 2 — ERP-LMS Data Map)
The Excel defines what data fields each regulatory form needs. None of these are currently tracked in the database:

- **Faculty Master:** AICTE Faculty ID, Aadhaar-PAN link status, Scopus/WoS verification, PhD institution + year, cadre (1:2:6 ratio), SFR per department
- **Student Master:** APAAR ID, anti-ragging affidavit status, category (SC/ST/OBC/Gen/EWS)
- **OBE Engine:** CO definitions per course, CO-PO correlation matrix (1=Slight/2=Moderate/3=Substantial), Bloom's taxonomy level, direct vs indirect attainment (80:20 formula)
- **Research Module:** Scopus/WoS DOI verification, citation count, h-index, grant sanction letters
- **T&P Module:** Offer letter scans, APY formula (pass in N years / admitted), placement % = placed/eligible (not total)

---

## 9. PRIORITY FIX LIST

### Immediate (blocks current functionality)
1. Register `recommendations` router in `main.py`
2. Fix `document_generated` → `documents_generated` typo in `llm_service.py:503`
3. Remove hardcoded OpenRouter key from source; add to `config.py` Settings
4. Add `SECRET_KEY` to Settings in `config.py`
5. Remove `or True` from mock fallback in `llm_service.py:582`

### High Priority (production blockers)
6. Fix CORS — replace `allow_origins=["*"]` with explicit allowed list
7. Wire frontend login to call `/api/v1/auth/token` and send JWT on all API requests
8. Move `OrchestratorAgent` out of per-request instantiation (singleton via FastAPI dependency)
9. Remove unused heavy deps: sentence-transformers, chromadb, elasticsearch, minio, celery
10. Fix ICC role examples in `roles.ts` (currently shows cybersecurity prompts)

### Medium Priority (compliance completeness)
11. Add missing roles to `OrgStructure.tsx` (per task.md — TPO, librarian, anti_ragging, etc.)
12. Add mobile sidebar/hamburger menu
13. Wire Authorization header on all frontend API calls
14. Replace `alert()` calls with proper toast notifications

### Compliance Integration (from Excel)
15. Update `ALL_REPORTS` in `reports.py` to include all 38 compliance items
16. Update `ROLE_TEMPLATE_MAPPING` with RACI-derived mappings
17. Add proper content functions for: AICTE EoA, NBA SAR all criteria, CO Attainment, NIRF, AISHE, EPF/ESIC, Fire Safety, Data Consistency
18. Add compliance calendar deadlines to knowledge base / agent context
19. Update knowledge base `comprehensive_compliance.md` with real regulatory data from the Excel
20. Implement OBE attainment calculation formula: `CO_direct = (CIE_marks/max)×40% + (SEE_marks/max)×60%`; `PO = Σ(CO_att × corr_level) / Σ(corr_levels)`

---

## 10. WHAT'S WORKING END-TO-END (GREEN STATE)

| Feature | Status |
|---------|--------|
| Chat → Orchestrator → Agent routing → LLM → Response | ✅ Working (with mock fallback) |
| Report Builder → GET suggestions → POST generate → PDF download | ✅ Working |
| Accreditation dashboard → real API data | ✅ Working (mocked data) |
| Workflow start/status/approve | ✅ Working (in-memory) |
| All frontend routes load without 404 | ✅ Working |
| Document download endpoint | ✅ Working |
| Multi-provider LLM fallback | ✅ Working |
| Knowledge base RAG (basic) | ✅ Working |
| Role-based report filtering | ✅ Working |
| Session persistence in localStorage | ✅ Working |
| Mock mode toggle | ✅ Working |
| Error boundary on frontend | ✅ Working |
| Auto-send from navigation state | ✅ Working |

---

## 11. COMPLIANCE INTEGRATION ARCHITECTURE (from Excel Sheet 9 — Build Roadmap)

The Excel defines a 10-week build roadmap. Phase 1 (P0, Weeks 1-2) foundational items that should be the next sprint:

| Component | Purpose | Effort |
|-----------|---------|--------|
| `obe_tracking.py` | Core NBA data engine — CO-PO attainment calculation | 5 days |
| `faculty_disclosure.py` | SFR + cadre + PhD% — gate for EoA and NBA pre-qualifiers | 3 days |
| `scoring_engine.py` | Composite accreditation readiness score — primary Principal dashboard | 5 days |
| `seed_data.py` | AICTE norms, NBA criteria marks, NAAC weights, NIRF parameters | 2 days |
| DB models + Alembic migrations | Faculty, Student, Course, CO_PO_Mapping, Attainment, Alert tables | 1 day |
| `attendance_monitor.py` | Daily 75% gate tracking | 2 days |

**Key formula from Excel (OBE Attainment):**
```
CO_direct = (CIE_marks / max_CIE) × 0.40 + (SEE_marks / max_SEE) × 0.60
CO_indirect = exit_survey_score  # 20% weight
CO_attainment = (CO_direct × 0.80) + (CO_indirect × 0.20)
Attained = CO_attainment >= 60%  # default threshold

PO_attainment = Σ(CO_attainment_i × correlation_level_i) / Σ(correlation_level_i)
# correlation_level: 1=Slight, 2=Moderate, 3=Substantial
```

**Key NIRF Parameters (Excel Sheet 1, Item 20):**
- TLR 30%: FSR (faculty-student ratio), FQE (faculty with PhD), FRU (finance/student)
- RPC 30%: PU (Scopus pubs/faculty), QP (citations), IPR (patents, 15 marks), FPPP (consultancy)
- GO 20%: GPH (placement %), GUE (higher studies %), GMS (median CTC), GPHD (PhD graduates)
- OI 10%: Women %, SC/ST/OBC/PwD %
- Perception 10%: Survey

**NAAC Binary Accreditation (2024 reform):**
- 25% input + 75% process-output
- Engineering: TLE weighted 350/1000 (heaviest criterion)
- AQAR Dec 31 = existential deadline — missing it blocks entire next accreditation cycle
