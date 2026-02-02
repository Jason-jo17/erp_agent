# Report Builder Implementation Walkthrough

I have successfully implemented the Report Builder feature, which allows you to generate AI-assisted reports and customize them before downloading as PDFs.

## Changes Made

### 1. Backend (`backend/app/api/reports.py`)
- **New Endpoint `/suggestions`**: Accepts a template name and context (notes). It prompts the AI (LLM) to generate realistic report data in a structured format.
- **New Endpoint `/generate`**: Accepts structured JSON content (matching the suggestion format) and generates a PDF dynamically. This allows you to print exactly what you see/edit on the frontend.
- **Legacy Support**: Retained existing GET endpoints for backward compatibility.

### 2. Frontend (`frontend/src/pages/ReportBuilder.tsx`)
- **New Page**: Created a `ReportBuilder` component.
    - **Template Selection**: Fetches available templates from the backend.
    - **Context Input**: Allows you to guide the AI with specific notes (e.g., "Focus on placement stats").
    - **AI Generation**: "Generate Suggestions" button calls the backend to get a draft.
    - **Live Editor**: The generated data is displayed in an editable table form. You can modify any number.
    - **PDF Download**: "Download PDF Report" generates the final document from your edited data.

### 3. Navigation
- **App Routing**: Added `/reports/builder` route in `App.tsx`.
- **Sidebar**: Added a "Report Builder" link under the "Administration" section in `Sidebar.tsx`.

## How to Run

1.  **Backend**:
    The backend is running on `http://localhost:8006`.
    *(Started via `python -m uvicorn app.main:app --reload`)*

2.  **Frontend**:
    The frontend is running on `http://localhost:3006`.
    *(Started via `npm run dev`)*

## How to Test
1.  Open the App: [http://localhost:3006](http://localhost:3006).
2.  Login as **Admin** or **Principal**.
3.  In the Sidebar, look for **Report Builder** under Administration.
4.  Select a template (e.g., "AICTE Mandatory Disclosure").
5.  (Optional) Add a note like "Increase intake to 240".
6.  Click **Generate Suggestions**.
7.  Wait for the AI to fill the tables.
8.  Edit the numbers in the table if needed.
9.  Click **Download PDF Report**.
